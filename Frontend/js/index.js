const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

function fitUsernameToButton(button, textElement) {
    const maxFontSize = 24;
    const minFontSize = 6;

    let fontSize = maxFontSize;

    textElement.style.whiteSpace = "nowrap";
    textElement.style.display = "block";
    textElement.style.textAlign = "center";
    textElement.style.lineHeight = "1";
    textElement.style.overflow = "hidden";
    textElement.style.textOverflow = "ellipsis";

    // reálná šířka buttonu
    const buttonWidth = button.getBoundingClientRect().width;

    // kolik místa má text uvnitř buttonu
    const availableWidth = buttonWidth * 0.45;

    textElement.style.fontSize = `${fontSize}px`;

    while (textElement.scrollWidth > availableWidth && fontSize > minFontSize) {
        fontSize--;
        textElement.style.fontSize = `${fontSize}px`;
    }

}

if (isLoggedIn()) {
    loginBtn.innerHTML = "";

    const usernameText = document.createElement("span");
    usernameText.textContent = getLoggedUser();
    usernameText.classList.add("username-text");

    loginBtn.appendChild(usernameText);

    loginBtn.removeAttribute("href");
    loginBtn.style.cursor = "default";

    logoutBtn.style.display = "flex";

    // počká na vykreslení stránky
    requestAnimationFrame(() => {
        fitUsernameToButton(loginBtn, usernameText);
    });

    // počká na načtení fontů
    if (document.fonts) {
        document.fonts.ready.then(() => {
            fitUsernameToButton(loginBtn, usernameText);
        });
    }

    // při změně velikosti okna
    window.addEventListener("resize", () => {
        fitUsernameToButton(loginBtn, usernameText);
    });

    loginBtn.onmouseenter = function () {
        loginBtn.style.transform = "scale(1)";
    };

    loginBtn.onmouseleave = function () {
        loginBtn.style.transform = "scale(1)";
    };

} else {
    loginBtn.href = "html/login.html";
    logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    logout();
});

document.addEventListener("DOMContentLoaded", function () {
    const bgMusic = document.getElementById("bgMusic");
    const volumeSlider = document.getElementById("volumeSlider");

    if (bgMusic && volumeSlider) {
        const savedVolume = localStorage.getItem("musicVolume");

        if (savedVolume !== null) {
            bgMusic.volume = savedVolume;
            volumeSlider.value = savedVolume;
        } else {
            bgMusic.volume = volumeSlider.value;
            localStorage.setItem("musicVolume", volumeSlider.value);
        }

        volumeSlider.addEventListener("input", function () {
            bgMusic.volume = volumeSlider.value;
            localStorage.setItem("musicVolume", volumeSlider.value);
        });

        function spustitHudbuPoKliknuti() {
            bgMusic.play().then(() => {
                document.removeEventListener("click", spustitHudbuPoKliknuti);
            }).catch(() => {
                console.log("Prohlížeč ještě blokuje audio, čekám na kliknutí.");
            });
        }

        document.addEventListener("click", spustitHudbuPoKliknuti);
    }
});

const leaderboardOverlay = document.getElementById('leaderboard-overlay');
const openLeaderboardBtn = document.getElementById('open-leaderboard-btn');
const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');

openLeaderboardBtn.addEventListener('click', () => {
    leaderboardOverlay.classList.add('active');
    loadLeaderboard();
});

closeLeaderboardBtn.addEventListener('click', () => {
    leaderboardOverlay.classList.remove('active');
});

leaderboardOverlay.addEventListener('click', (e) => {
    if (e.target === leaderboardOverlay) {
        leaderboardOverlay.classList.remove('active');
    }
});

const leaderboardData = document.getElementById("leaderboard-data");

async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`);

        if (!response.ok) {
            throw new Error("Failed to load leaderboard.");
        }

        const leaderboard = await response.json();

        leaderboardData.innerHTML = "";

        leaderboard.slice(0, 10).forEach((player, index) => {
            const row = document.createElement("tr");

            if (index === 0) {
                row.classList.add("rank-1");
            } else if (index === 1) {
                row.classList.add("rank-2");
            } else if (index === 2) {
                row.classList.add("rank-3");
            }

            row.innerHTML = `
                <td>#${index + 1}</td>
                <td>${player.username}</td>
                <td class="game-number">${player.count}</td>
            `;

            leaderboardData.appendChild(row);
        });

    } catch (error) {
        console.error("Chyba:", error);

        leaderboardData.innerHTML = `
            <tr>
                <td colspan="3">Failed to load leaderboard.</td>
            </tr>
        `;
    }
}