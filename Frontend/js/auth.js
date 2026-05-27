function getLoggedUser() {
    const user = localStorage.getItem("loggedUser");

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return JSON.parse(user);
}