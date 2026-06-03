const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");
const alertBox = document.getElementById("custom-alert");
const alertMessage = document.getElementById("alert-message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    loginButton.disabled = true;
    loginButton.textContent = "Waiting...";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const userData = {
        username: username,
        password: password,
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Bad username or password.");
        }

        const result = await response.json();

        localStorage.setItem("token", result.token);
        localStorage.setItem("username", username);

        const params = new URLSearchParams(window.location.search);
        const redirectPage = params.get("redirect") || "../index.html";

        window.location.href = redirectPage;
    } catch (error) {
        console.error("Chyba:", error);
        
        if(error.message === "Bad username or password.") {
            alertMessage.textContent = "Invalid username or password.";
            alertBox.classList.add("alert-show");
            
            setTimeout(() => {
                loginButton.textContent = "LOGIN";
                loginButton.disabled = false;
                alertBox.classList.remove("alert-show");
            }, 2000);
            return;
        }
        
        alertMessage.textContent = "An error with database occurred.";
        alertBox.classList.add("alert-show");
            
            setTimeout(() => {
                loginButton.textContent = "LOGIN";
                loginButton.disabled = false;
                alertBox.classList.remove("alert-show");
            }, 2000);
    }
});