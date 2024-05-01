const rows = document.querySelectorAll('.row');
const correctAnswer = "DIARY";
let isAnswerCorrect = false;


document.addEventListener('DOMContentLoaded', () => {
    let currentRow = 0;     // first row
    disableAllInputs();
    enableRow(rows[currentRow]);
})

function disableAllInputs() {
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            input.disabled = true;
        })
    })
}

function enableRow(row) {
    const inputs = row.querySelectorAll('input[type="text"]');
    inputs[0].disabled = false;
    inputs[0].focus();
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            moveFocusToNextInput(input, inputs);
        })
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                checkIfRowIsFull(row, inputs);
            }
        })
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace') {
                moveFocusToPreviousInput(input, inputs);
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

function checkIfRowIsFull(row, rowInputs) {
    const isFull = Array.from(rowInputs).every(rowInput => rowInput.value.length === rowInput.maxLength);
    if (isFull) {
        verifyAnswer(rowInputs);
        if (isAnswerCorrect) {
            disableAllInputs();
            alert("You win!");
        }
        else if (row.nextElementSibling) {
            enableRow(row.nextElementSibling)
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
        isAnswerCorrect = true;
    }
}