const listOfEmojis = ["😀", "😂", "🥰", "😝", "😎", "🤩", "🥳", "😭", "🐶", "🐱", "🐭", "🐹", "🐰", "🐻‍❄️", "🐮", "🐵", "⚽️", "🏀", "🏈", "⚾️", "🎱", "🎾", "🏐", "🏉", "🍎", "🍋", "🍉", "🍇", 
"🍓", "🍒", "🍍", "🥝", "🚗", "🚙", "🏎️", "🚑", "🚒", "🚛", "🚲", "🛵"];
const gameBoard = document.querySelector('.game-board');
const helpButton = document.querySelector('.help-button');
const restartButton = document.querySelector('.restart-button');
const closeHelpButton = document.querySelector('.close-help-button');
const helpModal = document.getElementById('help-modal');
const resultModal = document.getElementById('result-modal')
const resultTitle = document.querySelector('.result-title');
const resultMessage = document.querySelector('.result-message');
const overlay = document.getElementById('overlay');

document.addEventListener('DOMContentLoaded', () => {
    generateTileBoard(4, 4);
    setTileEmojis(4 * 4 / 2);

    helpButton.addEventListener('click', () => displayHelp(helpModal));
    closeHelpButton.addEventListener('click', () => closeModal());
    overlay.addEventListener('click', () => closeModal());
})

function displayHelp(helpModal) {
    helpModal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal() {
    helpModal.classList.remove('active');
    resultModal.classList.remove('active');
    overlay.classList.remove('active');
}

function generateTileBoard(numRows, numCols) {
    gameBoard.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
    gameBoard.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

    for (let i = 0; i < numRows * numCols; i++) {
        const tile = document.createElement('div');
        tile.classList.add('game-tile');
        tile.addEventListener('click', handleTileClick);
        gameBoard.appendChild(tile);
    }
}

function handleTileClick() {
    this.classList.add('revealed');
    this.classList.add('flipped')
    setTimeout(() => {
        const emoji = this.getAttribute('data-emoji');
        this.innerHTML = emoji;
    }, 125);
}

function setTileEmojis(numPairs) {
    const selectedEmojis = [];
    while (selectedEmojis.length < numPairs * 2) {
        const randomIndex = Math.floor(Math.random() * listOfEmojis.length);
        if (!selectedEmojis.includes(listOfEmojis[randomIndex])) {
            selectedEmojis.push(listOfEmojis[randomIndex]);
            selectedEmojis.push(listOfEmojis[randomIndex]);
        }
    }

    shuffleArray(selectedEmojis);
    const tiles = document.querySelectorAll('.game-tile');
    tiles.forEach((tile, index) => {
        tile.setAttribute('data-emoji', selectedEmojis[index]);
    })
    console.log(selectedEmojis);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
