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
        ctx.fillStyle = '#ffffff';
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
    for (let p of particles) {
        p.update();
        p.draw();
    }
    requestAnimationFrame(animateParticles);
}

// ====================== GAME LOADING ======================
let allGames = [];

async function loadGames() {
    try {
        const response = await fetch('games.json?t=' + Date.now());
        const data = await response.json();
        allGames = data.games || [];
        displayGames(allGames);
    } catch (err) {
        console.error("Failed to load games.json", err);
        document.getElementById('allZones').innerHTML = `
            <p style="color:#888; text-align:center; grid-column:1/-1; padding:2rem;">
                Failed to load games. Please refresh the page.
            </p>`;
    }
}

function displayGames(games) {
    const container = document.getElementById('allZones');
    container.innerHTML = '';

    games.forEach(game => {
        const div = document.createElement('div');
        div.className = 'zone-item';

        div.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.name}"
                 onerror="this.src='https://dummyimage.com/300x170/1a1a1a/ffffff&text=${encodeURIComponent(game.name)}'">
            <button>${game.name}</button>
        `;

        div.onclick = () => openGame(game);
        container.appendChild(div);
    });
}

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

// ====================== GAME OPENING (FIXED) ======================
function openGame(game) {
    document.getElementById('zoneName').textContent = game.name;
    
    const frame = document.getElementById('zoneFrame');

    // 🔥 FIXED PATH (uses folder instead of non-existent "file")
    frame.src = `games/${game.folder}/index.html`;

    document.getElementById('zoneViewer').style.display = 'flex';
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

// ====================== INIT ======================
window.onload = () => {
    resizeCanvas();
    initParticles();
    animateParticles();

    loadGames();

    document.getElementById('searchBar').addEventListener('input', filterGames);

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            closeZone();
        }
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
    });
};
