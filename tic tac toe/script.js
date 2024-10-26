var single = document.getElementById('single');
var two = document.getElementById('two');
var playParent = document.querySelector('.play');
var max_matches = 0;
var total_matches = 0;
var xWins = 0;
var oWins = 0;

var grid = document.getElementById('grid');
var set_score = document.getElementById('set_score');
var button_place = document.getElementById('button_place');
var score_place = document.getElementById('score');

single.addEventListener('click', startSinglePlayer);
two.addEventListener('click', startTwoPlayers);

function startSinglePlayer() {
    setupGame(true);
}

function startTwoPlayers() {
    setupGame(false);
}

function setupGame(isSinglePlayer) {
    var childs = playParent.querySelectorAll('.single');
    childs.forEach(function(child) {
        playParent.removeChild(child);
    });

    const set_score_clone = set_score.content.cloneNode(true);
    playParent.appendChild(set_score_clone);

    var undo = document.querySelector('#undo');
    var input = document.querySelector('#win_score');
    var go = document.querySelector('#go');

    go.addEventListener('click', function() {
        var text = document.querySelector('#result');
        
        if (input.value === '' || input.value <= 0) {
            text.innerHTML = 'Please enter the number of matches';
        } else {
            playParent.innerHTML = "";
            max_matches = parseInt(input.value);
            total_matches = 0;
            xWins = 0;
            oWins = 0;
            var roundCounter = 1;  
            text.innerHTML = `Runda ${roundCounter}`;

            const grid_clone = grid.content.cloneNode(true);
            var parent_grid = document.querySelector('.play');
            parent_grid.appendChild(grid_clone);

            var put_score = document.querySelector('.put_score');
            const score_clone = score_place.content.cloneNode(true);
            put_score.appendChild(score_clone);
            document.querySelector('#x_score').value = xWins;  
            document.querySelector('#y_score').value = oWins;  

            var currentPlayer = 'X';  
            var gameActive = true;    
            var gameState = Array(9).fill("");  
            
            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];

            function handleCellClick(event) {
                const clickedCell = event.target;
                const clickedCellIndex = Array.from(cell).indexOf(clickedCell);

                if (gameState[clickedCellIndex] !== "" || !gameActive) {
                    return;
                }

                gameState[clickedCellIndex] = currentPlayer;
                clickedCell.querySelector('img').src = currentPlayer === 'X' ? 'img/close.png' : 'img/circle.png';

                checkWinner();

                if (isSinglePlayer && gameActive) {
                    currentPlayer = 'O'; 
                    setTimeout(aiMove, 500); 
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            }

            function aiMove() {
                let availableCells = gameState.map((value, index) => value === "" ? index : null).filter(val => val !== null);
                
                if (availableCells.length === 0) return; 

                const aiMoveIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
                
                gameState[aiMoveIndex] = currentPlayer;
                const clickedCell = cell[aiMoveIndex];
                clickedCell.querySelector('img').src = currentPlayer === 'X' ? 'img/close.png' : 'img/circle.png';

                checkWinner();

                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }

            function checkWinner() {
                let roundWon = false;

                for (let i = 0; i < winningConditions.length; i++) {
                    const winCondition = winningConditions[i];
                    const a = gameState[winCondition[0]];
                    const b = gameState[winCondition[1]];
                    const c = gameState[winCondition[2]];

                    if (a === '' || b === '' || c === '') {
                        continue;
                    }

                    if (a === b && b === c) {
                        roundWon = true;
                        break;
                    }
                }

                if (roundWon) {
                    gameActive = false;
                    total_matches++;
                    if (currentPlayer === 'X') {
                        xWins++;
                        document.querySelector('#x_score').value = xWins;
                    } else {
                        oWins++;
                        document.querySelector('#y_score').value = oWins;
                    }

                    if (total_matches >= max_matches) {
                        let winner = xWins > oWins ? 'X' : oWins > xWins ? 'O' : 'Remiză';
                        document.querySelector('#result').innerHTML = `Joc terminat! Câștigător: ${winner}`;
                    } else {
                        roundCounter++;
                        document.querySelector('#result').innerHTML = `Runda ${roundCounter}`;
                        resetGrid();
                    }
                    return;
                }

                const roundDraw = !gameState.includes("");
                if (roundDraw) {
                    gameActive = false;
                    total_matches++;
                    if (total_matches >= max_matches) {
                        let winner = xWins > oWins ? 'X' : oWins > xWins ? 'O' : 'Remiză';
                        document.querySelector('#result').innerHTML = `Joc terminat! Câștigător: ${winner}`;
                    } else {
                        roundCounter++;
                        document.querySelector('#result').innerHTML = `Runda ${roundCounter}`;
                        resetGrid();
                    }
                }
            }

            function resetGrid() {
                gameState = Array(9).fill("");
                gameActive = true;
                document.querySelectorAll('.cell img').forEach(img => img.src = '');
            }

            const cell = document.querySelectorAll('.cell');
            cell.forEach(c => c.addEventListener('click', handleCellClick));
        }
    });

    undo.addEventListener('click', undo_click);
}

function undo_click() {
    playParent.innerHTML = '';

    const buttons = button_place.content.cloneNode(true);
    playParent.appendChild(buttons);

    var new_single = document.getElementById('single');
    var new_two = document.getElementById('two');

    new_single.addEventListener('click', startSinglePlayer);
    new_two.addEventListener('click', startTwoPlayers);
}
