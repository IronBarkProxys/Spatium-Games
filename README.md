# 🍒 Cherri Game Vault

A clean and simple unblocked games site with a bunch of HTML5 games that actually work.

I made this because I got tired of slow or broken game sites at school. Everything runs in the browser — no downloads, no logins, just click and play.

## Game Sources

All the games come from this big public list:

**Ultimate Game Stash**  
https://docs.google.com/document/d/1_FmH3BlSBQI7FGgAQL59-ZPe8eCxs35wel6JUyVaG8Q/edit?tab=t.0

That's where I pull most of the games from. It gets updated pretty often, so I'll keep adding new ones when I can.

## How to Play

1. Open the site
2. Scroll or search for a game
3. Click on it
4. Use the buttons on top for fullscreen or open in a new tab if you want

Works on Chromebooks, phones, and laptops.

## Folder Structure

cherri/
├── index.html
├── games/
│   ├── monkey-mart/
│   │   └── index.html
│   ├── slope/
│   │   └── index.html
│   └── ... (more games coming)
├── thumbnails/
│   ├── monkey-mart.png
│   └── slope.png
├── games.json
└── README.md


Each game goes in its own folder inside `games/`. The main file inside every game folder must be named `index.html`.

## Adding New Games

Want to add a game?

1. Create a new folder inside `games/` (example: `slope` or `2048`)
2. Put the game's `index.html` and any other files it needs inside that folder
3. Add a thumbnail in the `thumbnails/` folder
4. Open `games.json` and add a new line like this:

```json
{
  "id": 2,
  "name": "Slope",
  "folder": "slope",
  "thumbnail": "thumbnails/slope.png",
  "category": "arcade"
}



🎯 How to Play

Open index.html or visit your GitHub Pages link
Browse or search for a game
Click any game card → it opens in the built-in player
Use Fullscreen, New Tab, or Close buttons


🌐 Live Demo
(Once deployed, add your GitHub Pages link here)
Example: https://yourusername.github.io/cherri/

⚠️ Legal & Disclaimer

This project is not affiliated with any game developers.
All games are sourced from public links and the "Ultimate Game Stash" document.
We respect copyright. If a game owner wants their content removed, please contact us.
This site is made purely for educational and entertainment purposes.

No assets are hosted illegally — we only provide a frontend player.

🛠 Tech Stack

Pure HTML + CSS + JavaScript
iframe-based game player (supports multi-file games)
GitHub Pages hosting (free & fast)
Responsive & mobile-friendly


📈 Future Plans

None rn js trying to get the site on its feet
but im also working on a proxy search
unblocked movies
a music player
and much more so join the Discord to stay updated :)

🤝 Contributing
Want to help?

Fork the repo
Add new games to /games/ and update games.json
Submit a Pull Request

All contributions are welcome — especially new games and thumbnail improvements!

⭐ Credits & Thanks

Ik I already told you about the Ultimate Game Stash, but it is so good I have to bring it up again.
Ultimate Game Stash — The massive Google Doc that powers most of the collection:
https://docs.google.com/document/d/1_FmH3BlSBQI7FGgAQL59-ZPe8eCxs35wel6JUyVaG8Q
Inspired by gn-math and other unblocked game sites
Built with love using Figtree font and custom particles


📬 Contact / Support

Discord: https://discord.gg/6fJ8GrsjMz
