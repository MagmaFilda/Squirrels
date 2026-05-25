
const squirrelsData = [
    { id: 1,  name: "Zrzavá Bleskovka",  desc: "Nejrychlejší běžec v lese.",           str: 35, spd: 95, dur: 40, price: 120, img: "./../images/sq1.png" },
    { id: 2,  name: "Veverčí Rváč",      desc: "Unese i ten největší vlašák.",         str: 90, spd: 30, dur: 85, price: 250, img: "./../images/sq2.png" },
    { id: 3,  name: "Lesní Průzkumník",  desc: "Spolehlivá veverka na dlouhé cesty.",  str: 60, spd: 65, dur: 60, price: 180, img: "./../images/sq3.png" },
    { id: 4,  name: "Noční Stín",        desc: "Operuje hlavně za absolutní tmy.",    str: 45, spd: 80, dur: 50, price: 210, img: "./../images/sq4.png" },
    { id: 5,  name: "Oříškový Guru",     desc: "Najde žalud i pod metrem sněhu.",      str: 30, spd: 55, dur: 70, price: 150, img: "./../images/sq5.png" },
    { id: 6,  name: "Chundelatý Ninja",  desc: "Skáče z větve na větev bez hnutku.",   str: 55, spd: 85, dur: 45, price: 195, img: "./../images/sq6.png" },
    { id: 7,  name: "Dubový Obr",        desc: "Veverka s neuvěřitelnou výdrží.",      str: 85, spd: 25, dur: 95, price: 260, img: "./../images/sq7.png" },
    { id: 8,  name: "Veverka Špión",     desc: "Sleduje nepřátelské kmeny ptáků.",     str: 40, spd: 75, dur: 55, price: 165, img: "./../images/sq8.png" },
    { id: 9,  name: "Zlatý Sběrač",      desc: "Generuje extra žaludy každou minutu.", str: 50, spd: 60, dur: 65, price: 300, img: "./../images/sq9.png" },
    { id: 10, name: "Mladý Učeň",        desc: "Teprve se učí správně louskat.",       str: 20, spd: 40, dur: 30, price: 50,  img: "./../images/sq10.png" },
    { id: 11, name: "Veverčí Král",      desc: "Vládce celého dubového paláce.",       str: 95, spd: 70, dur: 80, price: 500, img: "./../images/sq11.png" },
    { id: 12, name: "Bleskový Lovec",    desc: "Uloví jakýkoliv hmyz za letu.",        str: 65, spd: 90, dur: 50, price: 220, img: "./../images/sq12.png" },
    { id: 13, name: "Starý Mudrc",       desc: "Ví o lese věci, které ostatní ne.",    str: 30, spd: 35, dur: 75, price: 140, img: "./../images/sq13.png" },
    { id: 14, name: "Parašutista",       desc: "Plachtí vzduchem na dlouhé vzdálenosti.",str: 50, spd: 80, dur: 60, price: 200, img: "./../images/sq14.png" },
    { id: 15, name: "Asfaltový Pirát",   desc: "Veverka zvyklá na městské parky.",     str: 70, spd: 50, dur: 65, price: 175, img: "./../images/sq15.png" },
    { id: 16, name: "Sněžný Chlupáč",    desc: "Hustá srst ji chrání před mrazem.",    str: 60, spd: 45, dur: 85, price: 190, img: "./../images/sq16.png" },
    { id: 17, name: "Zloděj Šišek",      desc: "Krade zásoby ostatním zvířatům.",      str: 45, spd: 85, dur: 40, price: 185, img: "./../images/sq17.png" },
    { id: 18, name: "Kapitán Ocas",      desc: "Vede veverčí jednotky do boje.",       str: 75, spd: 65, dur: 70, price: 240, img: "./../images/sq18.png" },
    { id: 19, name: "Kyber Veverka",     desc: "Vylepšená prototypová veverka.",       str: 80, spd: 80, dur: 80, price: 400, img: "./../images/sq19.png" },
    { id: 20, name: "Poustevník",        desc: "Žije sama na vrcholu nejvyššího smrku.",str: 55, spd: 55, dur: 70, price: 130, img: "./../images/sq20.png" },
    { id: 21, name: "Šílený Vědec",      desc: "Provádí pokusy s kvašenými bobulemi.", str: 40, spd: 60, dur: 55, price: 160, img: "./../images/sq21.png" }
];

const grid = document.getElementById('catalog-grid');

squirrelsData.forEach(squirrel => {
    const slot = document.createElement('div');
    slot.className = 'item-slot';
    slot.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = squirrel.img;
    img.alt = squirrel.name;
    
    slot.appendChild(img);
    grid.appendChild(slot);

    slot.addEventListener('click', () => {
        openModal(squirrel);
    });
});

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
   