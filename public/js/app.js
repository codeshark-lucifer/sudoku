window.onload = () => {
    const board = document.getElementById('board');
    const size = 9;
    for(let i = 0; i < size; i++) {
        const row = document.createElement('div');  
        row.classList.add('row');
        for(let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            row.appendChild(cell);
        }
        board.appendChild(row)
    }
}