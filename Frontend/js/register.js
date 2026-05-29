const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");
const registerButton = document.getElementById("RegisterButton");

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
        message.textContent = "Passwords do not match.";
        return;
    }

    try {
        const response = await fetch("https://localhost:7179/api/squirrels/register", {
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
        
        message.textContent = "User was successfully registered.";
        window.location.href = "./../html/index.html";

    } catch (error) {
        console.error("Chyba:", error);
        if(error.message === "Bad username.") {
            message.textContent = "Username already exists.";
            return;
        }
        message.textContent = "An error occurred during registration.";
    }
});