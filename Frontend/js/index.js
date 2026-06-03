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
function automatickeZmenseni() {
  // 1. Najdi tvůj hlavní herní box (změň název třídy podle tvého kódu)
  const hra = document.querySelector('.game-container'); 

  if (!hra) return;

  // 2. Nastav rozměry tvého monitoru, na kterém to teď vypadá dobře
  const mojeSirka = 1920; 
  const mojeVyska = 1080;

  // 3. JS zjistí aktuální velikost okna prohlížeče (třeba u kamaráda)
  const oknoSirka = window.innerWidth;
  const oknoVyska = window.innerHeight;

  // 4. Spočítá se poměr, o kolik je jeho okno menší než tvoje
  const pomer = Math.min(oknoSirka / mojeSirka, oknoVyska / mojeVyska);

  // 5. Čistě přes JS aplikujeme zmenšení a vycentrování
  hra.style.transform = scale(${pomer});
  hra.style.transformOrigin = 'center center';

  // Tento řádek zajistí, že se pod hru nezatoulá scrollbar
  document.body.style.overflow = 'hidden'; 
}

// Spustí se hned při načtení stránky
window.addEventListener('load', automatickeZmenseni);
// Spustí se pokaždé, když někdo změní velikost okna (nebo dá F11 / celou obrazovku)
window.addEventListener('resize', automatickeZmenseni);
﻿
andreww
snakethug69
 


