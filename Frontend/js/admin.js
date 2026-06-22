const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";
const usersTableBody = document.getElementById("users-table-body");
const squirrelsTableBody = document.getElementById("squirrels-table-body");
const addSquirrelForm = document.getElementById("addSquirrelForm");
const addSquirrelButton = document.getElementById("addSquirrelButton");

let globalCatalog = [];

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

        usersTableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");

            const usernameCell = document.createElement("td");
            usernameCell.textContent = user.name;

            // ZMĚNA ZDE: Vytvoření klikatelného elementu pro peníze
            const moneyCell = document.createElement("td");
            const editMoneyBtn = document.createElement("button");
            editMoneyBtn.textContent = `${user.money} 💰`; // Ukáže částku a ikonku peněz
            editMoneyBtn.classList.add("btn", "btn-sm", "btn-outline-warning", "fw-bold", "text-dark");
            
            // Nastavení atributů pro spuštění modalu
            editMoneyBtn.setAttribute("data-bs-toggle", "modal");
            editMoneyBtn.setAttribute("data-bs-target", "#editMoneyModal");
            editMoneyBtn.setAttribute("data-username", user.name);
            editMoneyBtn.setAttribute("data-money", user.money);
            
            moneyCell.appendChild(editMoneyBtn);

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

        globalCatalog = squirrels;

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
        const userSquirrels = JSON.parse(button.getAttribute('data-squirrels') || '[]');

        document.getElementById('modal-username').textContent = username;
        
        const listContainer = document.getElementById('modal-squirrels-list');
        listContainer.innerHTML = ''; 

        // Pokud ještě není katalog načtený ze serveru
        if (globalCatalog.length === 0) {
            listContainer.innerHTML = '<li class="list-group-item text-muted text-center py-4">Katalog veverek se ještě načítá... ⏳</li>';
            return;
        }

        // Procházíme VŠECHNY veverky z katalogu
        globalCatalog.forEach(catalogSquirrel => {
            
            // 1. Zjistíme, jestli uživatel tuto veverku má (hledáme shodu ID nebo jména)
            const ownedData = userSquirrels.find(s => s.squirrelId === catalogSquirrel.id || s.squirrelId === catalogSquirrel.name);
            
            // 2. Počet (pokud ji má, vezmeme počet, jinak 0)
            const count = ownedData ? ownedData.count : 0;
            const displayName = catalogSquirrel.name;

            // 3. Určení textu a barvy rarit pro hezčí UI
            let rarityText = "Unknown";
            let rarityColor = "secondary"; // Třída pro Bootstrap odznáček (badge)

            if (catalogSquirrel.rarity === 0) {
                rarityText = "Common";
                rarityColor = "#bf6c65";
            } else if (catalogSquirrel.rarity === 1) {
                rarityText = "Rare";
                rarityColor = "#159cab";
            } else if (catalogSquirrel.rarity === 2) {
                rarityText = "Epic";
                rarityColor = "#68419d";
            } else if (catalogSquirrel.rarity === 3) {
                rarityText = "Legendary";
                rarityColor = "#aaaf1b";
            }

            // Vytvoření řádku v modalu (Jméno + Rarita - Input - Počet - Tlačítko)
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            li.innerHTML = `
                <div>
                    <span class="fw-bold">🐿️ ${displayName}</span>
                    <span class="badge bg-${rarityColor} ms-2 text-white">${rarityText}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <input type="number" class="form-control form-control-sm add-amount-input" style="width: 70px;" value="1">
                    
                    <span class="badge bg-primary text-white rounded-pill current-count-badge">Počet: ${count}</span>
                    
                    <button class="btn btn-sm btn-outline-success btn-icon add-btn" title="Přidat">
                        <span class="spinner-border spinner-border-sm d-none me-1 btn-spinner" role="status" aria-hidden="true"></span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check m-0 btn-icon-svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                    </button>
                </div>
            `;

            // Nalezení elementů v řádku pro event listenery
            const inputEl = li.querySelector('.add-amount-input');
            const btnEl = li.querySelector('.add-btn');
            const spinnerEl = li.querySelector('.btn-spinner');
            const svgIconEl = li.querySelector('.btn-icon-svg');

            btnEl.addEventListener('click', async () => {
                const amountToAdd = parseInt(inputEl.value, 10);

                if (!isNaN(amountToAdd) && amountToAdd !== 0) {
                    
                    // Vizuální indikace načítání
                    btnEl.disabled = true;
                    svgIconEl.classList.add('d-none');
                    spinnerEl.classList.remove('d-none');

                    try {
                        // OPRAVA: Vždy vezmeme ID přímo z objektu katalogu (catalogSquirrel)
                        const squirrelIdToSend = catalogSquirrel.id; 

                        // ====================================================================
                        // ODESLÁNÍ NA BACKEND
                        // ====================================================================
                        const response = await fetch(`${API_BASE_URL}/changeUserSquirrels/${username}/${squirrelIdToSend}/${amountToAdd}`, {
                            method: "DELETE", // Zkontroluj metodu na backendu (DELETE vs POST/PUT)
                            headers: {
                                "Authorization": `Bearer ${getToken()}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error("Nepodařilo se upravit veverku na backendu.");
                        }

                        // Backend potvrdil uložení -> reload
                        window.location.reload();

                    } catch (error) {
                        console.error("Chyba při upravení počtu:", error);
                        alert("Něco se pokazilo při úpravě počtu veverky!");
                    } finally {
                        // Vrácení tlačítka do původního stavu
                        btnEl.disabled = false;
                        svgIconEl.classList.remove('d-none');
                        spinnerEl.classList.add('d-none');
                    }
                }
            });

            listContainer.appendChild(li);
        });
    });
}




// Obsluha modalu pro úpravu peněz
const editMoneyModal = document.getElementById('editMoneyModal');
if (editMoneyModal) {
    let currentEditingUsername = "";

    // Při otevření modalu si natáhneme data z tlačítka
    editMoneyModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        
        currentEditingUsername = button.getAttribute('data-username');
        const currentMoney = button.getAttribute('data-money');

        // Změníme nadpis, ať je jasné, komu peníze upravujeme
        document.getElementById('editMoneyModalLabel').textContent = `Peníze: ${currentEditingUsername}`;
        
        // Nastavíme do inputu aktuální částku
        const moneyInput = document.getElementById('edit-money-input');
        moneyInput.value = 0;
    });

    // Odeslání nové částky po kliku na fajfku
    const saveBtn = document.getElementById('save-money-btn');
    saveBtn.addEventListener('click', async () => {
        const moneyInput = document.getElementById('edit-money-input');
        const newAmount = parseInt(moneyInput.value, 10);

        if (!isNaN(newAmount)) {
            try {
                // Zamkneme tlačítko proti dvojkliku
                saveBtn.disabled = true;

                // ====================================================================
                // ODESLÁNÍ NA BACKEND - UPRAV SI URL A METODU PODLE SVÉHO API!
                // ====================================================================
                const response = await fetch(`${API_BASE_URL}/changeMoney/${currentEditingUsername}/${newAmount}`, {
                    method: "PUT", // Zkontroluj, jakou metodu backend čeká (POST/PUT/PATCH)
                    headers: {
                        "Authorization": `Bearer ${getToken()}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Nepodařilo se upravit peníze na backendu.");
                }

                // Hotovo, obnovíme stránku pro zobrazení nových hodnot
                window.location.reload();

            } catch (error) {
                console.error("Chyba při úpravě peněz:", error);
                alert("Něco se pokazilo při úpravě peněz!");
            } finally {
                saveBtn.disabled = false;
            }
        }
    });
}