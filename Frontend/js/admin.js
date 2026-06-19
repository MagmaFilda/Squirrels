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
            method: "GET",
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
            usernameCell.textContent = user.name;

            const moneyCell = document.createElement("td");
            moneyCell.textContent = user.money;

            const squirrelsCell = document.createElement("td");
            const showSquirrelsBtn = document.createElement("button");
            showSquirrelsBtn.textContent = "Show squirrels";
            showSquirrelsBtn.classList.add("btn", "btn-sm", "btn-primary");

            showSquirrelsBtn.setAttribute("data-bs-toggle", "modal");
            showSquirrelsBtn.setAttribute("data-bs-target", "#squirrelsModal");
            showSquirrelsBtn.setAttribute("data-username", user.name);

            const userSquirrels = user.squirrels || [];
            showSquirrelsBtn.setAttribute("data-squirrels", JSON.stringify(userSquirrels));

            squirrelsCell.appendChild(showSquirrelsBtn);

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




// Obsluha modalu po kliknutí na tlačítko "Show squirrels"
const squirrelsModal = document.getElementById('squirrelsModal');
if (squirrelsModal) {
    squirrelsModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        
        const username = button.getAttribute('data-username');
        const squirrels = JSON.parse(button.getAttribute('data-squirrels') || '[]');

        document.getElementById('modal-username').textContent = username;
        
        const listContainer = document.getElementById('modal-squirrels-list');
        listContainer.innerHTML = ''; 

        if (squirrels.length === 0) {
            listContainer.innerHTML = '<li class="list-group-item text-muted text-center py-4">Tento uživatel nemá žádné veverky. 🐿️❌</li>';
        } else {
            squirrels.forEach(squirrel => {
                // 1. Zformátování jména
                const displayName = squirrel.returningSquirrel.name
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ");

                // 2. Určení textu rarit (stejně jako to máš v allSquirrels)
                let rarityText = "";
                const rarityValue = squirrel.returningSquirrel.rarity;
                
                if (rarityValue === 0) {
                    rarityText = "Common";
                } else if (rarityValue === 1) {
                    rarityText = "Rare";
                } else if (rarityValue === 2) {
                    rarityText = "Epic";
                } else if (rarityValue === 3) {
                    rarityText = "Legendary";
                }

                // 3. Počet kusů
                const count = squirrel.count;

                // Vytvoření řádku v modalu (Jméno - Rarita - Počet)
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                
                li.innerHTML = `
                    <div>
                        <span class="fw-bold">🐿️ ${displayName}</span>
                        <span class="text-muted ms-2">(${rarityText})</span>
                    </div>
                    <span class="badge bg-primary rounded-pill">Počet: ${count}</span>
                `;
                
                listContainer.appendChild(li);
            });
        }
    });
}




