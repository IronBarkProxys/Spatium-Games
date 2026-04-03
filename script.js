 // ====================== PARTICLES ======================
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

        // ✅ Progress simulation (based on total games)
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

        // hide loader anyway
        hideLoader();
    }
}

// ✅ Display with loading counter updates
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

        // small delay makes progress visible
        setTimeout(() => loadNext(index + 1), 2);
    }

    loadNext(0);
}

// ✅ Hide loader
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
        displayGames(allGames);
        return;
    }

    const filtered = allGames.filter(game =>
        game.name.toLowerCase().includes(query)
    );

    displayGames(filtered);
}

// ====================== GAME PLAYER ======================
function openGame(game) {
    const viewer = document.getElementById('zoneViewer');
    const frame = document.getElementById('zoneFrame');
    const title = document.getElementById('zoneName');

    title.textContent = game.name;

    frame.src = `/Spatium-Games/games/${game.folder}/index.html`;

    viewer.style.display = 'flex';

    console.log("Opening:", frame.src);
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

// ====================== INIT ======================
window.onload = () => {
    resizeCanvas();
    initParticles();
    animateParticles();

    loadGames();

    document.getElementById('searchBar').addEventListener('input', filterGames);

    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeZone();
        }
    });
};
