const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";

const addSquirrelForm = document.getElementById("addSquirrelForm");
const addSquirrelButton = document.getElementById("addSquirrelButton");

if (!isLoggedIn()) {
    window.location.href = "../index.html";
    alert("You must log in to access the admin panel.");
} else {
    isAdmin();
}

async function isAdmin() {
    try {
        const response = await fetch(`${API_BASE_URL}/isAdmin`,
        {
            headers:
            {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to check admin status.");
        }

    } catch (error) {
        console.error("Chyba:", error);
        window.location.href = "../index.html";
    }
}

addSquirrelForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    addSquirrelButton.disabled = true;
    addSquirrelButton.textContent = "Adding Squirrel...";

    const squirrelName = document.getElementById("squirrelName").value;
    const squirrelDescription = document.getElementById("squirrelDescription").value;
    const squirrelCost = document.getElementById("squirrelCost").value;
    const squirrelRarity = document.getElementById("squirrelRarity").value;
    const squirrelStrength = document.getElementById("squirrelStrength").value;
    const squirrelSpeed = document.getElementById("squirrelSpeed").value;
    const squirrelDurability = document.getElementById("squirrelDurability").value;

    const newSquirrelData = {
        name: squirrelName,
        description: squirrelDescription,
        cost: squirrelCost,
        rarity: squirrelRarity,
        strength: squirrelStrength,
        speed: squirrelSpeed,
        durability: squirrelDurability
    }

    try {
        const response = await fetch(`${API_BASE_URL}/addSquirrelToDatabase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(newSquirrelData)
        });

        console.log(response);

        if (!response.ok) {
            throw new Error("Failed to add squirrel.");
        }

        alert("Squirrel added successfully!");
        addSquirrelForm.reset();
        addSquirrelButton.disabled = false;
        addSquirrelButton.textContent = "Add Squirrel";

    } catch (error) {
        console.error("Chyba:", error);
    }
});