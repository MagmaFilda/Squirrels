const API_BASE_URL = "https://squirrels-backend.onrender.com/api/squirrels";
const nutsCount = document.getElementById("nut-count");
const shopWindow = document.getElementById("shopWindow");
const shopContainer = document.querySelector(".shop-container");

let isOpening = false;

if (!isLoggedIn()) {
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

function startHatching(coneId) {
    if (isOpening) return;
    isOpening = true;

    document.getElementById("hatch-rarity-text").style.display = "none";

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

            let aktualniZvuk = crackSounds[currentClicks];
            if (aktualniZvuk) {
                aktualniZvuk.currentTime = 0; 
                aktualniZvuk.play();
            }
        } else {
            isOpening = false;
            revealSquirrel();
        }
    }
}

async function revealSquirrel() {
    hatchStatusText.innerText = "Hatching...";
    hatchClicksLeft.innerText = "";

    try {
        const response = await fetch(`${API_BASE_URL}/openSiska/${currentConeId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });
        

        if (!response.ok) {
            throw new Error("Failed to open siska.");

        }

        await readMoney();

        const data = await response.json();
        squirrelName = data.name;
        squirrelRarity = data.rarity;

        squirrelPath = `./../images/${squirrelName}.png`;
        

    } catch (error) {
        isOpening = false;
        console.error("Chyba:", error);
        
        const alertBox = document.getElementById("custom-alert");
        
        alertBox.classList.add("alert-show");
        
        setTimeout(() => {
            alertBox.classList.remove("alert-show");
        }, 2000);

        closeHatchModal();

        return;
    }

    hatchSound.currentTime = 0;
    hatchSound.play();

    hatchClicksLeft.style.display = "none";
    hatchStatusText.innerText = `YOU GOT A ${squirrelName.replaceAll("_", " ").toUpperCase()}!`;

    const rarityText = document.getElementById("hatch-rarity-text");
    let rarityName = "";
    let rarityColor = "";

    const nameLower = squirrelName.toLowerCase();

    if (squirrelRarity === 0) {
        rarityName = "COMMON";
        rarityColor = "#bf6c65"; 
    } else if (squirrelRarity === 1) {
        rarityName = "RARE";
        rarityColor = "#159cab";
    } else if (squirrelRarity === 2) {
        rarityName = "EPIC";
        rarityColor = "#68419d";
    } else if (squirrelRarity === 3) {
        rarityName = "LEGENDARY";
        rarityColor = "#aaaf1b";
    }

    if (rarityText) {
        rarityText.innerText = `${rarityName}`;
        rarityText.style.color = rarityColor;
        rarityText.style.display = "block";
    }

    hatchingItem.src = squirrelPath;

    hatchingItem.addEventListener('error', () => {
        hatchingItem.src = "./../images/default.png";
    
    });
    
    hatchingItem.className = "squirrel-revealed-animation";
    modalCloseBtn.style.display = "inline-block";
}

function closeHatchModal() {
    hatchModal.classList.remove('active');
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





const crackSounds = {
    3: new Audio("./../sounds/pip.mp3"),  
    2: new Audio("./../sounds/pep.mp3"), 
    1: new Audio("./../sounds/pop.mp3")   
};
const hatchSound = new Audio("./../sounds/open.mp3");

document.addEventListener("DOMContentLoaded", function () {
    const bgMusic = document.getElementById("bgMusic");
    const volumeSlider = document.getElementById("volumeSlider");

    if (bgMusic && volumeSlider) {
        const savedVolume = localStorage.getItem("musicVolume");

        if (savedVolume !== null) {
            bgMusic.volume = savedVolume;
            volumeSlider.value = savedVolume;
        } else {
            bgMusic.volume = volumeSlider.value;
            localStorage.setItem("musicVolume", volumeSlider.value);
        }

        volumeSlider.addEventListener("input", function () {
            bgMusic.volume = volumeSlider.value;
            localStorage.setItem("musicVolume", volumeSlider.value);
        });

        function spustitHudbuPoKliknuti() {
            bgMusic.play().then(() => {
                document.removeEventListener("click", spustitHudbuPoKliknuti);
            }).catch(() => {
                console.log("Prohlížeč ještě blokuje audio, čekám na kliknutí.");
            });
        }

        document.addEventListener("click", spustitHudbuPoKliknuti);
    }
});


document.addEventListener("DOMContentLoaded", function() {
    function retroCisla(uzel) {
        if (uzel.nodeType === Node.TEXT_NODE) {
            const hledat = /([0-9%]+)/g;
            if (uzel.nodeValue.match(hledat)) {
                const span = document.createElement('span');
                span.innerHTML = uzel.nodeValue.replace(hledat, '<span class="game-number">$1</span>');
                uzel.parentNode.insertBefore(span, uzel);
                uzel.parentNode.removeChild(uzel);
            }
        } else if (uzel.nodeType === Node.ELEMENT_NODE && uzel.nodeName !== 'SCRIPT' && uzel.nodeName !== 'STYLE') {
            for (let i = uzel.childNodes.length - 1; i >= 0; i--) {
                retroCisla(uzel.childNodes[i]);
            }
        }
    }
    retroCisla(document.body);
});


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

    
    
