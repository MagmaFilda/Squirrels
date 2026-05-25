// ==========================================
//  // --- ZDE MŮŽEŠ MĚNIT STATY VEVEREK ---
//  Hodnoty str, spd, dur nastavuj od 0 do 100
// ==========================================
const squirrelsData = [
    { id: 1,  name: "Zrzavá Bleskovka",  desc: "Nejrychlejší běžec v lese.",           str: 35, spd: 95, dur: 40, price: 120, img: "./../images/veverka.png" },
    { id: 2,  name: "Veverčí Rváč",      desc: "Unese i ten největší vlašák.",         str: 90, spd: 30, dur: 85, price: 250, img: "./../images/veverka.png" },
    { id: 3,  name: "Lesní Průzkumník",  desc: "Spolehlivá veverka na dlouhé cesty.",  str: 60, spd: 65, dur: 60, price: 180, img: "./../images/veverka.png" },
    { id: 4,  name: "Noční Stín",        desc: "Operuje hlavně za absolutní tmy.",    str: 45, spd: 80, dur: 50, price: 210, img: "./../images/veverka.png" },
    { id: 5,  name: "Oříškový Guru",     desc: "Najde žalud i pod metrem sněhu.",      str: 30, spd: 55, dur: 70, price: 150, img: "./../images/veverka.png" },
    { id: 6,  name: "Chundelatý Ninja",  desc: "Skáče z větve na větev bez hnutku.",   str: 55, spd: 85, dur: 45, price: 195, img: "./../images/veverka.png" },
    { id: 7,  name: "Dubový Obr",        desc: "Veverka s neuvěřitelnou výdrží.",      str: 85, spd: 25, dur: 95, price: 260, img: "./../images/veverka.png" },
    { id: 8,  name: "Veverka Špión",     desc: "Sleduje nepřátelské kmeny ptáků.",     str: 40, spd: 75, dur: 55, price: 165, img: "./../images/veverka.png" },
    { id: 9,  name: "Zlatý Sběrač",      desc: "Generuje extra žaludy každou minutu.", str: 50, spd: 60, dur: 65, price: 300, img: "./../images/veverka.png" },
    { id: 10, name: "Mladý Učeň",        desc: "Teprve se učí správně louskat.",       str: 20, spd: 40, dur: 30, price: 50,  img: "./../images/veverka.png" },
    { id: 11, name: "Veverčí Král",      desc: "Vládce celého dubového paláce.",       str: 95, spd: 70, dur: 80, price: 500, img: "./../images/veverka.png" },
    { id: 12, name: "Bleskový Lovec",    desc: "Uloví jakýkoliv hmyz za letu.",        str: 65, spd: 90, dur: 50, price: 220, img: "./../images/veverka.png" },
    { id: 13, name: "Starý Mudrc",       desc: "Ví o lese věci, které ostatní ne.",    str: 30, spd: 35, dur: 75, price: 140, img: "./../images/veverka.png" },
    { id: 14, name: "Parašutista",       desc: "Plachtí vzduchem na dlouhé vzdálenosti.",str: 50, spd: 80, dur: 60, price: 200, img: "./../images/veverka.png" },
    { id: 15, name: "Asfaltový Pirát",   desc: "Veverka zvyklá na městské parky.",     str: 70, spd: 50, dur: 65, price: 175, img: "./../images/veverka.png" },
    { id: 16, name: "Sněžný Chlupáč",    desc: "Hustá srst ji chrání před mrazem.",    str: 60, spd: 45, dur: 85, price: 190, img: "./../images/veverka.png" },
    { id: 17, name: "Zloděj Šišek",      desc: "Krade zásoby ostatním zvířatům.",      str: 45, spd: 85, dur: 40, price: 185, img: "./../images/veverka.png" },
    { id: 18, name: "Kapitán Ocas",      desc: "Vede veverčí jednotky do boje.",       str: 75, spd: 65, dur: 70, price: 240, img: "./../images/veverka.png" },
    { id: 19, name: "Kyber Veverka",     desc: "Vylepšená prototypová veverka.",       str: 80, spd: 80, dur: 80, price: 400, img: "./../images/veverka.png" },
    { id: 20, name: "Poustevník",        desc: "Žije sama na vrcholu nejvyššího smrku.",str: 55, spd: 55, dur: 70, price: 130, img: "./../images/veverka.png" },
    { id: 21, name: "Šílený Vědec",      desc: "Provádí pokusy s kvašenými bobulemi.", str: 40, spd: 60, dur: 55, price: 160, img: "./../images/veverka.png" }
];

// --- AUTOMATICKÉ GENEROVÁNÍ MŘÍŽKY ---
const grid = document.getElementById('catalog-grid');

squirrelsData.forEach(squirrel => {
    // Vytvoření slotu
    const slot = document.createElement('div');
    slot.className = 'item-slot';
    slot.style.cursor = 'pointer';
    
    // Vložení obrázku
    const img = document.createElement('img');
    img.src = squirrel.img;
    img.alt = squirrel.name;
    
    slot.appendChild(img);
    grid.appendChild(slot);

    // Přidání klikací akce pro otevření modalu s daty dané veverky
    slot.addEventListener('click', () => {
        openModal(squirrel);
    });
});

// --- FUNKCE PRO OTEVŘENÍ MODALU ---
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

    // Výpočet a nastavení šířky pixel barů
    barStr.style.width = data.str + '%';
    barSpd.style.width = data.spd + '%';
    barDur.style.width = data.dur + '%';

    modal.classList.add('active');
}

// Zavírání okna///jhghhgh
closeBtn.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
   