document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/games")
        .then(response => response.json())
        .then(data => {
            displayGames(data.mostPlayedGames, "mostPlayedGames");
            displayGames(data.trendingGames, "trendingGames");
            displayGames(data.popularReleases, "popularReleases");
            displayGames(data.hotReleases, "hotReleases");
        })
        .catch(error => console.error("Error fetching game data:", error));
});

function displayGames(games, sectionId) {
    const section = document.getElementById(sectionId);
    games.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";

        const gameHero = document.createElement("img");
        gameHero.className = "hero";
        gameHero.src = game.hero || game.images[0]; // Use hero image if available, else use the first grid image
        gameCard.appendChild(gameHero);

        const gameTitle = document.createElement("h3");
        gameTitle.innerText = game.title;
        gameCard.appendChild(gameTitle);

        section.appendChild(gameCard);
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll(".game-section");
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove("hidden");
        } else {
            section.classList.add("hidden");
        }
    });
}
