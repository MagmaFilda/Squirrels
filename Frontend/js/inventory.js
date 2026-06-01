const loggedUser = getLoggedUser();
const inventoryGrid = document.getElementById('inventoryGrid');
const nutsCount = document.getElementById("nut-count");
    
let selectedSquirrelId = null;

if (!loggedUser) {
    inventoryGrid.innerHTML = '<p>You must <a href="login.html?redirect=invertory.html">log in</a> to see your inventory.</p>';
} else {
    loadInventory();
    readMoney();
}

async function readMoney() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/readMoney/${loggedUser.id}`);

        if (!response.ok) {
            throw new Error("Failed to load money.");
        }

        nutsCount.innerText = await response.text();
    } catch (error) {
        console.error("Chyba:", error);
    }
}

async function loadInventory() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/inventory/${loggedUser.id}`);

        if (!response.ok) {
            throw new Error("Failed to load inventory.");
        }

        const squirrels = await response.json();
        //console.log(squirrels);
        inventoryGrid.innerHTML = "";

        squirrels.forEach(squirrel => {
            const displayName = squirrel.returningSquirrel.name
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");

            const slot = document.createElement("div");

            slot.style.cursor = 'pointer';
            
            if(squirrel.returningSquirrel.rarity === 0) {
                slot.classList.add("item-slot", "common");
            } else if(squirrel.returningSquirrel.rarity === 1) {
                slot.classList.add("item-slot", "rare");
            } else if(squirrel.returningSquirrel.rarity === 2) {
                slot.classList.add("item-slot", "epic");
            } else if(squirrel.returningSquirrel.rarity === 3) {
                slot.classList.add("item-slot", "legendary");
            }

            const img = document.createElement("img");
            img.src = `./../images/${squirrel.returningSquirrel.name}.png`;
            img.alt = displayName;

            const count = document.createElement("span");
            count.classList.add("item-count");
            count.textContent = squirrel.count;

            slot.appendChild(img);
            slot.appendChild(count);

            const modalData = {
                squirrelId: squirrel.returningSquirrel.id,
                name: displayName,
                desc: squirrel.returningSquirrel.description,
                str: squirrel.returningSquirrel.strength,
                spd: squirrel.returningSquirrel.speed,
                dur: squirrel.returningSquirrel.durability,
                price: squirrel.returningSquirrel.cost,
                img: `./../images/${squirrel.returningSquirrel.name}.png`,
                rarity: squirrel.returningSquirrel.rarity,
                count: squirrel.count
            }

            slot.addEventListener("click", () => {
                
                if (modalData) {
                    openModal(modalData);
                }
            });

            inventoryGrid.appendChild(slot);
        });

    } catch (error) {
        console.error("Chyba:", error);
    }
}


const modal = document.getElementById('info-modal'); // [cite: 32]
const modalTitle = document.getElementById('modal-title'); // [cite: 32]
const modalDesc = document.getElementById('modal-desc'); // [cite: 32]
const modalImg = document.getElementById('modal-img'); // [cite: 32]
const modalPrice = document.getElementById('modal-price'); // [cite: 32]

const barStr = document.getElementById('bar-str'); // [cite: 33]
const barSpd = document.getElementById('bar-spd'); // [cite: 33]
const barDur = document.getElementById('bar-dur'); // [cite: 33]
const closeBtn = document.querySelector('.close-btn'); // [cite: 33]

function openModal(data) { // [cite: 34]
    selectedSquirrelId = data.squirrelId;
    selectedSquirrelCount = data.count;
    modalTitle.innerText = data.name; // [cite: 34]
    modalDesc.innerText = data.desc; // [cite: 34]
    modalPrice.innerText = data.price; // [cite: 34]
    modalImg.setAttribute('src', data.img); // [cite: 34]

    barStr.style.width = data.str + '%'; // [cite: 35]
    barSpd.style.width = data.spd + '%'; // [cite: 35]
    barDur.style.width = data.dur + '%'; // [cite: 35]

    modal.classList.add('active'); // [cite: 35]
} // [cite: 35]

closeBtn.addEventListener('click', () => modal.classList.remove('active')); // [cite: 35]

modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); }); // [cite: 36]

const sellOneBtn = document.getElementById('sell-one-btn');
const sellAllBtn = document.getElementById('sell-all-btn');
const sellTenBtn = document.getElementById('sell-ten-btn');

sellOneBtn.addEventListener("click", sellOneSquirrel);
sellTenBtn.addEventListener("click", sellTenSquirrel);
sellAllBtn.addEventListener("click", sellAllSquirrels);

async function sellOneSquirrel() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/sell/${loggedUser.id}/${selectedSquirrelId}/1`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to sell one squirrel.");
        }

        modal.classList.remove("active");
        loadInventory();
        readMoney();

    } catch (error) {
        console.error("Chyba:", error);
    }
}

async function sellTenSquirrel() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/sell/${loggedUser.id}/${selectedSquirrelId}/10`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to sell ten squirrels.");
        }

        modal.classList.remove("active");
        loadInventory();
        readMoney();

    } catch (error) {
        console.error("Chyba:", error);
    }
}

async function sellAllSquirrels() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/sell/${loggedUser.id}/${selectedSquirrelId}/${selectedSquirrelCount}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to sell all squirrels.");
        }

        modal.classList.remove("active");
        loadInventory();
        readMoney();

    } catch (error) {
        console.error("Chyba:", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
        const regexCisla = /([0-9%]+)/g;

        function zpracujTextovyUzel(uzel) {
            if (uzel.nodeType === Node.TEXT_NODE) {
                if (uzel.nodeValue.match(regexCisla) && uzel.parentNode && !uzel.parentNode.classList.contains('game-number')) {
                    const span = document.createElement('span');
                    span.innerHTML = uzel.nodeValue.replace(regexCisla, '<span class="game-number">$1</span>');
                    uzel.parentNode.insertBefore(span, uzel);
                    uzel.parentNode.removeChild(uzel);
                }
            } else if (uzel.nodeType === Node.ELEMENT_NODE && uzel.nodeName !== 'SCRIPT' && uzel.nodeName !== 'STYLE') {
                for (let i = uzel.childNodes.length - 1; i >= 0; i--) {
                    zpracujTextovyUzel(uzel.childNodes[i]);
                }
            }
        }

        zpracujTextovyUzel(document.body);

        const hlidacZmen = new MutationObserver(function(mutace) {
            mutace.forEach(function(mutace) {
                mutace.addedNodes.forEach(function(uzel) {
                    zpracujTextovyUzel(uzel);
                });
                if (mutace.type === 'characterData') {
                    const rodic = mutace.target.parentNode;
                    if (rodic && !rodic.classList.contains('game-number')) {
                        const nejblizsiElement = rodic.closest('div, span, p, li, td');
                        if (nejblizsiElement) {
                            zpracujTextovyUzel(nejblizsiElement);
                        }
                    }
                }
            });
        });

        hlidacZmen.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    });