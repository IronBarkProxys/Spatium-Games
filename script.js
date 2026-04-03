const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

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

        if (this.x > canvas.width + 100 || this.y > canvas.height + 100) {
            this.reset();
        }
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
    for (let i = 0; i < 90; i++) {
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

// ====================== LOADING SCREEN ======================
const loadingScreen = document.getElementById("loadingScreen");
const loadingText = document.getElementById("loadingText");

// ====================== GAME LOADING ======================
let allGames = [];

async function loadGames() {
    try {
        const res = await fetch('games.json?t=' + Date.now());
        const data = await res.json();

        allGames = data.games || [];

        const total = allGames.length;
        let loaded = 0;

        displayGamesWithProgress(allGames, total, loaded);

    } catch (err) {
        console.error("Failed to load games.json:", err);

        document.getElementById('allZones').innerHTML = `
            <p style="text-align:center; color:#888; grid-column:1/-1;">
                Failed to load games.
            </p>
        `;

        hideLoader();
    }
}

function displayGamesWithProgress(games, total, loaded) {
    const container = document.getElementById('allZones');
    container.innerHTML = '';

    function loadNext(index) {
        if (index >= games.length) {
            hideLoader();
            return;
        }

        const game = games[index];

        const div = document.createElement('div');
        div.className = 'zone-item';

        div.innerHTML = `
            <img src="${game.thumbnail}" 
                 alt="${game.name}"
                 onerror="this.src='https://dummyimage.com/300x170/111/fff&text=${encodeURIComponent(game.name)}'">
            <button>${game.name}</button>
        `;

        div.addEventListener('click', () => openGame(game));
        container.appendChild(div);

        loaded++;
        loadingText.textContent = `Loading games... (${loaded}/${total})`;

        setTimeout(() => loadNext(index + 1), 2);
    }

    loadNext(0);
}

function hideLoader() {
    loadingScreen.classList.add("fade-out");

    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 500);
}

// ====================== SEARCH ======================
function filterGames() {
    const query = document.getElementById('searchBar').value.toLowerCase().trim();

    if (!query) {
        displayGamesWithProgress(allGames, allGames.length, 0);
        return;
    }

    const filtered = allGames.filter(game =>
        game.name.toLowerCase().includes(query)
    );

    const container = document.getElementById('allZones');
    container.innerHTML = '';

    filtered.forEach(game => {
        const div = document.createElement('div');
        div.className = 'zone-item';

        div.innerHTML = `
            <img src="${game.thumbnail}">
            <button>${game.name}</button>
        `;

        div.addEventListener('click', () => openGame(game));
        container.appendChild(div);
    });
}

// ====================== GAME PLAYER ======================
function openGame(game) {
    const viewer = document.getElementById('zoneViewer');
    const frame = document.getElementById('zoneFrame');
    const title = document.getElementById('zoneName');

    title.textContent = game.name;
    frame.src = `/Spatium-Games/games/${game.folder}/index.html`;

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

    if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    }
}

// ====================== SETTINGS ======================
const settingsBtn = document.getElementById("openSettings");
const modal = document.getElementById("settingsModal");

const closeSettings = document.getElementById("closeSettings");

settingsBtn.onclick = () => modal.style.display = "flex";
closeSettings.onclick = () => modal.style.display = "none";

// Theme switch
document.getElementById("themeSelect").onchange = (e) => {
    if (e.target.value === "light") {
        document.documentElement.style.setProperty("--bg", "#ffffff");
        document.documentElement.style.setProperty("--surface", "#f1f1f1");
        document.documentElement.style.setProperty("--text", "#000000");
        document.documentElement.style.setProperty("--border", "#cccccc");
    } else {
        document.documentElement.style.setProperty("--bg", "#0a0a0a");
        document.documentElement.style.setProperty("--surface", "#111111");
        document.documentElement.style.setProperty("--text", "#eeeeee");
        document.documentElement.style.setProperty("--border", "#333333");
    }
};

// Custom colors
document.getElementById("bgColor").oninput = (e) => {
    document.documentElement.style.setProperty("--bg", e.target.value);
};

document.getElementById("surfaceColor").oninput = (e) => {
    document.documentElement.style.setProperty("--surface", e.target.value);
};

// Toggle particles
let particlesEnabled = true;
document.getElementById("toggleParticles").onclick = () => {
    particlesEnabled = !particlesEnabled;
    canvas.style.display = particlesEnabled ? "block" : "none";
};

// Change title
document.getElementById("titleInput").oninput = (e) => {
    document.title = e.target.value || "Spatium";
};

// Change favicon
document.getElementById("faviconInput").oninput = (e) => {
    if (!e.target.value) return;

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
    }
    link.href = e.target.value;
};

// About:blank launcher
document.getElementById("openAboutBlank").onclick = () => {
    const win = window.open("about:blank");

    win.document.write(`
        <html>
        <head><title>Spatium</title></head>
        <body style="margin:0;overflow:hidden;">
            <iframe src="${location.href}" style="border:none;width:100%;height:100vh;"></iframe>
        </body>
        </html>
    `);
};

// ====================== INIT ======================
window.onload = () => {
    resizeCanvas();
    initParticles();
    animateParticles();

    loadGames();

    document.getElementById('searchBar').addEventListener('input', filterGames);

    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeZone();
    });
};
