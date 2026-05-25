const inventoryGrid = document.getElementById('inventoryGrid');

const squirrelDisplayNames = {
    hvezdnyrytir: "Hvězdný Rytíř",
    ohnivaveverka: "Ohnivá Veverka",
};

async function loadInventory() {
    try {
        const response = await fetch("https://localhost:5001/api/inventory");

        if (!response.ok) {
            throw new Error("Nepodařilo se načíst inventář.");
        }

        const squirrels = await response.json();

        inventoryGrid.innerHTML = "";

        squirrels.forEach(squirrel => {
            const displayName = squirrelDisplayNames[squirrel.name] || squirrel.name;

            const slot = document.createElement("div");
            slot.classList.add("item-slot");

            const img = document.createElement("img");
            img.src = `./../images/${squirrel.name}.png`;
            img.alt = displayName;

            const name = document.createElement("p");
            name.classList.add("item-name");
            name.textContent = displayName;

            const count = document.createElement("span");
            count.classList.add("item-count");
            count.textContent = squirrel.count;

            slot.appendChild(img);
            slot.appendChild(name);
            slot.appendChild(count);

            inventoryGrid.appendChild(slot);
        });

    } catch (error) {
        console.error("Chyba:", error);
    }
}

loadInventory();