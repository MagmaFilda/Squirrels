const inventoryGrid = document.getElementById('inventoryGrid');


fetch("https://localhost:5001/api/squirrels")
    .then(response => response.json())
    .then(squirrels => {
        inventoryGrid.innerHTML = "";

        squirrels.forEach(squirrel => {
            const slot = document.createElement("div");
            slot.classList.add("item-slot");

            const img = document.createElement("img");
            img.src = squirrel.imageUrl;
            img.alt = squirrel.name;

            slot.appendChild(img);
            inventoryGrid.appendChild(slot);
        });
    })
    .catch(error => {
        console.error("Chyba při načítání veverek:", error);
    });