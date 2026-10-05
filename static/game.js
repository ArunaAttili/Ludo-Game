// ============================================================
// LUDO GAME - FULL GAME.JS
// ============================================================

const board = document.getElementById("board");

const rollButton =
    document.getElementById("rollButton") ||
    document.getElementById("rollBtn");

const diceElement =
    document.getElementById("dice") ||
    document.getElementById("diceElement");

const turnText =
    document.getElementById("turn") ||
    document.getElementById("turnText");

const messageElement =
    document.getElementById("message") ||
    document.getElementById("messageElement");


// ============================================================
// PLAYERS
// ============================================================

const players = [
    {
        name: "Player 1",
        color: "red",
        start: 0
    },
    {
        name: "Player 2",
        color: "green",
        start: 13
    },
    {
        name: "Player 3",
        color: "yellow",
        start: 26
    },
    {
        name: "Player 4",
        color: "blue",
        start: 39
    }
];


// ============================================================
// 15 x 15 MAIN TRACK
// ============================================================

const track = [

    [6,0],
    [6,1],
    [6,2],
    [6,3],
    [6,4],
    [6,5],

    [5,6],
    [4,6],
    [3,6],
    [2,6],
    [1,6],
    [0,6],

    [0,7],
    [0,8],

    [1,8],
    [2,8],
    [3,8],
    [4,8],
    [5,8],

    [6,9],
    [6,10],
    [6,11],
    [6,12],
    [6,13],
    [6,14],

    [7,14],
    [8,14],

    [8,13],
    [8,12],
    [8,11],
    [8,10],
    [8,9],

    [9,8],
    [10,8],
    [11,8],
    [12,8],
    [13,8],
    [14,8],

    [14,7],
    [14,6],

    [13,6],
    [12,6],
    [11,6],
    [10,6],
    [9,6],

    [8,5],
    [8,4],
    [8,3],
    [8,2],
    [8,1],
    [8,0],

    [7,0]
];


// ============================================================
// HOME TOKEN POSITIONS
// ============================================================

const homeSlots = [

    // RED - TOP LEFT
    [
        [1,1],
        [1,4],
        [4,1],
        [4,4]
    ],

    // GREEN - TOP RIGHT
    [
        [1,10],
        [1,13],
        [4,10],
        [4,13]
    ],

    // YELLOW - BOTTOM RIGHT
    [
        [10,10],
        [10,13],
        [13,10],
        [13,13]
    ],

    // BLUE - BOTTOM LEFT
    [
        [10,1],
        [10,4],
        [13,1],
        [13,4]
    ]
];


// ============================================================
// FINAL / WINNING LANES
// ============================================================

const winningLanes = [

    // RED
    [
        [7,1],
        [7,2],
        [7,3],
        [7,4],
        [7,5],
        [7,6]
    ],

    // GREEN
    [
        [1,7],
        [2,7],
        [3,7],
        [4,7],
        [5,7],
        [6,7]
    ],

    // YELLOW
    [
        [7,13],
        [7,12],
        [7,11],
        [7,10],
        [7,9],
        [7,8]
    ],

    // BLUE
    [
        [13,7],
        [12,7],
        [11,7],
        [10,7],
        [9,7],
        [8,7]
    ]
];


// ============================================================
// SAFE STAR CELLS
// ============================================================

const safeCells = [
    [3,6],
    [6,11],
    [11,8],
    [8,3]
];


// ============================================================
// GAME STATE
// ============================================================

let currentPlayer = 0;
let diceValue = 0;
let diceRolled = false;
let winnerFound = false;


// -1 = HOME
// 0 = START
// 1...56 = MAIN TRACK
// 57 = FINISHED

const tokens = players.map(
    (player, playerIndex) => {

        return [
            {
                playerIndex: playerIndex,
                tokenNumber: 0,
                progress: -1
            },
            {
                playerIndex: playerIndex,
                tokenNumber: 1,
                progress: -1
            },
            {
                playerIndex: playerIndex,
                tokenNumber: 2,
                progress: -1
            },
            {
                playerIndex: playerIndex,
                tokenNumber: 3,
                progress: -1
            }
        ];
    }
);


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isSafeCell(row, col) {

    return safeCells.some(
        ([r, c]) =>
            r === row &&
            c === col
    );
}


function getCell(row, col) {

    return document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );
}


function getAbsolutePosition(
    playerIndex,
    progress
) {

    if (
        progress < 0 ||
        progress > 56
    ) {
        return -1;
    }

    return (
        players[playerIndex].start +
        progress
    ) % track.length;
}


function isSafeTrackPosition(
    trackIndex
) {

    if (
        trackIndex < 0 ||
        trackIndex >= track.length
    ) {
        return false;
    }

    const [
        row,
        col
    ] = track[trackIndex];

    return isSafeCell(row, col);
}


// ============================================================
// CREATE BOARD
// ============================================================

function createBoard() {

    board.innerHTML = "";

    for (
        let row = 0;
        row < 15;
        row++
    ) {

        for (
            let col = 0;
            col < 15;
            col++
        ) {

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;


            // =================================================
            // DARK HOME AREAS
            // =================================================

            // 🔴 RED - TOP LEFT
            if (
                row >= 0 &&
                row <= 5 &&
                col >= 0 &&
                col <= 5
            ) {

                cell.classList.add(
                    "red-home"
                );
            }


            // 🟢 GREEN - TOP RIGHT
            else if (
                row >= 0 &&
                row <= 5 &&
                col >= 9 &&
                col <= 14
            ) {

                cell.classList.add(
                    "green-home"
                );
            }


            // 🔵 BLUE - BOTTOM LEFT
            else if (
                row >= 9 &&
                row <= 14 &&
                col >= 0 &&
                col <= 5
            ) {

                cell.classList.add(
                    "blue-home"
                );
            }


            // 🟡 YELLOW - BOTTOM RIGHT
            else if (
                row >= 9 &&
                row <= 14 &&
                col >= 9 &&
                col <= 14
            ) {

                cell.classList.add(
                    "yellow-home"
                );
            }


            // =================================================
            // LIGHT FINAL PATHS
            // =================================================

            // 🟢 LIGHT GREEN
            if (
                col === 7 &&
                row >= 1 &&
                row <= 6
            ) {

                cell.classList.add(
                    "green-path"
                );
            }


            // 🩷 LIGHT RED
            if (
                row === 7 &&
                col >= 1 &&
                col <= 6
            ) {

                cell.classList.add(
                    "red-path"
                );
            }


            // 🟨 LIGHT YELLOW
            if (
                row === 7 &&
                col >= 8 &&
                col <= 13
            ) {

                cell.classList.add(
                    "yellow-path"
                );
            }


            // 🔵 LIGHT BLUE
            if (
                col === 7 &&
                row >= 8 &&
                row <= 13
            ) {

                cell.classList.add(
                    "blue-path"
                );
            }


            // =================================================
            // ENTRANCE / START COLOURS
            // NO ARROW
            // =================================================

            // RED START
            if (
                row === 6 &&
                col === 0
            ) {

                cell.classList.add(
                    "red-start"
                );
            }


            // GREEN START
            if (
                row === 0 &&
                col === 7
            ) {

                cell.classList.add(
                    "green-start"
                );
            }


            // YELLOW START
            if (
                row === 7 &&
                col === 14
            ) {

                cell.classList.add(
                    "yellow-start"
                );
            }


            // BLUE START
            if (
                row === 14 &&
                col === 7
            ) {

                cell.classList.add(
                    "blue-start"
                );
            }


            // =================================================
            // SAFE STAR
            // =================================================

            if (
                isSafeCell(row, col)
            ) {

                const star =
                    document.createElement("span");

                star.textContent = "★";

                star.style.position =
                    "absolute";

                star.style.left = "50%";
                star.style.top = "50%";

                star.style.transform =
                    "translate(-50%, -50%)";

                star.style.fontSize =
                    "24px";

                star.style.lineHeight = "1";

                star.style.color =
                    "#ffffff";

                star.style.fontWeight =
                    "bold";

                star.style.textShadow =
                    "-2px -2px 0 #000, " +
                    "2px -2px 0 #000, " +
                    "-2px 2px 0 #000, " +
                    "2px 2px 0 #000";

                star.style.zIndex = "100";

                star.style.pointerEvents =
                    "none";

                cell.appendChild(star);
            }


            // =================================================
            // WINNING PATH ARROWS ONLY
            // =================================================

            // RED
            if (
                row === 7 &&
                col === 6
            ) {

                addArrow(
                    cell,
                    "→"
                );
            }


            // GREEN
            if (
                row === 6 &&
                col === 7
            ) {

                addArrow(
                    cell,
                    "↓"
                );
            }


            // YELLOW
            if (
                row === 7 &&
                col === 8
            ) {

                addArrow(
                    cell,
                    "←"
                );
            }


            // BLUE
            if (
                row === 8 &&
                col === 7
            ) {

                addArrow(
                    cell,
                    "↑"
                );
            }


            board.appendChild(cell);
        }
    }


    createCenter();
}


// ============================================================
// ADD WINNING ARROW
// ============================================================

function addArrow(
    cell,
    symbol
) {

    const arrow =
        document.createElement("span");

    arrow.textContent = symbol;

    arrow.className =
        "finish-arrow";

    cell.appendChild(arrow);
}


// ============================================================
// CENTER
// ============================================================

function createCenter() {

    const center =
        getCell(7, 7);

    if (!center) {
        return;
    }

    center.innerHTML = "";

    center.classList.add(
        "center"
    );

    const red =
        document.createElement("div");

    red.className =
        "center-red";

    const green =
        document.createElement("div");

    green.className =
        "center-green";

    const yellow =
        document.createElement("div");

    yellow.className =
        "center-yellow";

    const blue =
        document.createElement("div");

    blue.className =
        "center-blue";

    center.appendChild(red);
    center.appendChild(green);
    center.appendChild(yellow);
    center.appendChild(blue);
}


// ============================================================
// RENDER TOKENS
// ============================================================

function renderTokens() {

    document
        .querySelectorAll(".token")
        .forEach(
            token =>
                token.remove()
        );


    for (
        let playerIndex = 0;
        playerIndex < 4;
        playerIndex++
    ) {

        for (
            let tokenIndex = 0;
            tokenIndex < 4;
            tokenIndex++
        ) {

            const token =
                tokens[playerIndex][tokenIndex];


            // HOME
            if (
                token.progress === -1
            ) {

                const [
                    row,
                    col
                ] =
                    homeSlots[playerIndex][tokenIndex];

                const cell =
                    getCell(row, col);

                if (cell) {

                    createToken(
                        cell,
                        playerIndex,
                        tokenIndex
                    );
                }

                continue;
            }


            // FINISHED
            if (
                token.progress === 57
            ) {
                continue;
            }


            // MAIN TRACK
            if (
                token.progress >= 0 &&
                token.progress <= 56
            ) {

                const position =
                    getAbsolutePosition(
                        playerIndex,
                        token.progress
                    );

                const [
                    row,
                    col
                ] = track[position];

                const cell =
                    getCell(row, col);

                if (cell) {

                    createToken(
                        cell,
                        playerIndex,
                        tokenIndex
                    );
                }
            }
        }
    }
}


// ============================================================
// CREATE TOKEN
// ============================================================

function createToken(
    cell,
    playerIndex,
    tokenIndex
) {

    const token =
        document.createElement("button");

    token.classList.add(
        "token",
        `${players[playerIndex].color}-token`
    );

    token.textContent =
        tokenIndex + 1;

    token.dataset.player =
        playerIndex;

    token.dataset.token =
        tokenIndex;

    token.addEventListener(
        "click",
        function () {

            if (
                playerIndex !==
                currentPlayer
            ) {
                return;
            }

            if (!diceRolled) {
                return;
            }

            moveToken(
                playerIndex,
                tokenIndex
            );
        }
    );

    cell.appendChild(token);
}


// ============================================================
// ROLL DICE
// ============================================================

function rollDice() {

    if (winnerFound) {
        return;
    }

    if (diceRolled) {
        return;
    }

    diceValue =
        Math.floor(
            Math.random() * 6
        ) + 1;

    diceRolled = true;

    diceElement.textContent =
        diceValue;

    rollButton.disabled =
        true;

    messageElement.textContent =
        `${players[currentPlayer].name} rolled ${diceValue}.`;


    const movable =
        getMovableTokens(
            currentPlayer,
            diceValue
        );


    if (
        movable.length === 0
    ) {

        messageElement.textContent =
            `${players[currentPlayer].name} cannot move.`;

        setTimeout(
            nextTurn,
            800
        );

        return;
    }


    if (
        movable.length === 1
    ) {

        setTimeout(
            function () {

                moveToken(
                    currentPlayer,
                    movable[0]
                );

            },
            350
        );
    }
}


// ============================================================
// GET MOVABLE TOKENS
// ============================================================

function getMovableTokens(
    playerIndex,
    dice
) {

    const movable = [];

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const token =
            tokens[playerIndex][i];


        // HOME
        if (
            token.progress === -1
        ) {

            if (
                dice === 6
            ) {

                movable.push(i);
            }

            continue;
        }


        // FINISHED
        if (
            token.progress === 57
        ) {
            continue;
        }


        // EXACT FINISH
        if (
            token.progress + dice <= 57
        ) {

            movable.push(i);
        }
    }

    return movable;
}


// ============================================================
// MOVE TOKEN
// ============================================================

function moveToken(
    playerIndex,
    tokenIndex
) {

    if (!diceRolled) {
        return;
    }

    if (
        playerIndex !==
        currentPlayer
    ) {
        return;
    }

    const token =
        tokens[playerIndex][tokenIndex];


    // ========================================================
    // HOME TOKEN OUT
    // ========================================================

    if (
        token.progress === -1
    ) {

        if (
            diceValue !== 6
        ) {
            return;
        }

        // 6 only brings token to START
        token.progress = 0;
    }


    // ========================================================
    // NORMAL MOVE
    // ========================================================

    else {

        if (
            token.progress +
            diceValue >
            57
        ) {

            return;
        }

        token.progress +=
            diceValue;
    }


    // ========================================================
    // CAPTURE
    // ========================================================

    let captured = false;

    if (
        token.progress >= 0 &&
        token.progress <= 56
    ) {

        const position =
            getAbsolutePosition(
                playerIndex,
                token.progress
            );


        if (
            !isSafeTrackPosition(
                position
            )
        ) {

            captured =
                captureOpponent(
                    playerIndex,
                    position
                );
        }
    }


    renderTokens();


    // ========================================================
    // WIN
    // ========================================================

    if (
        checkWinner(
            playerIndex
        )
    ) {

        winnerFound = true;

        messageElement.textContent =
            `${players[playerIndex].name} WINS! 🎉`;

        turnText.textContent =
            `${players[playerIndex].name} Wins!`;

        rollButton.disabled =
            true;

        return;
    }


    // ========================================================
    // EXTRA TURN
    // ========================================================

    if (
        diceValue === 6 ||
        captured
    ) {

        diceRolled = false;

        rollButton.disabled =
            false;

        if (captured) {

            messageElement.textContent =
                "Token captured! Roll again.";

        } else {

            messageElement.textContent =
                "You rolled 6. Roll again.";
        }

        return;
    }


    // ========================================================
    // NEXT PLAYER
    // ========================================================

    nextTurn();
}


// ============================================================
// CAPTURE OPPONENT
// ============================================================

function captureOpponent(
    playerIndex,
    position
) {

    let captured = false;

    for (
        let opponent = 0;
        opponent < 4;
        opponent++
    ) {

        if (
            opponent === playerIndex
        ) {
            continue;
        }


        for (
            let tokenIndex = 0;
            tokenIndex < 4;
            tokenIndex++
        ) {

            const token =
                tokens[opponent][tokenIndex];


            if (
                token.progress < 0 ||
                token.progress > 56
            ) {
                continue;
            }


            const opponentPosition =
                getAbsolutePosition(
                    opponent,
                    token.progress
                );


            if (
                opponentPosition ===
                position
            ) {

                token.progress = -1;

                captured = true;
            }
        }
    }

    return captured;
}


// ============================================================
// WINNER
// ============================================================

function checkWinner(
    playerIndex
) {

    return tokens[playerIndex]
        .every(
            token =>
                token.progress === 57
        );
}


// ============================================================
// NEXT TURN
// ============================================================

function nextTurn() {

    diceRolled = false;

    diceValue = 0;

    diceElement.textContent =
        "🎲";

    rollButton.disabled =
        false;

    currentPlayer =
        (currentPlayer + 1) %
        4;

    updateTurn();

    messageElement.textContent =
        "Roll the dice to play.";
}


// ============================================================
// TURN TEXT
// ============================================================

function updateTurn() {

    turnText.textContent =
        `${players[currentPlayer].name}'s Turn`;
}


// ============================================================
// ROLL BUTTON
// ============================================================

if (rollButton) {

    rollButton.addEventListener(
        "click",
        rollDice
    );
}


// ============================================================
// START
// ============================================================

createBoard();

renderTokens();

updateTurn();

messageElement.textContent =
    "Roll the dice to play.";