const correctAnswer = "DIARY";
let currentRowIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    generateWordleBoard(6, 5)

    const rows = document.querySelectorAll('.row');
    disableAllInputs(rows);
    enableRow(currentRowIndex, rows);

    const submitButton = document.querySelector('.submit-button')
    submitButton.addEventListener('click', () => {
        checkIfRowIsFull(currentRowIndex, rows);
    })
})

function generateWordleBoard(numRows, numCols) {
    const gameBoard = document.querySelector('.game-board');
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < numCols; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.classList.add('wordle-input');
            row.appendChild(input);
        }
        gameBoard.appendChild(row);
    }
}

function disableAllInputs(rows) {
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.disabled = true;
        })
    })
}

function enableRow(rowIndex, rows) {
    const row = rows[rowIndex];
    const rowInputs = row.querySelectorAll('input[type="text"]');
    rowInputs[0].disabled = false;
    rowInputs[0].focus();
    rowInputs.forEach(currentInput => {
        currentInput.addEventListener('input', () => {
            currentInput.value = currentInput.value.toUpperCase();
            moveFocusToNextInput(currentInput, rowInputs);
        })
        currentInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                checkIfRowIsFull(currentRowIndex, rows);
            }
        })
        currentInput.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace') {
                moveFocusToPreviousInput(currentInput, rowInputs);
            }
        })        
    })
}

function moveFocusToPreviousInput(currentInput, rowInputs) {
    const currentIndex = Array.from(rowInputs).indexOf(currentInput);
    if (0 < currentIndex && currentIndex <= rowInputs.length - 1 && rowInputs[currentIndex].value.length === 0) {
        const previousInput = rowInputs[currentIndex - 1];
        currentInput.disabled = true;
        previousInput.disabled = false;
        previousInput.focus();
    }
}

function moveFocusToNextInput(currentInput, rowInputs) {
    const currentIndex = Array.from(rowInputs).indexOf(currentInput);
    if (0 <= currentIndex && currentIndex < rowInputs.length - 1 && rowInputs[currentIndex].value.length > 0) {
        const nextInput = rowInputs[currentIndex + 1];
        nextInput.disabled = false;
        currentInput.disabled = true;
        nextInput.focus();
    }
}

function checkIfRowIsFull(rowIndex, rows) {
    const row = rows[rowIndex];
    const rowInputs = row.querySelectorAll('input[type="text"]');
    const isFull = Array.from(rowInputs).every(rowInput => rowInput.value.length === rowInput.maxLength);
    if (isFull) {
        const isAnswerCorrect = verifyAnswer(rowInputs);
        if (isAnswerCorrect) {
            disableAllInputs();
            alert("You win!");
        }
        else if (row.nextElementSibling) {
            currentRowIndex += 1;
            enableRow(currentRowIndex, rows)
        } else {
            disableAllInputs();
            alert("You lose!\nThe hidden word is: " + correctAnswer);
        }
    }
}

function verifyAnswer(rowInputs) {
    const inputAnswer = Array.from(rowInputs).map(input => input.value).join('');
    Array.from(rowInputs).forEach((rowInput, index) => {
        if (correctAnswer[index] === rowInput.value) {
            rowInput.classList.add('correct-letter');
        } else if (correctAnswer.includes(rowInput.value)) {
            rowInput.classList.add('wrong-position');
        } else {
            rowInput.classList.add('wrong-letter');
        }
        rowInput.disabled = true;
    })
    if (inputAnswer === correctAnswer) {
        return true;
    }
    return false;
}