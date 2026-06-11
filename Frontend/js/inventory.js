const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";
const inventoryGrid = document.getElementById('inventoryGrid');
const nutsCount = document.getElementById("nut-count");
const playerCurrency = document.getElementById("playerCurrency");

const alertBox = document.getElementById("custom-alert");
const alertMessage = document.getElementById("alert-message");

let selectedSquirrelId = null;
let selectedSquirrelCount = 0;

if (!isLoggedIn()) {
    inventoryGrid.innerHTML = '<p>You must <a href="login.html?redirect=invertory.html">log in</a> to see your inventory.</p>';
    playerCurrency.style.display = "none";
} else {
    loadInventory();
    readMoney();
}

async function readMoney() {
    try {
        const response = await fetch(`${API_BASE_URL}/readMoney`,
        {
            headers:

            {
                "Authorization": `Bearer ${getToken()}`
            }
        });

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
        const response = await fetch(`${API_BASE_URL}/inventory`,
        {
            headers:
            {
                "Authorization": `Bearer ${getToken()}`
            }
        });

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
            img.src = `../images/${squirrel.returningSquirrel.name}.png`;
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
                img: `../images/${squirrel.returningSquirrel.name}.png`,
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

        return squirrels;

    } catch (error) {
        console.error("Chyba:", error);
        return [];
    }
}


const modal = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalImg = document.getElementById('modal-img');
const modalPrice = document.getElementById('modal-price');
const modalCount = document.getElementById('modal-count');
const sellStatus = document.getElementById("sell-status");


const barStr = document.getElementById('bar-str');
const barSpd = document.getElementById('bar-spd');
const barDur = document.getElementById('bar-dur');
const closeBtn = document.querySelector('.close-btn');

function openModal(data) {
    selectedSquirrelId = data.squirrelId;
    selectedSquirrelCount = data.count;
    modalTitle.innerText = data.name;
    modalDesc.innerText = data.desc;
    modalPrice.innerText = data.price;
    modalImg.setAttribute('src', data.img);
    modalCount.innerText = data.count;
    sellStatus.innerText = "";

    barStr.style.width = data.str + '%';
    barSpd.style.width = data.spd + '%';
    barDur.style.width = data.dur + '%';

    modal.classList.add('active');
}

closeBtn.addEventListener('click', () => modal.classList.remove('active'));

modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

const sellOneBtn = document.getElementById('sell-one-btn');
const sellAllBtn = document.getElementById('sell-all-btn');
const keepOneBtn = document.getElementById('keep-one-btn');

sellOneBtn.addEventListener("click", function () {
    sellSelectedSquirrel(1);
});

keepOneBtn.addEventListener("click", function () {
    if(selectedSquirrelCount <= 1) {
        alertMessage.textContent = "You have only one squirrel.";
        alertBox.classList.add("alert-show");
            
        setTimeout(() => {
            alertBox.classList.remove("alert-show");
        }, 2000);
        return;
    }
    sellSelectedSquirrel(selectedSquirrelCount - 1);
});

sellAllBtn.addEventListener("click", function () {
    sellSelectedSquirrel(selectedSquirrelCount);
});




async function refreshAfterSell() {
    const squirrels = await loadInventory();
    await readMoney();

    const currentSquirrel = squirrels.find(squirrel =>
        squirrel.returningSquirrel.id === selectedSquirrelId
    );

    if (!currentSquirrel || currentSquirrel.count <= 0) {
        modal.classList.remove("active");
        selectedSquirrelId = null;
        selectedSquirrelCount = 0;
        return;
    }

    selectedSquirrelCount = currentSquirrel.count;
    modalCount.innerText = currentSquirrel.count;
}


async function sellSelectedSquirrel(amount) {
    try {
        sellStatus.innerText = "Selling...";
        setSellButtonsDisabled(true);

        const response = await fetch(`${API_BASE_URL}/sell/${selectedSquirrelId}/${amount}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to sell squirrel.");
        }

        await refreshAfterSell();

        if (modal.classList.contains("active")) {
            sellStatus.innerText = "Sold successfully!";
        }

    } catch (error) {
        console.error("Chyba:", error);
        sellStatus.innerText = "Selling failed.";
    } finally {
        setSellButtonsDisabled(false);
    }
}

function setSellButtonsDisabled(disabled) {
    sellOneBtn.disabled = disabled;
    keepOneBtn.disabled = disabled;
    sellAllBtn.disabled = disabled;
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