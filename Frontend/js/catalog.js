const squirrelsData = [
    // 10x COMMON
    { id: 1,  name: "Nutty",  desc: "Always happy as long as there is a fresh acorn in his paws.",           str: 35, spd: 95, dur: 40, price: 120, img: "./../images/nutty.png", rarity: "common" }, // [cite: 1, 22]
    { id: 2,  name: "Grumby",      desc: "Not even a cozy leaf on his head can fix his permanent bad mood.",          str: 90, spd: 30, dur: 85, price: 250, img: "./../images/grumby.png", rarity: "common" }, // [cite: 2, 22, 23]
    { id: 3,  name: "Scout",  desc: "Determined to map every single tree in the forest, even if it takes all day.",  str: 60, spd: 65, dur: 60, price: 180, img: "./../images/scout.png", rarity: "common" }, // [cite: 3, 23]
    { id: 4,  name: "Peanut",        desc: "Caught in utter shock after dropping his favorite little pebble.",    str: 45, spd: 80, dur: 50, price: 210, img: "./../images/peanut.png", rarity: "common" }, // [cite: 4, 23]
    { id: 5,  name: "Twiggy",     desc: "A playful companion who believes a good stick is the ultimate treasure.",   str: 30, spd: 55, dur: 70, price: 150, img: "./../images/twiggy.png", rarity: "common" }, // [cite: 5, 23, 24]
    { id: 6,  name: "Blossom",  desc: "Soft-spoken and gentle, she loves nothing more than the scent of fresh flowers.",   str: 55, spd: 85, dur: 45, price: 195, img: "./../images/blossom.png", rarity: "common" }, // [cite: 6, 24]
    { id: 7,  name: "Tailor",        desc: "The forest's finest weaver, carefully crafting warm coats from spool and thread.",      str: 85, spd: 25, dur: 95, price: 260, img: "./../images/tailor.png", rarity: "common" }, // [cite: 7, 24]
    { id: 8,  name: "Bubbles",     desc: "Spreading joy through the woods with his endless supply of magical, floating bubbles.",     str: 40, spd: 75, dur: 55, price: 165, img: "./../images/bubbles.png", rarity: "common" }, // [cite: 8, 24, 25]
    { id: 10, name: "Chippy",        desc: "A rare snow-furred beauty who blends perfectly into the winter scenery.",       str: 20, spd: 40, dur: 30, price: 50,  img: "./../images/chippy.png", rarity: "common" }, // [cite: 10, 25]
    { id: 13, name: "Berry",       desc: "A sweet little chipmunk who always knows where to find the juiciest forest berries.",    str: 30, spd: 35, dur: 75, price: 140, img: "./../images/berry.png", rarity: "common" }, // [cite: 13, 25, 26]

    // 6x RARE
    { id: 12, name: "Chef",    desc: "Master of the woodland kitchen, famous for flipping the perfect acorn pancake.",        str: 65, spd: 90, dur: 50, price: 220, img: "./../images/chef.png", rarity: "rare" }, // [cite: 12, 26]
    { id: 14, name: "Gamer",       desc: "Fully immersed in his glowing device, completely oblivious to the world around him.",str: 50, spd: 80, dur: 60, price: 200, img: "./../images/gamer.png", rarity: "rare" }, // [cite: 14, 26]
    { id: 15, name: "Knight",   desc: "A brave protector clad in shining armor, guarding the sacred crystal with his life.",     str: 70, spd: 50, dur: 65, price: 175, img: "./../images/knight.png", rarity: "rare" }, // [cite: 15, 26, 27]
    { id: 16, name: "Phoenix",    desc: "Blessed with majestic feathery wings, she soars through the canopy like a spark of fire.",    str: 60, spd: 45, dur: 85, price: 190, img: "./../images/phoenix.png", rarity: "rare" }, // [cite: 16, 27]
    { id: 17, name: "Explorer",      desc: "Equipped with his trusty magnifying glass, he hunts for hidden paths and ancient secrets.",      str: 45, spd: 85, dur: 40, price: 185, img: "./../images/explorer.png", rarity: "rare" }, // [cite: 17, 27]
    { id: 18, name: "Rogue",      desc: "Strikes from the shadows with a sharpened twig, leaving no trace behind.",       str: 75, spd: 65, dur: 70, price: 240, img: "./../images/rogue.png", rarity: "rare" }, // [cite: 18, 27, 28]

    // 3x EPIC
    { id: 9,  name: "King Midas",      desc: "Sitting atop an endless pile of gold, his royal rule is as solid as his crown.", str: 50, spd: 60, dur: 65, price: 300, img: "./../images/kingmidas.png", rarity: "epic" }, // [cite: 9, 28]
    { id: 20, name: "Druid",        desc: "Half-machine and half-nature, guarding the forest with an enhanced cybernetic eye.",str: 55, spd: 55, dur: 70, price: 130, img: "./../images/druid.png", rarity: "epic" }, // [cite: 20, 28, 29]
    { id: 19, name: "Blizzard",     desc: "Born from absolute zero, this frozen creature radiates a chilling, mystical aura.",        str: 80, spd: 80, dur: 80, price: 400, img: "./../images/blizzard.png", rarity: "epic" }, // [cite: 19, 29, 30]


    // 2x LEGENDARY
    { id: 11, name: "Angel",      desc: "Strikes from the shadows with a sharpened twig, leaving no trace behind.",       str: 95, spd: 70, dur: 80, price: 500, img: "./../images/angel.png", rarity: "legendary" }, // [cite: 11, 29]
    { id: 21, name: "Inferno",      desc: "An unstoppable elemental force wrapped in cosmic blue flames and crackling energy", str: 40, spd: 60, dur: 55, price: 160, img: "./../images/inferno.png", rarity: "legendary" }, // [cite: 21, 29]
];

const grid = document.getElementById('catalog-grid'); // [cite: 30, 31]
squirrelsData.forEach(squirrel => { // [cite: 31]
    const slot = document.createElement('div'); // [cite: 31]
    // TADY: Přidáme hlavní třídu i třídu rarity (např. "item-slot common")
    slot.className = `item-slot ${squirrel.rarity}`; // [cite: 31]
    slot.style.cursor = 'pointer'; // [cite: 31]
    
    const img = document.createElement('img'); // [cite: 31]
    img.src = squirrel.img; // [cite: 31]
    img.alt = squirrel.name; // [cite: 31]
    
    slot.appendChild(img); // [cite: 31]
    grid.appendChild(slot); // [cite: 31]

    slot.addEventListener('click', () => { // [cite: 31]
        openModal(squirrel); // [cite: 31]
    }); // [cite: 31]
}); // [cite: 31]

const modal = document.getElementById('info-modal'); // [cite: 32]
const modalTitle = document.getElementById('modal-title'); // [cite: 32]
const modalDesc = document.getElementById('modal-desc'); // [cite: 32]
const modalImg = document.getElementById('modal-img'); // [cite: 32]
const modalPrice = document.getElementById('modal-price'); // [cite: 32]

const barStr = document.getElementById('bar-str'); // [cite: 33]
const barSpd = document.getElementById('bar-spd'); // [cite: 33]
const barDur = document.getElementById('bar-dur'); // [cite: 33]
const closeBtn = document.querySelector('.close-btn'); // [cite: 33]

function openModal(data) { // [cite: 34]
    modalTitle.innerText = data.name; // [cite: 34]
    modalDesc.innerText = data.desc; // [cite: 34]
    modalPrice.innerText = data.price; // [cite: 34]
    modalImg.setAttribute('src', data.img); // [cite: 34]

    barStr.style.width = data.str + '%'; // [cite: 35]
    barSpd.style.width = data.spd + '%'; // [cite: 35]
    barDur.style.width = data.dur + '%'; // [cite: 35]

    modal.classList.add('active'); // [cite: 35]
} // [cite: 35]

closeBtn.addEventListener('click', () => modal.classList.remove('active')); // [cite: 35]

modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); }); // [cite: 36]