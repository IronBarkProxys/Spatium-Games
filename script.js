const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - 100;
        this.size = Math.random() * 3 + 1.5;
        this.speedX = Math.random() * 0.7 + 0.3;
        this.speedY = Math.random() * 0.9 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width + 100 || this.y > canvas.height + 100) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 90; i++) particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

let allGames = [];

async function loadGames() {
    const loadingText = document.getElementById('loadingText');
    const loadingScreen = document.getElementById('loadingScreen');
    try {
        loadingText.textContent = "Loading games...";
        const res = await fetch('games.json?t=' + Date.now());
        if (!res.ok) throw new Error("games.json not found");
        const data = await res.json();
        allGames = (data.games || data).sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        if (allGames.length === 0) throw new Error("No games in JSON");
        console.log(`✅ Loaded ${allGames.length} games`);

        const featured = allGames.filter(game => game.featured === true);
        displayGames(featured, 'featuredGrid');
        console.log(`Featured games: ${featured.length}`);

        displayTrending();
        displayGames(allGames, 'allGamesGrid');

        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 600);
    } catch (err) {
        console.error("Load error:", err);
        loadingText.textContent = "Failed to load games. Check console (F12)";
        loadingText.style.color = "#f365ac";
    }
}

function displayGames(games, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }
    container.innerHTML = '';
    if (games.length === 0) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #888; padding: 3rem;">No games found</p>`;
        return;
    }
    games.forEach(game => {
        const div = document.createElement('div');
        div.className = 'zone-item';
        div.innerHTML = `
            <img src="${game.thumbnail}"
                 alt="${game.name}"
                 onerror="this.src='https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${encodeURIComponent(game.name)}'">
            <button>${game.name}</button>
        `;
        div.addEventListener('click', () => openGame(game));
        container.appendChild(div);
    });
}

function displayTrending() {
    const container = document.getElementById('trendingWrapper');
    if (!container) {
        console.error("Container #trendingWrapper not found in HTML");
        return;
    }
    container.innerHTML = '';
    let trendingGames = allGames.filter(game => game.trending === true);
    console.log(`Trending games marked: ${trendingGames.length}`);
    if (trendingGames.length === 0) {
        trendingGames = allGames.slice(0, 8);
        console.warn("⚠️ No games with 'trending: true'. Showing first 8 games as fallback.");
    }
    trendingGames.forEach(game => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.style.cursor = 'pointer';
        slide.innerHTML = `
            <img src="${game.thumbnail}"
                 alt="${game.name}"
                 onerror="this.src='https://via.placeholder.com/280x380/1a1a1a/ffffff?text=${encodeURIComponent(game.name)}'">
            <p>${game.name}</p>
        `;
        slide.addEventListener('click', () => openGame(game));
        container.appendChild(slide);
    });
}

function filterGames() {
    const query = document.getElementById('searchBar').value.toLowerCase().trim();
    if (!query) {
        displayGames(allGames, 'allGamesGrid');
        return;
    }
    const filtered = allGames.filter(game =>
        game.name.toLowerCase().includes(query)
    );
    displayGames(filtered, 'allGamesGrid');
}

function openGame(game) {
    const viewer = document.getElementById('zoneViewer');
    const frame = document.getElementById('zoneFrame');
    const title = document.getElementById('zoneName');
    title.textContent = game.name;
    frame.src = `games/${game.folder}/index.html`;
    viewer.style.display = 'flex';
}

function closeZone() {
    const viewer = document.getElementById('zoneViewer');
    const frame = document.getElementById('zoneFrame');
    viewer.style.display = 'none';
    frame.src = 'about:blank';
}

function fullscreenZone() {
    const frame = document.getElementById('zoneFrame');
    if (frame.requestFullscreen) frame.requestFullscreen();
    else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
}

function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
    document.getElementById('siteTitleInput').value = document.title;
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function toggleParticles(enabled) {
    const canvas = document.getElementById('particles');
    canvas.style.opacity = enabled ? '0.6' : '0';
}

function openInAboutBlank() {
    try {
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
            newTab.document.write(`
                <script>
                    window.location.href = "${window.location.href}";
                <\/script>
            `);
            closeSettings();
        } else {
            alert("❌ Popup blocked!\n\nPlease allow popups for this site and try again.");
        }
    } catch (e) {
        console.error("About:blank error:", e);
        alert("Could not open new tab.\nTry right-clicking the page → Open link in new tab.");
    }
}

function changeSiteTitle() {
    const newTitle = document.getElementById('siteTitleInput').value.trim();
    if (newTitle) {
        document.title = newTitle;
        closeSettings();
    }
}

function uploadFavicon() {
    const fileInput = document.getElementById('faviconUpload');
    const file = fileInput.files[0];
    if (!file) return alert("Please select an image");
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('favicon').href = e.target.result;
        closeSettings();
        alert("✅ Favicon updated! (hard refresh if it doesn't change immediately)");
    };
    reader.readAsDataURL(file);
}

// ==================== EXPANDED THEMES ====================
const themes = {
    space: { 
        '--bg': '#000000', 
        '--surface': '#111111', 
        '--accent': '#f365ac' 
    },
    aquatic: { 
        '--bg': '#0a1f2f', 
        '--surface': '#132e44', 
        '--accent': '#00d4ff' 
    },
    cherry: { 
        '--bg': '#1a0f14', 
        '--surface': '#2c1b22', 
        '--accent': '#ff8ac4' 
    },
    swamp: { 
        '--bg': '#0f1a0f', 
        '--surface': '#1f2a1f', 
        '--accent': '#7cff7c' 
    },
    // New themes added below
    neon: { 
        '--bg': '#0a0a1f', 
        '--surface': '#1a1a3a', 
        '--accent': '#ff00ff' 
    },
    violet: { 
        '--bg': '#0f0a1f', 
        '--surface': '#1f1533', 
        '--accent': '#c26bff' 
    },
    cyber: { 
        '--bg': '#0d0d0d', 
        '--surface': '#1f1f1f', 
        '--accent': '#00ff9f' 
    },
    rose: { 
        '--bg': '#1f0f14', 
        '--surface': '#2f1b22', 
        '--accent': '#ff4d94' 
    },
    midnight: { 
        '--bg': '#05050f', 
        '--surface': '#0f0f1f', 
        '--accent': '#6e9eff' 
    },
    sunset: { 
        '--bg': '#1a0f0a', 
        '--surface': '#2a1b14', 
        '--accent': '#ff6b4d' 
    }
};

function setTheme(themeName) {
    const root = document.documentElement;
    const theme = themes[themeName];
    
    if (theme) {
        Object.keys(theme).forEach(key => {
            root.style.setProperty(key, theme[key]);
        });
        
        // Update active state on theme buttons
        document.querySelectorAll('.theme-option').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-theme') === themeName);
        });
        
        console.log(`Theme changed to: ${themeName}`);
    }
    
    closeSettings();
}

window.onload = () => {
    resizeCanvas();
    initParticles();
    animateParticles();
    loadGames();

    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.addEventListener('input', filterGames);

    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeZone();
    });
};
