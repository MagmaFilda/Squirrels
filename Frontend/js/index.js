const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (isLoggedIn()) {
    // místo login obrázku zobrazí username
    loginBtn.innerHTML = "";

    const usernameText = document.createElement("span");
    usernameText.textContent = getLoggedUser();
    usernameText.classList.add("username-text");

    const length = usernameText.textContent.length;
    const fontSize = Math.max(12, Math.min(24, 36 - length * 2));

    usernameText.style.fontSize = `${fontSize}px`;

    loginBtn.appendChild(usernameText);

    // aby username nebylo klikací na login
    loginBtn.removeAttribute("href");

    // zobrazí logout
    logoutBtn.style.display = "flex";

} else {
    // když není přihlášený, zobrazí login button
    loginBtn.href = "html/login.html";

    // schová logout
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