import React, { useState, useEffect, use } from "react";

const isValid = (grid, row, col, num) => {
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }

    let x = col - (col % 3);
    let y = row - (row % 3);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[y + i][x + j] === num) {
                return false;
            }
        }
    }
    return true;
};

const generateSudokuGrid = () => {
    let grid = Array(9).fill().map(() => Array(9).fill(0));

    const solve = () => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (solve()) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    if (solve()) {
        // Remove numbers randomly to create the puzzle
        let puzzle = JSON.parse(JSON.stringify(grid));
        let emptyCells = 30;

        while (emptyCells > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);

            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                emptyCells--;
            }
        }
        return puzzle;
    } else return grid;
};

const Sudoku = () => {
    const [grid, setGrid] = useState([]);
    const [cellToFill, setCellToFill] = useState(0);
    const [selectedNum, setSelectedNum] = useState(1);
    const [gameState, setGameState] = useState(false);

    useEffect(() => {
        let board = generateSudokuGrid();
        setGrid(board);
        countEmptyCells(board);
    }, []);

    const select = (num) => {
        setSelectedNum(num);
    };

    const countEmptyCells = (board) => {
        // Count the number of cells with value 0 (empty cells) in the entire grid
        const emptyCount = board.reduce((acc, row) => {
            return acc + row.filter(cell => cell === 0).length;
        }, 0);

        setCellToFill(emptyCount);
        if (emptyCount === 0) {
            setGameState(true);
        }
    };


    const place = (e, row, col) => {
        countEmptyCells(grid);
        if (e.currentTarget.classList.contains("active")) {
            e.currentTarget.querySelector(
                "h1"
            ).innerText = "";
            e.currentTarget.classList.remove("active")
            const newGrid = grid.map((r, rowIndex) =>
                rowIndex === row
                    ? r.map((cell, colIndex) =>
                        colIndex === col ? 0 : cell
                    )
                    : r
            );
            setGrid(newGrid);

        }
        else if (isValid(grid, row, col, selectedNum)) {
            const newGrid = grid.map((r, rowIndex) =>
                rowIndex === row
                    ? r.map((cell, colIndex) =>
                        colIndex === col ? selectedNum : cell
                    )
                    : r
            );
            setGrid(newGrid);
            e.currentTarget.classList.add("active");
        }
    };

    return (
        <div className="bg-slate-900 h-screen flex flex-col gap-2 justify-center items-center select-none">
            {
                gameState && (
                    <div className="bg-slate-800 rounded-lg p-2 w-130 h-130 fixed text-center content-center text-2xl font-bold text-white">
                        <h1 className="mb-10">You Win!</h1>
                        <button className="py-2 px-4 bg-green-500 rounded-full" onClick={() => {
                            setGameState(false);
                            selectedNum(1);
                            let newBoard = generateSudokuGrid();
                            setGrid(newBoard);
                            countEmptyCells(newBoard);

                        }}>Try Again</button>
                    </div>
                )
            }

            <div className="text-white text-4xl">
                <h1>Sudoku</h1>
            </div>
            <h1 className="text-white">Empty Slot: {cellToFill}</h1>
            <div className="bg-slate-800 rounded-lg p-2 w-130 h-130 grid gap-1 grid-cols-3 grid-rows-3">
                {grid.map((row, row_i) => (
                    <div key={row_i} className="grid grid-cols-3 grid-rows-3 gap-1 p-[1px]">
                        {row.map((cell, col_i) => (
                            <div
                                key={col_i}
                                className="bg-slate-700 rounded-md flex items-center justify-center text-white text-xl border-2 border-dashed border-transparent hover:border-white cursor-pointer active:bg-slate-600"
                                onClick={(e) => { place(e, row_i, col_i); }}
                            >
                                <h1>{cell === 0 ? "" : cell}</h1>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="bg-slate-800 rounded-lg p-4 w-130 h-20 grid grid-cols-9 gap-2">
                {Array(9)
                    .fill()
                    .map((_, index) => (
                        <div
                            key={index}
                            className={`bg-slate-700 rounded-md flex items-center justify-center text-white text-xl cursor-pointer transition-all duration-300 ease-in-out 
                                ${selectedNum === index + 1 ? "bg-blue-500" : "hover:bg-slate-600 active:bg-slate-500"}`}
                            onClick={() => select(index + 1)}
                        >
                            <h1>{index + 1}</h1>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Sudoku;
