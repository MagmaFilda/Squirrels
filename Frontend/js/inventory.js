const loggedUser = getLoggedUser();
const inventoryGrid = document.getElementById('inventoryGrid');

if (!loggedUser) {
    inventoryGrid.innerHTML = '<p>You must <a href="login.html">log in</a> to see your inventory.</p>';
} else {
    loadInventory();
}

async function loadInventory() {
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/inventory/${loggedUser.id}`);

        if (!response.ok) {
            throw new Error("Failed to load inventory.");
        }

        const squirrels = await response.json();

        inventoryGrid.innerHTML = "";

        squirrels.forEach(squirrel => {
            const displayName = squirrel.name
                .split("_")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");

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