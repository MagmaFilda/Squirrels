const catalogGrid = document.getElementById('catalog-grid');

async function loadCatalog() {
    try {
        const response = await fetch("https://squirrels-backend.onrender.com/api/squirrels/catalog");

        if (!response.ok) {
            throw new Error("Failed to load catalog.");
        }

        const squirrels = await response.json();
        console.log(squirrels);
        catalogGrid.innerHTML = "";

        squirrels.forEach(squirrel => {
            const displayName = squirrel.name
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");

            const slot = document.createElement("div");

            slot.style.cursor = 'pointer';
            
            if(squirrel.rarity === 0) {
                slot.classList.add("item-slot", "common");
            } else if(squirrel.rarity === 1) {
                slot.classList.add("item-slot", "rare");
            } else if(squirrel.rarity === 2) {
                slot.classList.add("item-slot", "epic");
            } else if(squirrel.rarity === 3) {
                slot.classList.add("item-slot", "legendary");
            }

            const img = document.createElement("img");
            img.src = `../images/${squirrel.name}.png`;
            img.alt = displayName;

            slot.appendChild(img);

            const modalData = {
                squirrelId: squirrel.id,
                name: displayName,
                desc: squirrel.description,
                str: squirrel.strength,
                spd: squirrel.speed,
                dur: squirrel.durability,
                price: squirrel.cost,
                img: `../images/${squirrel.name}.png`,
                rarity: squirrel.rarity
            }

            slot.addEventListener("click", () => {
                
                if (modalData) {
                    openModal(modalData);
                }
            });

            catalogGrid.appendChild(slot);
        });
    } catch (error) {
        console.error("Chyba:", error);
    }
}

loadCatalog();
const modal = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalImg = document.getElementById('modal-img');
const modalPrice = document.getElementById('modal-price');

const barStr = document.getElementById('bar-str');
const barSpd = document.getElementById('bar-spd');
const barDur = document.getElementById('bar-dur');
const closeBtn = document.querySelector('.close-btn');

function openModal(data) {
    modalTitle.innerText = data.name;
    modalDesc.innerText = data.desc;
    modalPrice.innerText = data.price;
    modalImg.setAttribute('src', data.img);

    barStr.style.width = data.str + '%';
    barSpd.style.width = data.spd + '%';
    barDur.style.width = data.dur + '%';

    modal.classList.add('active');
}

closeBtn.addEventListener('click', () => modal.classList.remove('active'));

modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
