// ========================================================
// SPATIUM - Original Enhanced UI JavaScript
// With hearts/favorites restored
// ========================================================

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
let allGames = [];
let favorites = JSON.parse(localStorage.getItem('spatium_favorites') || '[]');
let recentlyPlayed = JSON.parse(localStorage.getItem('spatium_recentlyPlayed') || '[]');
let currentSortMode = 'name';
let currentView = 'all';

// ====================== CANVAS & PARTICLES ======================
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
        this.hueShift = Math.random() * 20 - 10;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity = Math.max(0.1, this.opacity - 0.0005);
        if (this.x > canvas.width + 100 || this.y > canvas.height + 100 || this.opacity <= 0.1) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(210, 30%, 95%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

// ====================== THEMES ======================
const themes = {
    space: { '--bg': '#000000', '--surface': '#111111', '--accent': '#f365ac', '--text': '#eeeeee', '--border': '#333333' },
    aquatic: { '--bg': '#0a1f2f', '--surface': '#132e44', '--accent': '#00d4ff', '--text': '#eeeeee', '--border': '#2a4a66' },
    cherry: { '--bg': '#1a0f14', '--surface': '#2c1b22', '--accent': '#ff8ac4', '--text': '#eeeeee', '--border': '#4a2f38' },
    swamp: { '--bg': '#0f1a0f', '--surface': '#1f2a1f', '--accent': '#7cff7c', '--text': '#eeeeee', '--border': '#2f3f2f' },
    neon: { '--bg': '#0a0a1f', '--surface': '#1a1a3a', '--accent': '#ff00ff', '--text': '#eeeeee', '--border': '#3a3a66' },
    violet: { '--bg': '#0f0a1f', '--surface': '#1f1533', '--accent': '#c26bff', '--text': '#eeeeee', '--border': '#3a2f55' },
    cyber: { '--bg': '#0d0d0d', '--surface': '#1f1f1f', '--accent': '#00ff9f', '--text': '#eeeeee', '--border': '#3f3f3f' },
    rose: { '--bg': '#1f0f14', '--surface': '#2f1b22', '--accent': '#ff4d94', '--text': '#eeeeee', '--border': '#4a2f38' },
    midnight: {
        '--bg': '#020617',
        '--surface': '#0f172a',
        '--accent': '#64748b',
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
    console.log(`🎨 Theme applied: ${themeName}`);
}

// ====================== LOCALSTORAGE & SETTINGS ======================
function saveSettings() {
    const activeThemeEl = document.querySelector('.theme-option.active');
    const themeName = activeThemeEl ? activeThemeEl.getAttribute('data-theme') : 'space';
    const particlesEnabled = document.getElementById('particlesToggle').checked;

    localStorage.setItem('spatium_theme', themeName);
    localStorage.setItem('spatium_particles', particlesEnabled);
    localStorage.setItem('spatium_favorites', JSON.stringify(favorites));
    localStorage.setItem('spatium_recentlyPlayed', JSON.stringify(recentlyPlayed));
}

function loadSavedSettings() {
    const savedTheme = localStorage.getItem('spatium_theme') || 'midnight';
    setTheme(savedTheme);

    const particlesEnabled = localStorage.getItem('spatium_particles') !== 'false';
    const toggle = document.getElementById('particlesToggle');
    if (toggle) {
        toggle.checked = particlesEnabled;
        toggleParticles(particlesEnabled);
    }

    favorites = JSON.parse(localStorage.getItem('spatium_favorites') || '[]');
    recentlyPlayed = JSON.parse(localStorage.getItem('spatium_recentlyPlayed') || '[]');
}

// ====================== GAME LOADING ======================
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

        if (allGames.length === 0) throw new Error("No games found");

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
        loadingText.style.color = "#f365ac";
    }
}

// ====================== DISPLAY FUNCTIONS ======================
function displayGames(games, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (games.length === 0) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #888; padding: 4rem;">No games found</p>`;
        return;
    }

    games.forEach(game => {
        const isFavorite = favorites.includes(game.folder || game.name);
        const div = document.createElement('div');
        div.className = 'zone-item';
        div.innerHTML = `
            <img src="${game.thumbnail}"
                 alt="${game.name}"
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${encodeURIComponent(game.name)}'">
            <button>${game.name}</button>
            <div class="favorite-heart ${isFavorite ? 'active' : ''}" data-game="${game.folder || game.name}">
                ❤️
            </div>
        `;

        div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('favorite-heart')) {
                openGame(game);
            }
        });

        const heart = div.querySelector('.favorite-heart');
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(game, heart);
        });

        container.appendChild(div);
    });
}

function toggleFavorite(game, heartElement) {
    const gameId = game.folder || game.name;
    if (favorites.includes(gameId)) {
        favorites = favorites.filter(id => id !== gameId);
        heartElement.classList.remove('active');
    } else {
        favorites.push(gameId);
        heartElement.classList.add('active');
    }
    saveSettings();
}

// Trending display
function displayTrending() {
    const container = document.getElementById('trendingWrapper');
    if (!container) return;

    container.innerHTML = '';
    let trendingGames = allGames.filter(game => game.trending === true);
    if (trendingGames.length === 0) trendingGames = allGames.slice(0, 8);

    trendingGames.forEach(game => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.style.cursor = 'pointer';
        slide.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.name}" onerror="this.src='https://via.placeholder.com/280x380/1a1a1a/ffffff?text=${encodeURIComponent(game.name)}'">
            <p>${game.name}</p>
        `;
        slide.addEventListener('click', () => openGame(game));
        container.appendChild(slide);
    });
}

// ====================== SEARCH WITH DEBOUNCE ======================
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

// ====================== GAME VIEWER ======================
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

function toggleParticles(enabled) {
    const canvasEl = document.getElementById('particles');
    canvasEl.style.opacity = enabled ? '0.6' : '0';
    saveSettings();
}

function openInAboutBlank() {
    try {
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
            newTab.document.write(`
                <script>window.location.href = "${window.location.href}";<\/script>
            `);
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

// ====================== KEYBOARD SHORTCUTS ======================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        switch (e.key.toLowerCase()) {
            case 'escape':
                closeZone();
                break;
            case 'f':
                if (document.getElementById('zoneViewer').style.display === 'flex') fullscreenZone();
                break;
            case 's':
                openSettings();
                break;
            case '/':
            case 'k':
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

// ====================== SORT ======================
function sortZones() {
    const select = document.getElementById('sortOptions');
    if (!select) return;

    currentSortMode = select.value;
    let sorted = [...allGames];
    if (currentSortMode === 'id') {
        sorted.reverse();
    }
    displayGames(sorted, 'allGamesGrid');
}

// ====================== INIT ======================
window.onload = () => {
    resizeCanvas();
    initParticles();
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

    console.log("🚀 Spatium UI fully loaded with hearts & favorites");
};
