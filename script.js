window.addEventListener("load", function () {
    main();
    return;
});

function main() {
    setHandler();
    taInput = document.querySelector("#input");
    taDisplay = document.querySelector("#display");
    taDirs = document.querySelector("#dirs");
    return;
}

const HANDLERS = [
    btnHandlerStart,
    btnHandlerSet,
    btnHandlerStep,
];

var taInput;
var taDisplay;
var taDirs;

function setHandler() {
    for (const handler of HANDLERS) {
        let id = handler.name;
        id = id.replace("Handler", "");
        let ctrl = document.querySelector(`#${id}`);

        if (ctrl != null) {
            ctrl.addEventListener("click", handler);
        }
    }

    return;
}

const DIRS = [
    "U",
    "D",
    "L",
    "R",
];
var dataIn;
var indexLine;
var indexDir;
var foods;
var snake;
var isImportDir;
var count;

function btnHandlerStep(params) {
    let dir;

    if (!isImportDir) {
        dir = DIRS[Math.floor(Math.random() * 4)];
    } else {
        dir = taDirs.value[indexDir];
        indexDir++;
    }

    updateBoard2(dir);

    if (!isImportDir) {
        taDirs.value += dir;
    }

    return;
}

function btnHandlerSet(params) {
    common();
    return;
}

function btnHandlerStart(params) {
    common();

    for (let index = 0; index < count; index++) {
        let dir;

        if (!isImportDir) {
            dir = DIRS[Math.floor(Math.random() * 4)];
        } else {
            dir = taDirs.value[indexDir];
            indexDir++;
        }

        console.log(index, dir);
        updateBoard2(dir);

        if (!isImportDir) {
            taDirs.value += dir;
        }
    }

    return;
}

function common() {
    count = document.querySelector("#count").value;

    if ((taDirs.value == "") && (count == "")) {
        alert("count is empty");
        return;
    }

    isImportDir = false;

    if (taDirs.value != "") {
        isImportDir = true;
        count = taDirs.value.length;
    } else {
        taDirs.value = "";
    }

    dataIn = {
        "n_board": null,
        "m_mondai": null,
        "c_color_count": null,
        "d_draw": [],
        "f_food": [],
    };
    indexLine = 0;
    indexDir = 0;

    let lines = taInput.value.split("\n");
    let tmp = lines[indexLine].split(" ");
    dataIn.n_board = Number(tmp[0]);
    dataIn.m_mondai = Number(tmp[1]);
    dataIn.c_color_count = Number(tmp[2]);
    indexLine++;
    dataIn.d_draw = lines[indexLine].split(" ");
    indexLine++;

    for (let offset = 0; offset < dataIn.n_board; offset++) {
        let tmp = lines[indexLine + offset].split(" ");
        dataIn.f_food.push(tmp);
    }

    foods = JSON.parse(JSON.stringify(dataIn.f_food));
    snake = [
        { pstX: 0, pstY: 4, food: 1 },
        { pstX: 0, pstY: 3, food: 1 },
        { pstX: 0, pstY: 2, food: 1 },
        { pstX: 0, pstY: 1, food: 1 },
        { pstX: 0, pstY: 0, food: 1 },
    ];

    for (const element of snake) {
        foods[element.pstY][element.pstX] = 0;
    }

    return;
}

function updateBoard2(dir) {
    //###
    let indexSnakeCut = updateSnake(dir);
    drawBoard(indexSnakeCut);
    return;
}

function updateSnake(dir) {
    if (!DIRS.includes(dir)) {
        return;
    }

    let rtn;

    switch (dir) {
        case "U": {
            if (snake[0].pstY - 1 < 0) {
                document.querySelector("#status").value = "LIMIT UP";
                return;
            }

            if (snake[0].pstY - 1 == snake[1].pstY) {
                document.querySelector("#status").value = "RETURN";
                return;
            }

            snake.unshift({
                pstX: snake[0].pstX,
                pstY: snake[0].pstY - 1,
                food: 1,
            });
            break;
        }
        case "D": {
            if (snake[0].pstY + 1 >= dataIn.n_board) {
                document.querySelector("#status").value = "LIMIT DOWN";
                return;
            }

            if (snake[0].pstY + 1 == snake[1].pstY) {
                document.querySelector("#status").value = "RETURN";
                return;
            }

            snake.unshift({
                pstX: snake[0].pstX,
                pstY: snake[0].pstY + 1,
                food: 1,
            });
            break;
        }
        case "L": {
            if (snake[0].pstX - 1 < 0) {
                document.querySelector("#status").value = "LIMIT LEFT";
                return;
            }

            if (snake[0].pstX - 1 == snake[1].pstX) {
                document.querySelector("#status").value = "RETURN";
                return;
            }

            snake.unshift({
                pstX: snake[0].pstX - 1,
                pstY: snake[0].pstY,
                food: 1,
            });
            break;
        }
        case "R": {
            if (snake[0].pstX + 1 >= dataIn.n_board) {
                document.querySelector("#status").value = "LIMIT RIGHT";
                return;
            }

            if (snake[0].pstX + 1 == snake[1].pstX) {
                document.querySelector("#status").value = "RETURN";
                return;
            }

            snake.unshift({
                pstX: snake[0].pstX + 1,
                pstY: snake[0].pstY,
                food: 1,
            });
            break;
        }
        default:
            break;
    }

    for (let indexSnake = 1; indexSnake < snake.length; indexSnake++) {
        snake[indexSnake - 1].food = snake[indexSnake].food;
    }

    let pstLast = snake.pop();

    for (let indexSnake = 1; indexSnake < snake.length - 1; indexSnake++) {
        const element = snake[indexSnake];

        if ((element.pstX == snake[0].pstX) && (element.pstY == snake[0].pstY)) {
            rtn = indexSnake;
            break;
        }
    }

    if (rtn != undefined) {
        return rtn;
    }

    let foodNew = foods[snake[0].pstY][snake[0].pstX];

    if (foodNew != 0) {
        pstLast.food = foodNew;
        foods[snake[0].pstY][snake[0].pstX] = 0;
        snake.push(pstLast);
    }

    return;
}

function drawBoard(indexSnakeCut) {
    let board = [];

    for (let pstY = 0; pstY < dataIn.n_board; pstY++) {
        let tmp = [];

        for (let pstX = 0; pstX < dataIn.n_board; pstX++) {
            let food = "-";

            if (foods[pstY][pstX] != 0) {
                food = foods[pstY][pstX];
            }

            tmp.push({
                foods: [food],
                isSnake: false,
            });
        }

        board.push(tmp);
    }

    for (const element of snake) {
        board[element.pstY][element.pstX].foods = [];
    }

    for (let indexSnake = 0; indexSnake < snake.length; indexSnake++) {
        const element = snake[indexSnake];
        board[element.pstY][element.pstX].foods.push(element.food);
        board[element.pstY][element.pstX].isSnake = true;

        if ((indexSnakeCut != undefined) && (indexSnake > indexSnakeCut)) {
            board[element.pstY][element.pstX].isSnake = false;
            foods[element.pstY][element.pstX] = element.food;
        }
    }

    if (indexSnakeCut != undefined) {
        snake = snake.slice(0, indexSnakeCut + 1);
    }

    let string = "";

    for (let pstY = 0; pstY < dataIn.n_board; pstY++) {
        let tmp = board[pstY].map(
            (value, index, array) => {
                let string = "";

                if (value.isSnake) {
                    string += "*";
                }

                for (const element of value.foods) {
                    string += `${element}`;
                }

                string += "   ";
                string = string.substring(0, 3);
                return string;
            }
        )
        string += tmp.join(" ") + "\n";
    }

    taDisplay.value = string;
    return;
}

