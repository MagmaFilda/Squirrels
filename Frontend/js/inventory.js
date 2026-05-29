const loggedUser = getLoggedUser();
const inventoryGrid = document.getElementById('inventoryGrid');

if (!loggedUser) {
    inventoryGrid.innerHTML = '<p>You must <a href="login.html?redirect=invertory.html">log in</a> to see your inventory.</p>';
} else {
    loadInventory();
}

async function loadInventory() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/inventory/${loggedUser.id}`);

        if (!response.ok) {
            throw new Error("Failed to load inventory.");
        }

        console.log(await response.json());

        const squirrels = await response.json();

        inventoryGrid.innerHTML = "";

        squirrels.forEach(squirrel => {
            const displayName = squirrel.name
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");

            const slot = document.createElement("div");
            
            if(squirrel.rarity === "common") {
                slot.classList.add("item-slot.common");
            } else if(squirrel.rarity === "rare") {
                slot.classList.add("item-slot.rare");
            } else if(squirrel.rarity === "epic") {
                slot.classList.add("item-slot.epic");
            } else if(squirrel.rarity === "legendary") {
                slot.classList.add("item-slot.legendary");
            }

            const img = document.createElement("img");
            img.src = `./../images/${squirrel.name}.png`;
            img.alt = displayName;

            const count = document.createElement("span");
            count.classList.add("item-count");
            count.textContent = squirrel.count;

            slot.appendChild(img);
            slot.appendChild(count);

            const modalData = {
                name: displayName,
                desc: squirrel.description,
                str: squirrel.Errorstrength,
                spd: squirrel.speed,
                dur: squirrel.durability,
                price: squirrel.cost,
                img: `./../images/${squirrel.name}.png`,
                rarity: squirrel.rarity
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

// sellOneBtn.addEventListener('click', function() {
//     const response = await fetch(`https://localhost:7179/api/squirrels/sell/${loggedUser.id}`, {
//         method: "DELETE",
//     });
// });