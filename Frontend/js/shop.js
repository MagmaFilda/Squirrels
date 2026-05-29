const loggedUser = getLoggedUser();
const nutsCount = document.getElementById("nut-count");
const shopWindow = document.getElementById("shopWindow");
const shopContainer = document.querySelector(".shop-container");

let isOpening = false;

if (!loggedUser) {
    shopWindow.innerHTML = '<p>You must <a href="login.html?redirect=shop.html">log in</a> to see shop.</p>';
    shopWindow.classList.remove("shop-window");
    shopContainer.style.alignItems = "flex-start";
} else {
    readMoney();
}

let currentClicks = 0;
let currentConeId = 0;

let squirrelPath = "./../images/nutty.png";
let squirrelName = "Nutty";

const hatchingStages = {
    1: { 
        4: "./../images/basic-pi-0.png",        
        3: "./../images/basic-pi-1.png", 
        2: "./../images/basic-pi-2.png",
        1: "./../images/basic-pi-3.png"
    },
    2: { 
        4: "./../images/silver-pi-0.png",
        3: "./../images/silver-pi-1.png",
        2: "./../images/silver-pi-2.png",
        1: "./../images/silver-pi-3.png"
    },
    3: { 
        4: "./../images/golden-pi-0.png",
        3: "./../images/golden-pi-1.png",
        2: "./../images/golden-pi-2.png",
        1: "./../images/golden-pi-3.png"
    }
};

const hatchModal = document.getElementById('hatch-modal');
const hatchingItem = document.getElementById('hatching-item');
const hatchStatusText = document.getElementById('hatch-status-text');
const hatchClicksLeft = document.getElementById('hatch-clicks-left');
const modalCloseBtn = document.getElementById('modal-close-btn');
const nutCountDisplay = document.getElementById('nut-count');

async function startHatching(coneId) {
    if (isOpening) return;
    isOpening = true;
    
    try {
        const response = await fetch(`https://localhost:7179/api/squirrels/openSiska/${coneId}/${loggedUser.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        

        if (!response.ok) {
            throw new Error("Failed to open siska.");

        }

        await readMoney();

        squirrelName = await response.text();
        squirrelPath = `./../images/${squirrelName}.png`;
        

    } catch (error) {
        console.error("Chyba:", error);
        alert("NOT ENOUGH NUTS! 🌰");
        return;
    }



    currentConeId = coneId;
    currentClicks = 4; 
    
    hatchingItem.src = hatchingStages[currentConeId][currentClicks];
    hatchingItem.className = ""; 

    hatchStatusText.innerText = "CLICK TO HATCH!";
    hatchClicksLeft.style.display = "block";
    hatchClicksLeft.innerText = `CLICKS: ${currentClicks}`;
    modalCloseBtn.style.display = "none";

    hatchModal.classList.add('active');
}

function registerHatchClick() {
    if (currentClicks > 0) {
        currentClicks--;
        
        hatchingItem.classList.remove('shake-animation');
        void hatchingItem.offsetWidth; 
        hatchingItem.classList.add('shake-animation');

        if (currentClicks > 0) {
            hatchingItem.src = hatchingStages[currentConeId][currentClicks];
            hatchClicksLeft.innerText = `CLICKS: ${currentClicks}`;

            // --- NOVÉ: Výběr a přehrání zvuku podle aktuální fáze ---
            let aktualniZvuk = crackSounds[currentClicks];
            if (aktualniZvuk) {
                aktualniZvuk.currentTime = 0; // Umožní rychlé klikání za sebou
                aktualniZvuk.play();
            }
        } else {
            revealSquirrel();
        }
    }
}

function revealSquirrel() {
    // --- NOVÉ: Přehrání zvuku vylíhnutí veverky ---
    hatchSound.currentTime = 0;
    hatchSound.play();

    hatchClicksLeft.style.display = "none";
    hatchStatusText.innerText = `YOU GOT A ${squirrelName.replaceAll("_", " ").toUpperCase()}!`;
    
    hatchingItem.src = squirrelPath;
    hatchingItem.className = "squirrel-revealed-animation";

    modalCloseBtn.style.display = "inline-block";
}

function closeHatchModal() {
    hatchModal.classList.remove('active');
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




// ZVUKY
// --- NOVÉ: Načtení různých zvuků pro každou fázi praskání ---
// Indexy 3, 2, 1 odpovídají počtu zbývajících kliknutí do vylíhnutí
const crackSounds = {
    3: new Audio("./../sounds/pip.mp3"),  // První jemné křupnutí (při změně ze 4 na 3)
    2: new Audio("./../sounds/pep.mp3"), // Silnější křupnutí (při změně ze 3 na 2)
    1: new Audio("./../sounds/pop.mp3")   // Pořádná rána těsně před prasknutím (při změně ze 2 na 1)
};
// Zvuk pro finální vylíhnutí veverky (při změně z 1 na 0)
const hatchSound = new Audio("./../sounds/open.mp3");

document.addEventListener("DOMContentLoaded", function () {
    const bgMusic = document.getElementById("bgMusic");
    const volumeSlider = document.getElementById("volumeSlider");

    if (bgMusic && volumeSlider) {
        
        bgMusic.volume = volumeSlider.value;

        volumeSlider.addEventListener("input", function () {
            bgMusic.volume = volumeSlider.value;
        });

        function spustitHudbuPoKliknuti() {
            bgMusic.play().then(() => {
                document.removeEventListener("click", spustitHudbuPoKliknuti);
            }).catch(error => {
                console.log("Prohlížeč ještě blokuje audio, čekám na kliknutí.");
            });
        }

        document.addEventListener("click", spustitHudbuPoKliknuti);
    }
});

