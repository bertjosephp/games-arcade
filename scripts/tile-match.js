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