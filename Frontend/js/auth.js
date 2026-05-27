function getLoggedUser() {
    const user = localStorage.getItem("loggedUser");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "./../html/index.html";
}