document.addEventListener("DOMContentLoaded", function () {
    // =================================================================
    // 1. LOGIKA PŘEPÍNÁNÍ TEXTŮ A OBRÁZKŮ V PAPÍRU
    // =================================================================
    const contentDiv = document.getElementById("aboutContent");
    const tabButtons = document.querySelectorAll(".tab-btn");

    // Databáze textů a obrázků pro jednotlivé sekce
    const sekceTexty = {
        inventory: {
            title: "INVENTORY",
            text: "This is your personal storage! Here you can check out all the unique squirrels you have successfully gathered on your journey. Manage your furry empire, review your resource stockpiles, and plan your next big move in the forest!",
            image: "./../images/rogue.png" // <--- Sem si pak dej případně vlastní ikonu batohu/truhly
        },
        catalog: {
            title: "CATALOG",
            text: "The ultimate index of all squirrel species in the game! Browse through the complete checklist of your collection, track down which ones you are still missing, and discover their unique lore, traits, and rarity ranks.",
            image: "./../images/explorer.png" // <--- Sem si pak dej případně vlastní ikonu knihy
        },
        shop: {
            title: "SHOP",
            text: "Welcome to the marketplace! Spend your hard-earned acorns here to expand your crew. You can purchase 3 different rarities of pinecones (Common, Rare, and Epic) – each giving you a chance to hatch stronger and more legendary squirrels!",
            image: "./../images/golden-pi.png" // <--- Sem si pak dej případně vlastní ikonu obchodu
        }
    };

    // Sledování kliknutí na přepínací tlačítka
    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            // 1. Aktivace vizuálního stlačení tlačítka
            tabButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // 2. Zjištění, na které tlačítko se kliklo
            const zvolenaSekce = this.getAttribute("data-section");

            // 3. Překreslení textu a obrázku uvnitř papíru
            if (sekceTexty[zvolenaSekce]) {
                contentDiv.innerHTML = `
                <h2>${sekceTexty[zvolenaSekce].title}</h2>
                <p>${sekceTexty[zvolenaSekce].text}</p>
                <img id="aboutSectionImage" src="${sekceTexty[zvolenaSekce].image}" alt="Section Icon">
            `;
            }
        });
    });

    // =================================================================
    // 2. HUDBA NA POZADÍ A UKLÁDÁNÍ HLASITOSTI (localStorage)
    // =================================================================
    const bgMusic = document.getElementById("bgMusic");
    const volumeSlider = document.getElementById("volumeSlider");

    if (bgMusic && volumeSlider) {
        // Načtení uložené hlasitosti z paměti prohlížeče
        const savedVolume = localStorage.getItem("gameVolume");
        
        if (savedVolume !== null) {
            bgMusic.volume = savedVolume;
            volumeSlider.value = savedVolume;
        } else {
            bgMusic.volume = volumeSlider.value; // Výchozí hodnota z HTML (0.3)
        }

        // Okamžitá změna hlasitosti při posunu jezdce a uložení do paměti
        volumeSlider.addEventListener("input", function () {
            bgMusic.volume = volumeSlider.value;
            localStorage.setItem("gameVolume", volumeSlider.value);
        });

        // Ochrana: Spuštění hudby po prvním kliknutí (Autoplay Policy)
        function spustitHudbu() {
            bgMusic.play().then(() => {
                document.removeEventListener("click", spustitHudbu);
            }).catch(err => {
                console.log("Prohlížeč blokuje audio, čekám na interakci uživatele.");
            });
        }
        document.addEventListener("click", spustitHudbu);
    }
});