const loggedUser = getLoggedUser();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (loggedUser) {
    // místo login obrázku zobrazí username
    loginBtn.innerHTML = "";

    const usernameText = document.createElement("span");
    usernameText.textContent = loggedUser.username;
    usernameText.classList.add("username-text");

    loginBtn.appendChild(usernameText);

    // aby username nebylo klikací na login
    loginBtn.removeAttribute("href");

    // zobrazí logout
    logoutBtn.style.display = "flex";

} else {
    // když není přihlášený, zobrazí login button
    loginBtn.href = "./../html/login.html";

    // schová logout
    logoutBtn.style.display = "none";
}

logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    logout();
});