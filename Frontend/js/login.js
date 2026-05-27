const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const userData = {
        username: username,
        password: password,
    }

    try {
        const response = await fetch("https://localhost:7179/api/squirrels/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        console.log(response);

        if (!response.ok) {
            throw new Error("Bad username or password.");
        }
        
        window.location.href = "./../html/index.html";

    } catch (error) {
        console.error("Chyba:", error);
        if(error.message === "Bad username or password.") {
            message.textContent = "Invalid username or password.";
            return;
        }
        message.textContent = "An error occurred during login.";
    }
});