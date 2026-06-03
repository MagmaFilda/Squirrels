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
    const availableWidth = buttonWidth * 0.55;

    textElement.style.fontSize = `${fontSize}px`;

    while (textElement.scrollWidth > availableWidth && fontSize > minFontSize) {
        fontSize--;
        textElement.style.fontSize = `${fontSize}px`;
    }

    console.log("buttonWidth:", buttonWidth);
    console.log("textWidth:", textElement.scrollWidth);
    console.log("fontSize:", fontSize);
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
        
        bgMusic.volume = volumeSlider.value;

        volumeSlider.addEventListener("input", function () {
            bgMusic.volume = volumeSlider.value;
        });

        function spustitHudbuPoKliknuti() {
            bgMusic.play().then(() => {
                document.removeEventListener("click", spustitHudbuPoKliknuti);
            }).catch(error => {
                console.log("Prohlížeč ještě blokuje audio, čekám na kliknutí.");
            });
        }

        document.addEventListener("click", spustitHudbuPoKliknuti);
    }
});