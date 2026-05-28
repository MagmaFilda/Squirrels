const loggedUser = getLoggedUser();
const nutsCount = document.getElementById("nut-count");

if (!loggedUser) {
    inventoryGrid.innerHTML = '<p>You must <a href="login.html">log in</a> to see shop.</p>';
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
        } else {
            revealSquirrel();
        }
    }
}

function revealSquirrel() {
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


