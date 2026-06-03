const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

function fitUsernameToButton(button, textElement) {
    const maxFontSize = 24;
    const minFontSize = 8;

    let fontSize = maxFontSize;

    textElement.style.fontSize = `${fontSize}px`;
    textElement.style.whiteSpace = "nowrap";
    textElement.style.display = "inline-block";
    textElement.style.maxWidth = "100%";
    textElement.style.overflow = "hidden";
    textElement.style.textOverflow = "ellipsis";

    const availableWidth = button.clientWidth * 0.75;

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

    requestAnimationFrame(() => {
        fitUsernameToButton(loginBtn, usernameText);
    });

    window.addEventListener("resize", () => {
        fitUsernameToButton(loginBtn, usernameText);
    });

    loginBtn.removeAttribute("href");
    loginBtn.style.cursor = "default";

    logoutBtn.style.display = "flex";
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