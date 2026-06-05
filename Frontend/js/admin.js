const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";
const usersTableBody = document.getElementById("users-table-body");
const squirrelsTableBody = document.getElementById("squirrels-table-body");
const addSquirrelForm = document.getElementById("addSquirrelForm");
const addSquirrelButton = document.getElementById("addSquirrelButton");

if (!isLoggedIn()) {
    window.location.href = "../index.html";
    alert("You must log in to access the admin panel.");
} else {
    isAdmin();
    allUsers();
    allSquirrels();
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

async function allUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/getUsers`, {
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load users.");
        }

        const users = await response.json();

        console.log(users);

        usersTableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");

            const usernameCell = document.createElement("td");
            usernameCell.textContent = user.Name;

            const moneyCell = document.createElement("td");
            moneyCell.textContent = user.Money;

            const squirrelsCell = document.createElement("td");
            squirrelsCell.textContent = user.Squirrels;

            row.appendChild(usernameCell);
            row.appendChild(moneyCell);
            row.appendChild(squirrelsCell);

            usersTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Chyba:", error);
    }
}


async function allSquirrels() {
    try {
        const response = await fetch(`${API_BASE_URL}/catalog`);

        if (!response.ok) {
            throw new Error("Failed to load squirrels.");
        }

        const squirrels = await response.json();

        squirrelsTableBody.innerHTML = "";

        squirrels.forEach(squirrel => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = squirrel.id;

            const nameCell = document.createElement("td");
            nameCell.textContent = squirrel.name;

            const priceCell = document.createElement("td");
            priceCell.textContent = squirrel.cost;

            const rarityCell = document.createElement("td");

            if(squirrel.rarity === 0) {
                rarityCell.textContent = "Common";
            } else if(squirrel.rarity === 1) {
                rarityCell.textContent = "Rare";
            } else if(squirrel.rarity === 2) {
                rarityCell.textContent = "Epic";
            } else if(squirrel.rarity === 3) {
                rarityCell.textContent = "Legendary";
            }

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(rarityCell);

            squirrelsTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Chyba:", error);
    }
}







