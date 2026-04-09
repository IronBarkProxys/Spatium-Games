// ========================================================
// SPATIUM - Clean & Enhanced UI JavaScript
// Improved themes + better colors | No hearts/favorites
// ========================================================

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
let allGames = [];
let recentlyPlayed = JSON.parse(localStorage.getItem('spatium_recentlyPlayed') || '[]');
let currentSortMode = 'name';
let currentParticleStyle = localStorage.getItem('spatium_particleStyle') || 'classic';

// ====================== CANVAS SETUP ======================
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ====================== PARTICLE STYLES ======================
class ClassicParticle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.8 + 1.2;
        this.speedX = Math.random() * 0.5 + 0.15;
        this.speedY = Math.random() * 0.7 + 0.35;
        this.opacity = Math.random() * 0.45 + 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.0007;
        if (this.opacity <= 0.04 || this.y > canvas.height + 40) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#e0e6ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class SparkParticle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 30;
        this.size = Math.random() * 2.2 + 0.9;
        this.speedX = (Math.random() - 0.5) * 3.5;
        this.speedY = -(Math.random() * 6 + 4.5);
        this.opacity = 0.95;
        this.hue = 330;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.1;
        this.opacity -= 0.023;
        this.size *= 0.98;
        if (this.opacity <= 0.08) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(330, 100%, 92%)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff6ec7';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class NebulaParticle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 35 + 22;
        this.speedX = (Math.random() - 0.5) * 0.38;
        this.speedY = (Math.random() - 0.5) * 0.26;
        this.opacity = Math.random() * 0.23 + 0.12;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity = Math.max(0.1, this.opacity + Math.sin(Date.now() / 2000) * 0.004);
        if (Math.abs(this.x) > canvas.width * 1.15) this.speedX *= -0.9;
        if (Math.abs(this.y) > canvas.height * 1.15) this.speedY *= -0.9;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#d4c3ff';
        ctx.shadowBlur = 28;
        ctx.shadowColor = '#b794f4';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// ====================== PARTICLE MANAGER ======================
let currentParticles = [];

function createParticles(style) {
    currentParticles = [];
    const count = style === 'nebula' ? 28 : (style === 'spark' ? 68 : 135);

    for (let i = 0; i < count; i++) {
        if (style === 'spark') currentParticles.push(new SparkParticle());
        else if (style === 'nebula') currentParticles.push(new NebulaParticle());
        else currentParticles.push(new ClassicParticle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentParticles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// ====================== IMPROVED THEMES ======================
const themes = {
    space: {
        '--bg': '#0a0b0f',
        '--surface': '#12151c',
        '--accent': '#8b9eff',
        '--text': '#e8ebf5',
        '--border': '#252a38'
    },
    aquatic: {
        '--bg': '#0b1a24',
        '--surface': '#132a3a',
        '--accent': '#4fc3e0',
        '--text': '#e0f0f8',
        '--border': '#1f3a4f'
    },
    cherry: {
        '--bg': '#1a0f14',
        '--surface': '#26161e',
        '--accent': '#e06c8a',
        '--text': '#f4e8ec',
        '--border': '#3a252e'
    },
    swamp: {
        '--bg': '#0f160f',
        '--surface': '#1a2219',
        '--accent': '#9cc66d',
        '--text': '#e9f0e4',
        '--border': '#2c3828'
    },
    neon: {
        '--bg': '#0c0d14',
        '--surface': '#1a1c2a',
        '--accent': '#ff5ef7',
        '--text': '#ece8f5',
        '--border': '#2a2d44'
    },
    violet: {
        '--bg': '#0f0d1a',
        '--surface': '#1b1729',
        '--accent': '#a78bfa',
        '--text': '#ede9f6',
        '--border': '#2e2943'
    },
    cyber: {
        '--bg': '#0c0f0e',
        '--surface': '#161a19',
        '--accent': '#67f0e0',
        '--text': '#e6f4ef',
        '--border': '#26312d'
    },
    rose: {
        '--bg': '#1a0f13',
        '--surface': '#26171d',
        '--accent': '#ff6b9d',
        '--text': '#f3e8eb',
        '--border': '#3b252e'
    },
    midnight: {
        '--bg': '#02050f',
        '--surface': '#0f172a',
        '--accent': '#94a3c0',
        '--text': '#e2e8f0',
        '--border': '#334155'
    }
};

function setTheme(themeName) {
    const root = document.documentElement;
    const theme = themes[themeName];
    if (!theme) return;

    Object.keys(theme).forEach(key => {
        root.style.setProperty(key, theme[key]);
    });

    document.querySelectorAll('.theme-option').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-theme') === themeName);
    });

    saveSettings();
}

// ====================== SETTINGS ======================
function saveSettings() {
    const activeThemeEl = document.querySelector('.theme-option.active');
    const themeName = activeThemeEl ? activeThemeEl.getAttribute('data-theme') : 'space';
    const particlesEnabled = document.getElementById('particlesToggle')?.checked ?? true;

    localStorage.setItem('spatium_theme', themeName);
    localStorage.setItem('spatium_particles', particlesEnabled);
    localStorage.setItem('spatium_particleStyle', currentParticleStyle);
    localStorage.setItem('spatium_recentlyPlayed', JSON.stringify(recentlyPlayed));
}

function loadSavedSettings() {
    const savedTheme = localStorage.getItem('spatium_theme') || 'midnight';
    setTheme(savedTheme);

    const particlesEnabled = localStorage.getItem('spatium_particles') !== 'false';
    const savedStyle = localStorage.getItem('spatium_particleStyle') || 'classic';

    currentParticleStyle = savedStyle;
    const styleSelect = document.getElementById('particleStyle');
    if (styleSelect) styleSelect.value = savedStyle;

    const toggle = document.getElementById('particlesToggle');
    if (toggle) {
        toggle.checked = particlesEnabled;
        toggleParticles(particlesEnabled);
    }

    recentlyPlayed = JSON.parse(localStorage.getItem('spatium_recentlyPlayed') || '[]');
}

function toggleParticles(enabled) {
    const canvasEl = document.getElementById('particles');
    if (canvasEl) canvasEl.style.opacity = enabled ? '0.65' : '0';
}

function changeParticleStyle(style) {
    currentParticleStyle = style;
    createParticles(style);
    saveSettings();
}

// ====================== GAME FUNCTIONS ======================
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

        console.log(`✅ Loaded ${allGames.length} games`);

        const featured = allGames.filter(g => g.featured === true);
        displayGames(featured, 'featuredGrid');
        displayGames(allGames, 'allGamesGrid');
        displayTrending();

        loadingScreen.classList.add('fade-out');
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 600);

    } catch (err) {
        console.error("Load error:", err);
        loadingText.textContent = "Failed to load games. Check console (F12)";
    }
}

function displayGames(games, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (games.length === 0) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #888; padding: 4rem;">No games found</p>`;
        return;
    }

    games.forEach(game => {
        const div = document.createElement('div');
        div.className = 'zone-item';
        div.innerHTML = `
            <img src="${game.thumbnail}"
                 alt="${game.name}"
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${encodeURIComponent(game.name)}'">
            <button>${game.name}</button>
        `;
        div.addEventListener('click', () => openGame(game));
        container.appendChild(div);
    });
}

function displayTrending() {
    const container = document.getElementById('trendingWrapper');
    if (!container) return;
    container.innerHTML = '';

    let trendingGames = allGames.filter(g => g.trending === true);
    if (trendingGames.length === 0) trendingGames = allGames.slice(0, 8);

    trendingGames.forEach(game => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.style.cursor = 'pointer';
        slide.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.name}" 
                 onerror="this.src='https://via.placeholder.com/280x380/1a1a1a/ffffff?text=${encodeURIComponent(game.name)}'">
            <p>${game.name}</p>
        `;
        slide.addEventListener('click', () => openGame(game));
        container.appendChild(slide);
    });
}

let searchTimeout;
function filterGames() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = document.getElementById('searchBar').value.toLowerCase().trim();
        if (!query) {
            displayGames(allGames, 'allGamesGrid');
            return;
        }
        const filtered = allGames.filter(game => 
            game.name.toLowerCase().includes(query)
        );
        displayGames(filtered, 'allGamesGrid');
    }, 280);
}

function openGame(game) {
    const viewer = document.getElementById('zoneViewer');
    const frame = document.getElementById('zoneFrame');
    const title = document.getElementById('zoneName');

    title.textContent = game.name;
    frame.src = `games/${game.folder}/index.html`;
    viewer.style.display = 'flex';

    const gameId = game.folder || game.name;
    recentlyPlayed = recentlyPlayed.filter(id => id !== gameId);
    recentlyPlayed.unshift(gameId);
    if (recentlyPlayed.length > 12) recentlyPlayed.pop();

    saveSettings();
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

// ====================== SETTINGS & MODALS ======================
function openSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
    document.getElementById('siteTitleInput').value = document.title;
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
    saveSettings();
}

function openInAboutBlank() {
    try {
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
            newTab.document.write(`<script>window.location.href = "${window.location.href}";<\/script>`);
            closeSettings();
        } else {
            alert("Popup blocked! Please allow popups.");
        }
    } catch (e) {
        alert("Could not open new tab.");
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
        alert("Favicon updated!");
    };
    reader.readAsDataURL(file);
}

// ====================== KEYBOARD & UTILITIES ======================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case 'escape': closeZone(); break;
            case 'f':
                if (document.getElementById('zoneViewer').style.display === 'flex') fullscreenZone();
                break;
            case 's': openSettings(); break;
            case '/': case 'k':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    document.getElementById('searchBar').focus();
                }
                break;
            case 'r':
                if (allGames.length > 0) {
                    const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
                    openGame(randomGame);
                }
                break;
        }
    });
}

function addRandomButton() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    const randomBtn = document.createElement('button');
    randomBtn.className = 'btn-icon';
    randomBtn.title = "I'm Feeling Lucky (Press R)";
    randomBtn.innerHTML = `🎲`;
    randomBtn.onclick = () => {
        if (allGames.length > 0) {
            const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
            openGame(randomGame);
        }
    };
    headerActions.appendChild(randomBtn);
}

function sortZones() {
    const select = document.getElementById('sortOptions');
    if (!select) return;
    currentSortMode = select.value;
    let sorted = [...allGames];
    if (currentSortMode === 'id') sorted.reverse();
    displayGames(sorted, 'allGamesGrid');
}

// ====================== INIT ======================
window.onload = () => {
    resizeCanvas();
    createParticles(currentParticleStyle);
    animateParticles();

    loadSavedSettings();
    loadGames();

    addRandomButton();
    setupKeyboardShortcuts();

    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.addEventListener('input', filterGames);

    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeZone();
    });

    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) saveSettings();
        });
    }

    console.log("🚀 Spatium loaded with improved colors & themes");
};
