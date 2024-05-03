const listOfEmojis = ["😀", "😂", "🥰", "😝", "😎", "🤩", "🥳", "😭", "🐶", "🐱", "🐭", "🐹", "🐰", "🐻‍❄️", "🐮", "🐵", "⚽️", "🏀", "🏈", "⚾️", "🎱", "🎾", "🏐", "🏉", "🍎", "🍋", "🍉", "🍇", 
"🍓", "🍒", "🍍", "🥝", "🚗", "🚙", "🏎️", "🚑", "🚒", "🚛", "🚲", "🛵"];

// DOM Elements
const gameBoard = document.querySelector('.game-board');
const helpButton = document.querySelector('.help-button');
const restartButtons = document.querySelectorAll('.restart-button');
const closeHelpButton = document.querySelector('.close-help-button');
const helpModal = document.getElementById('help-modal');
const resultModal = document.getElementById('result-modal')
const resultTitle = document.querySelector('.result-title');
const resultMessage = document.querySelector('.result-message');
const overlay = document.getElementById('overlay');

// Global variables
const flippedTiles = [];
const matchedTiles = [];
const numRows = 4;          // numRows * numCols MUST be even!
const numCols = 4;          //

document.addEventListener('DOMContentLoaded', () => {
    // Generate 4x4 tile board
    generateTileBoard(numRows, numCols);

    // Set emojis
    setTileEmojis(numRows * numCols / 2);

    // Attach event listeners to buttons and overlay
    helpButton.addEventListener('click', () => displayHelp(helpModal));
    closeHelpButton.addEventListener('click', () => closeModal());
    overlay.addEventListener('click', () => closeModal());
    restartButtons.forEach(restartButton => {
        restartButton.addEventListener('click', () => restartGame());
    })
})

// Open help modal
function displayHelp(helpModal) {
    helpModal.classList.add('active');
    overlay.classList.add('active');
}

// Close modal
function closeModal() {
    helpModal.classList.remove('active');
    resultModal.classList.remove('active');
    overlay.classList.remove('active');
}

// Generate game board
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

// Reveal a tile that has't been matched yet
// If two tiles that don't match are flipped, hide them after a certain delay
// If they match, check if all the tiles have been flipped, then display result if game is over
function handleTileClick() {
    if (matchedTiles.includes(this)) {
        return;
    }
    
    revealTile(this);

    if (flippedTiles.length === 0) {
        flippedTiles.push(this);
    } else if (flippedTiles.length === 1) {
        flippedTiles.push(this);
        
        isMatch = checkIfTilesMatch();
        if (!isMatch) {
            const tilesToHide = [...flippedTiles];
            hideTiles(tilesToHide);
        }
        flippedTiles.length = 0;
        
        if (isMatch && matchedTiles.length === numRows * numCols) {
            displayResult(resultModal);
        }
    }
}

// Reveal the emoji on the tile, with animation
function revealTile(tile) {
    tile.classList.add('revealed');
    setTimeout(() => {
        const emoji = tile.getAttribute('data-emoji');
        tile.innerHTML = emoji;
    }, 125);
}

// Hide the last 2 non-matching tiles, with animation
function hideTiles(tilesToHide) {
    setTimeout(() => {
        tilesToHide.forEach(tile => {
            tile.classList.remove('revealed');
            tile.classList.add('hidden');
            setTimeout(() => {
                tile.innerHTML = '';
            }, 125);
            setTimeout(() => {
                tile.classList.remove('hidden');
            }, 250);
        })
    }, 500);
}

// Check if the last 2 tiles flipped match
function checkIfTilesMatch() {
    if (flippedTiles[0].getAttribute('data-emoji') === flippedTiles[1].getAttribute('data-emoji')) {
        matchedTiles.push(flippedTiles[0]);
        matchedTiles.push(flippedTiles[1]);
        return true;
    }
    return false;
}

// Assign tiles with emojis
function setTileEmojis(numPairs) {
    // Select random pairs of emojis from list
    const selectedEmojis = [];
    while (selectedEmojis.length < numPairs * 2) {
        const randomIndex = Math.floor(Math.random() * listOfEmojis.length);
        if (!selectedEmojis.includes(listOfEmojis[randomIndex])) {
            selectedEmojis.push(listOfEmojis[randomIndex]);
            selectedEmojis.push(listOfEmojis[randomIndex]);
        }
    }

    // Shuffle list of emojis
    shuffleArray(selectedEmojis);

    // Assign shuffled emojis to tiles
    const tiles = document.querySelectorAll('.game-tile');
    tiles.forEach((tile, index) => {
        tile.setAttribute('data-emoji', selectedEmojis[index]);
    })
}

// Helper function to shuffle a list
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Display result
function displayResult(resultModal) {
    resultModal.classList.add('active');
    overlay.classList.add('active');
}

// Reset emojis, board, and DOM elements
function restartGame() {
    const tiles = document.querySelectorAll('.game-tile');
    tiles.forEach(tile => {
        tile.classList.remove('revealed');
        tile.innerHTML = '';
    })
    flippedTiles.length = 0;
    matchedTiles.length = 0;
    setTileEmojis(numRows * numCols / 2);
    closeModal();
}
