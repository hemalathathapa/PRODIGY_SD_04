const SIZE = 9;
const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

// Function to create the Sudoku grid inputs
function createGrid() {
    const gridContainer = document.getElementById('sudoku-grid');
    gridContainer.innerHTML = '';
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.max = 9;
            input.value = grid[row][col] || '';
            input.dataset.row = row;
            input.dataset.col = col;
            input.oninput = handleInput;
            gridContainer.appendChild(input);
        }
    }
}

// Handle input changes to update the grid array
function handleInput(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    const value = event.target.value;
    grid[row][col] = value ? parseInt(value) : 0;
}

// Function to check if it's safe to place a number in a cell
function isSafe(grid, row, col, num) {
    for (let x = 0; x < SIZE; x++) {
        if (grid[row][x] === num || grid[x][col] === num) {
            return false;
        }
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }

    return true;
}

// Function to validate the Sudoku grid
function isValidSudoku(grid) {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const num = grid[row][col];
            if (num !== 0) {
                grid[row][col] = 0;
                if (!isSafe(grid, row, col, num)) {
                    return false;
                }
                grid[row][col] = num;
            }
        }
    }
    return true;
}

// Function to solve the Sudoku using backtracking
function solveSudoku(grid, row = 0, col = 0) {
    if (row === SIZE - 1 && col === SIZE) {
        return true;
    }

    if (col === SIZE) {
        row++;
        col = 0;
    }

    if (grid[row][col] !== 0) {
        return solveSudoku(grid, row, col + 1);
    }

    for (let num = 1; num <= 9; num++) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid, row, col + 1)) {
                return true;
            }
        }

        grid[row][col] = 0;
    }

    return false;
}

// Function to initiate solving and display the result
function solveSudokuHandler() {
    const resultsDiv = document.getElementById('results');
    if (!isValidSudoku(grid)) {
        resultsDiv.innerHTML = 'No solution exists';
        return;
    }
    const copiedGrid = grid.map(row => [...row]);
    if (solveSudoku(copiedGrid)) {
        resultsDiv.innerHTML = 'Solved Sudoku:';
        displayGrid(copiedGrid);
    } else {
        resultsDiv.innerHTML = 'No solution exists';
    }
}

// Function to display the solved Sudoku grid
function displayGrid(solvedGrid) {
    const gridContainer = document.getElementById('sudoku-grid');
    const inputs = gridContainer.querySelectorAll('input');
    inputs.forEach(input => {
        const row = input.dataset.row;
        const col = input.dataset.col;
        input.value = solvedGrid[row][col];
    });
}

createGrid();
