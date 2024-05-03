/*
    Made by: ScriptRaccoon
    Source code: https://github.com/ScriptRaccoon/Lights-Out-Vanilla-JavaScript
    Live demo of original: https://lichter-aus.netlify.app
                                                                                */

// * * * * * * * * * * * * * * * // Main // * * * * * * * * * * * * * * * //

const boardElement = document.getElementById("board");
const winElement = document.getElementById("win");
const restartBtn = document.getElementById("restartBtn");
const randomizeBtn = document.getElementById("randomizeBtn");
const sizeInput = document.getElementById("sizeInput");

let checkBoxes = [];
let size = 5;
let boxesOff = [];

init();

function init() {
	createBoard();
	initializeCheckBoxes();
	boardElement.style.setProperty("--size", size);
	restartBtn.addEventListener("click", restartGame);
	randomizeBtn.addEventListener("click", randomizeGame);
	sizeInput.value = size;
	sizeInput.addEventListener("change", resizeGame);
}

function createBoard() {
	boardElement.innerHTML = "";
	checkBoxes = [];
	for (let y = 1; y <= size; y++) {
		for (let x = 1; x <= size; x++) {
			const checkBox = document.createElement("input");
			checkBox.type = "checkbox";
			checkBoxes.push(checkBox);
			boardElement.appendChild(checkBox);
			checkBox.id = x + "," + y;
			checkBox.addEventListener("change", function () {
				changeCheckBox(x, y);
			});
			const labelElement = document.createElement("label");
			labelElement.setAttribute("for", checkBox.id);
			boardElement.appendChild(labelElement);
		}
	}
}

function initializeCheckBoxes() {
	checkBoxes.forEach(function (checkBox) {
		checkBox.checked = !boxesOff.includes(checkBox.id);
	});
}

function getCheckBox(x, y) {
	return document.getElementById(x + "," + y);
}

function toggle(checkBox) {
	checkBox.checked = !checkBox.checked;
}

function changeCheckBox(x, y) {
	if (x > 1) toggle(getCheckBox(x - 1, y));
	if (y > 1) toggle(getCheckBox(x, y - 1));
	if (x < size) toggle(getCheckBox(x + 1, y));
	if (y < size) toggle(getCheckBox(x, y + 1));
	checkWin();
}

function checkWin() {
	const hasWon = checkBoxes.every(function (checkBox) {
		return !checkBox.checked;
	});
	if (hasWon) {
		winElement.classList.add("visible");
	}
}

function restartGame() {
	winElement.classList.remove("visible");
	initializeCheckBoxes();
}

function randomizeGame() {
	boxesOff = [];
	checkBoxes.forEach(function (checkBox) {
		if (Math.random() < 0.5) {
			boxesOff.push(checkBox.id);
		}
	});
	restartGame();
}

function resizeGame() {
	const newSize = parseInt(sizeInput.value);
	if (newSize >= 0) {
		size = newSize;
		boxesOff = [];
		createBoard();
		boardElement.style.setProperty("--size", size);
		restartGame();
	}
}


/* * * * * * * * * * * * * * * * // Help Popup // * * * * * * * * * * * * * * * */

const helpButton = document.querySelector('.help-button');
const closeHelpButton = document.querySelector('.close-help-button');
const helpModal = document.getElementById('help-modal');

document.addEventListener('DOMContentLoaded', () => {
    helpButton.addEventListener('click', () => displayHelp(helpModal));
    closeHelpButton.addEventListener('click', () => closeModal());
    overlay.addEventListener('click', () => closeModal());
});

function displayHelp(helpModal) {
    helpModal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal() {
    helpModal.classList.remove('active');
    overlay.classList.remove('active');
}