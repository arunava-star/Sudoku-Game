const boardElement = document.getElementById('sudoku-board');
const solveButton = document.getElementById('solve');
const resetButton = document.getElementById('reset');
const checkButton = document.getElementById('check');
const timeElement = document.getElementById('time');
const messageElement = document.getElementById('message');
const celebrationElement = document.getElementById('celebration');
let board = Array.from({ length: 9 }, () => Array(9).fill(0));
let startTime, timerInterval;

// Initialize the game
function init() {
    generateBoard('easy');
    startTimer();
}

// Generate the Sudoku board
function generateBoard(difficulty) {
    board = Array.from({ length: 9 }, () => Array(9).fill(0));
    boardElement.innerHTML = '';
    generateSudoku(board, difficulty);

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.style.backgroundColor = '#ddd';
            } else {
                cell.contentEditable = true;
                cell.addEventListener('input', () => validateInput(cell, i, j));
            }
            boardElement.appendChild(cell);
        }
    }
}

// Generate a Sudoku puzzle
function generateSudoku(board, difficulty) {
    solveSudoku(board);
    let removeCount;
    switch (difficulty) {
        case 'easy':
            removeCount = 40;
            break;
        case 'medium':
            removeCount = 50;
            break;
        case 'hard':
            removeCount = 60;
            break;
        default:
            removeCount = 40;
    }

    while (removeCount > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removeCount--;
        }
    }
}

// Solve the Sudoku puzzle
function solveSudoku(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, i, j, num)) {
                        board[i][j] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Validate input in cells
function validateInput(cell, row, col) {
    const value = parseInt(cell.textContent);
    if (isNaN(value) || value < 1 || value > 9) {
        cell.textContent = '';
        messageElement.textContent = 'Please enter a number between 1 and 9.';
    // } else if (!isValid(board, row, col, value)) {
    //     messageElement.textContent = 'Invalid move!';
    } else {
        board[row][col] = value;
        messageElement.textContent = '';
        if (isSolved()) {
            celebrate();
        }
    }
}

// Check if the board is solved
function isSolved() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0 || !isValid(board, i, j, board[i][j])) {
                return false;
            }
        }
    }
    return true;
}

// Check if a number is valid in a cell
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

// Timer functionality
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    timeElement.textContent = `${minutes}:${seconds}`;
}

// Check Answer functionality
checkButton.addEventListener('click', () => {
    const cells = boardElement.querySelectorAll('div');
    let index = 0;
    let isCorrect = true;

    // Validate the user's input
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cellValue = parseInt(cells[index].textContent);
            if (isNaN(cellValue) || cellValue < 1 || cellValue > 9 || !isValid(board, i, j, cellValue)) {
                isCorrect = false;
                // cells[index].style.backgroundColor = '#ffcccc'; // Highlight incorrect cells
            } else {
                cells[index].style.backgroundColor = '#ddd'; // Reset correct cells
            }
            index++;
        }
    }

    if (isCorrect) {
        messageElement.textContent = 'Congratulations! Your solution is correct!';
        celebrate();
    } else {
        messageElement.textContent = 'Oops! Your solution is incorrect. Keep trying!';
    }
});

// Winning celebration
function celebrate() {
    celebrationElement.textContent = 'You Win! 🎉';
    celebrationElement.classList.add('active');
    stopTimer();
    setTimeout(() => {
        celebrationElement.classList.remove('active');
    }, 2000);
}

// Reset the game
resetButton.addEventListener('click', () => {
    stopTimer();
    init();
});

// Solve the puzzle
solveButton.addEventListener('click', () => {
    solveSudoku(board);
    const cells = boardElement.querySelectorAll('div');
    let index = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells[index].textContent = board[i][j];
            index++;
        }
    }
    stopTimer();
});

// Event listeners for difficulty buttons
document.getElementById('easy').addEventListener('click', () => {
    stopTimer();
    generateBoard('easy');
    startTimer();
});
document.getElementById('medium').addEventListener('click', () => {
    stopTimer();
    generateBoard('medium');
    startTimer();
});
document.getElementById('hard').addEventListener('click', () => {
    stopTimer();
    generateBoard('hard');
    startTimer();
});

// Initialize the game
init();