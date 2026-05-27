const loggedUser = getLoggedUser();
const inventoryGrid = document.getElementById('inventoryGrid');

if (!loggedUser) {
    inventoryGrid.innerHTML = "<p>You must log in to see your inventory.</p>";
} else {
    loadInventory();
}

const squirrelDisplayNames = {
    nutty: "Nutty",
    grumpy: "Grumpy",
    scout: "Scout",
    peanut: "Peanut",
    twiggy: "Twiggy",
    blossom: "Blossom",
    tailor: "Tailor",
    bubbles: "Bubbles",
    berry: "Berry",
    chippy: "Chippy",
    rogue: "Rogue",
    chef: "Chef",
    explorer: "Explorer",
    gamer: "Gamer",
    knight: "Knight",
    phoenix: "Phoenix",
    kingmidas: "King Midas",
    druid: "Druid",
    blizzard: "Blizzard",
    angel: "Angel",
    inferno: "Inferno"
};

async function loadInventory() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/${loggedUser.id}`);

        if (!response.ok) {
            throw new Error("Nepodařilo se načíst inventář.");
        }

        const squirrels = await response.json();

        console.log(squirrels);

        inventoryGrid.innerHTML = "";

        squirrels.forEach(squirrel => {
            const displayName = squirrelDisplayNames[squirrel.name] || squirrel.name;

            const slot = document.createElement("div");
            slot.classList.add("item-slot");

            const img = document.createElement("img");
            img.src = `./../images/${squirrel.name}.png`;
            img.alt = displayName;

            const count = document.createElement("span");
            count.classList.add("item-count");
            count.textContent = squirrel.count;

            slot.appendChild(img);
            slot.appendChild(count);

            inventoryGrid.appendChild(slot);
        });

    } catch (error) {
        console.error("Chyba:", error);
    }
}