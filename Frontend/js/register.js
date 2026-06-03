const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");
const registerButton = document.getElementById("RegisterButton");
const alertBox = document.getElementById("custom-alert");
const alertMessage = document.getElementById("alert-message");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    registerButton.disabled = true;
    registerButton.textContent = "Waiting...";

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordAgain = document.getElementById("password-again").value;

    const userData = {
        username: username,
        password: password,
        email: email
    }

    if(password !== passwordAgain) {
        alertMessage.textContent = "Passwords do not match.";
        alertBox.classList.add("alert-show");
            
        setTimeout(() => {
            alertBox.classList.remove("alert-show");
            registerButton.disabled = false;
            registerButton.textContent = "REGISTER";
        }, 2000);
        return;
    }

    if(username.length < 3) {
        alertMessage.textContent = "Username must be at least 3 characters long.";
        alertBox.classList.add("alert-show");
        
        setTimeout(() => {
            alertBox.classList.remove("alert-show");
            registerButton.disabled = false;
            registerButton.textContent = "REGISTER";
        }, 2000);

        return;
    }

    if(username.length > 12) {
        alertMessage.textContent = "Username must be no more than 12 characters long.";
        alertBox.classList.add("alert-show");
        
        setTimeout(() => {
            alertBox.classList.remove("alert-show");
            registerButton.disabled = false;
            registerButton.textContent = "REGISTER";
        }, 2000);

        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        console.log(response);

        if (!response.ok) {
            throw new Error("Bad username.");
        }
        
        window.location.href = "login.html";

    } catch (error) {
        console.error("Chyba:", error);
        
        if(error.message === "Bad username.") {
            alertMessage.textContent = "Username already exists.";
            alertBox.classList.add("alert-show");
            
            setTimeout(() => {
                alertBox.classList.remove("alert-show");
                registerButton.disabled = false;
                registerButton.textContent = "REGISTER";
            }, 2000);
            return;
        }
        alertMessage.textContent = "An error with database occurred.";
        alertBox.classList.add("alert-show");
        
        setTimeout(() => {
            alertBox.classList.remove("alert-show");
            registerButton.disabled = false;
            registerButton.textContent = "REGISTER";
        }, 2000);
    }
});