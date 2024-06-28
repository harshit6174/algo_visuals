let count = 0;
const slides = document.querySelectorAll('.tutorial .slide');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const skipBtn = document.querySelector('#skip');
const tutorial = document.querySelector('#tutorial');
const tutorialToggle = document.querySelector('.tutorial-toggle');

const visited = localStorage.getItem('visited');
if (!visited) {
    tutorial.classList.add('active');
    localStorage.setItem('visited', 'true');
}

tutorial.addEventListener('click', (e) => {
    if (e.target.classList.contains('tutorial')) {
        skipBtn.style.animation = ".2s shake 2 ease-in-out";
        setTimeout(() => {
            skipBtn.style.animation = "none";
        }, 1000);
    }
})
tutorialToggle.addEventListener('click', () => {
    tutorial.classList.add('active');
    count = 0;
    nextBtn.innerText = "next";
    prevBtn.classList.add('unactive');
    moveSlides(count);
})
skipBtn.addEventListener('click', () => {
    tutorial.classList.remove('active');
});


slides.forEach((slide, index) => {
    slide.style.left = `${100 * index}%`;
});


nextBtn.addEventListener('click', () => {
    if (count == slides.length - 1) {
        tutorial.classList.remove('active');
        return;
    }
    count++;
    if (count == slides.length - 1) {
        nextBtn.innerText = "finish";
    }
    moveSlides(count);
    prevBtn.classList.remove('unactive');
});

prevBtn.addEventListener('click', () => {
    if (count == 0) {
        return;
    }
    nextBtn.innerText = "next";
    count--;
    if (count == 0) {
        prevBtn.classList.add('unactive');
    }
    moveSlides(count);
});

const dot = document.querySelector(".dots");
for (let i = 0; i < slides.length; i++) {
    dot.innerHTML += `<div class="dot ${i === 0 ? "active" : ""}"></div>`
}
const dots = document.querySelectorAll(".dot");

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        count = i;
        if (count == 0) {
            prevBtn.classList.add('unactive');
        }
        else if (count == slides.length - 1) {
            nextBtn.innerText = "finish";
        }
        else {
            prevBtn.classList.remove('unactive');
            nextBtn.innerText = "next";
        }
        moveSlides(count);
    })
})

function moveSlides(count) {
    dots.forEach(dot => {
        dot.classList.remove('active');
    })

    dots[count].classList.add('active');

    slides.forEach((slide) => {
        slide.style.transform = `translateX(${-count * 100}%)`;
    });
}




const board = document.querySelector('#board');
let matrix;
let row;
let col;
let width = 22;
var cells = [];

const pixels = document.querySelectorAll('#pixel .drop-menu a');
pixels.forEach((pixel) => {
    pixel.addEventListener('click', () => {
        width = pixel.innerText.replace('px', '');
        const cells = document.querySelectorAll('.col');
        cells.forEach(cell => {
            document.documentElement.style.setProperty('--cell-width', `${width}px`);
        })

        renderMap();
        source = set('source');
        target = set('target');
    });
});

function renderMap() {
    matrix = [];
    col = parseInt(board.clientWidth / width);
    row = parseInt(board.clientHeight / width);
    if(window.innerWidth <= 662){
        row -= 1;
    }

    board.innerHTML = '';
    for (let i = 0; i < row; i++) {
        const rowElement = document.createElement('div');
        rowElement.setAttribute('id', `row-${i}`);
        rowElement.classList.add('row');
        let colList = [];
        for (let j = 0; j < col; j++) {
            const colElement = document.createElement('div');
            colElement.classList.add('col', 'unvisited');
            colElement.setAttribute('id', `${i}-${j}`);
            rowElement.appendChild(colElement);

            colList.push(colElement);
        }
        board.appendChild(rowElement);
        matrix.push(colList);
    }
    cells = document.querySelectorAll('.col');
    boardInteration(cells);
}

renderMap();

function isValid(x, y) {
    return (x >= 0 && y >= 0 && x < row && y < col);
}

function set(className, x = -1, y = -1) {
    if (isValid(x, y)) {
        matrix[x][y].classList.add(className);
    }
    else {
        x = Math.floor(Math.random() * row);
        y = Math.floor(Math.random() * col);
        matrix[x][y].classList.add(className);
    }
    return { x, y };
}

let source = set('source');
let target = set('target');



const clearNavOption = () => {
    navOptions.forEach((option) => {
        option.classList.remove('active');
    })
}
const clearDropMenu = () => {

    document.querySelectorAll('.drop-menu').forEach((menu) => {
        menu.classList.remove('active');
    })
}


const navOptions = document.querySelectorAll('.nav-menu>li>a');



navOptions.forEach((option) => {
    option.addEventListener('click', () => {
        
        if (option.classList.contains('drop-toggle') && option.classList.contains('active')) {
            option.classList.remove('active');
            clearDropMenu();
            return;
        }
        clearNavOption();
        clearDropMenu();


        option.classList.add('active');

        if (option.classList.contains('drop-toggle')) {
            const dropMenu = option.nextElementSibling;
            dropMenu.classList.add('active');
        }
    })
})

document.addEventListener('click', (event) => {
    if (!document.querySelector('.nav-menu').contains(event.target)) {
        clearNavOption();
        clearDropMenu();
    }
})


const dropMenus = document.querySelectorAll('.drop-menu');
const dropOptions = document.querySelectorAll('.drop-menu a');

const clearDropOption = () => {
    document.querySelectorAll('.drop-menu.active a').forEach(option => {
        option.classList.remove('active');
    })
}

var algorithm = '';
dropOptions.forEach((option) => {
    option.addEventListener('click', () => {
        
        clearDropOption();
        clearDropMenu();
        clearNavOption();

        
        option.classList.add('active');

        if (document.querySelector('#algo').contains(option)) {
            let text = option.innerText;
            algorithm = text.split(' ')[0];
            visualizeBtn.innerText = `Visualize ${algorithm}`;
        }
    })
})


const guide = document.querySelector('.guide');
const guideToggle = document.querySelector('.guide-toggle');
guideToggle.addEventListener('click', () => {
    guide.classList.toggle('active');
})

document.addEventListener('click', (e) => {
    if (!guideToggle.contains(e.target))
        guide.classList.remove('active');

})


function boardInteration(cells) {
    let draging = false;
    let drawing = false;
    let dragStart = null;
    cells.forEach((cell) => {
        const pointDown = (e) => {
            if (e.target.classList.contains('source')) {
                dragStart = 'source';
                draging = true;
            }
            else if (e.target.classList.contains('target')) {
                dragStart = 'target';
                draging = true;
            }
            else {
                drawing = true;
            }
        }

        const pointUp = () => {
            drawing = false;
            draging = false;
            dragStart = null;
            matrix[source.x][source.y].classList.remove('wall');
            matrix[target.x][target.y].classList.remove('wall');
        }

        const pointMove = (e) => {
            const triggerElement = document.elementFromPoint(e.clientX, e.clientY);
            if (triggerElement == null || !triggerElement.classList.contains('col')) return;
            cordinate = { ...triggerElement.id.split('-') };

            if (draging && dragStart) {

                cells.forEach(cell => {
                    cell.classList.remove(dragStart);
                })
                triggerElement.classList.add(dragStart);

                if (dragStart === 'source') {
                    source.x = Number(cordinate[0]);
                    source.y = Number(cordinate[1]);
                }
                else {
                    target.x = Number(cordinate[0]);
                    target.y = Number(cordinate[1]);
                }
            }


            else if (drawing) {
                if (triggerElement.classList.contains('source') || triggerElement.classList.contains('target'))
                    return;

                const x = Number(cordinate[0]);
                const y = Number(cordinate[1]);

                matrix[x][y].setAttribute('class', 'col wall');
            }


        }

        cell.addEventListener('pointerdown', pointDown);
        cell.addEventListener('pointermove', pointMove);
        cell.addEventListener('pointerup', pointUp);

        cell.addEventListener('click', () => {
            if (cell.classList.contains('source') || cell.classList.contains('target'))
                return;

            cell.classList.remove('visited', 'path');
            cell.classList.toggle('wall');
        })
    })

}


const visualizeBtn = document.getElementById('visualize');
const clearPathBtn = document.querySelector('#clear-path');
const clearBoardBtn = document.querySelector('#clear-board');
const generateMazeBtn = document.querySelector('#generate-maze');
const speedOptions = document.querySelectorAll('#speed .drop-menu a');

var delay = 7;
speedOptions.forEach((option) => {
    option.addEventListener('click', () => {
        let pickedSpeed = option.innerText;
        if (pickedSpeed === 'Fast') delay = 4;
        else if (pickedSpeed === 'normal') delay = 7;
        else delay = 15;
    })
})

if(window.innerWidth <= 662){
    delay += 5;
}





const clearPath = () => {
    cells.forEach((cell) => {
        cell.classList.remove('visited', 'path');
    })
}
const clearBoard = () => {
    clearPath();
    cells.forEach((cell) => {
        cell.classList.remove('wall');
    })
}


clearPathBtn.addEventListener('click', clearPath);
clearBoardBtn.addEventListener('click', clearBoard);
let wallToAnimate;
generateMazeBtn.addEventListener('click', () => {
    clearBoard();
    wallToAnimate = [];

    recursiveDivisionMaze(0, row - 1, 0, col - 1, 'horizontal', false);
    animate(wallToAnimate, 'wall');
});


let searchToAnimate;
let pathToAnimate;
visualizeBtn.addEventListener('click', () => {
    clearPath();
    searchToAnimate = [];
    pathToAnimate = [];
    switch (algorithm) {
        
        case 'BFS': BFS(); break;
        case 'Greedy': greedy(); break;
        case 'Dijkstra\'s': Dijkstra(); break;
        case 'A*': Astar(); break;
        case 'DFS':dfs(); break;
        default: break;
    }

    animate(searchToAnimate, 'visited');
});

function animate(list, className) {
    for (let i = 0; i < list.length; i++) {
        setTimeout(() => {
            if (className === 'wall')
                list[i].setAttribute('class', `col ${className}`);
            else
                list[i].classList.add(className);

        
            if(className == 'visited' && i == list.length-1){
                animate(pathToAnimate, 'path');
            }
        }, (className === 'path') ? i * (delay + 20) : i * delay);
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   







let startTime;
let endTime;
const infoBox = document.getElementById('info-box');
const durationElement = document.getElementById('duration-value');
const pathLengthElement = document.getElementById('path-length-value');

function updateInfoBox(duration, pathLength) {
    durationElement.innerText = duration;
    pathLengthElement.innerText = pathLength;
    infoBox.classList.remove('hidden');
    infoBox.style.display = 'block';
}

function generatePath(parents, target) {
    let length = 0;
    while (target) {
        pathToAnimate.push(matrix[target.x][target.y]);
        length++;
        if (target == source) return length;
        target = parents.get(`${target.x}-${target.y}`);
    }
    return length;
}

function BFS() {
    const queue = [];
    const visited = new Set();
    const parent = new Map();
    queue.push(source);
    visited.add(`${source.x}-${source.y}`);
    startTime = performance.now();

    while (queue.length > 0) {
        const current = queue.shift();

        if (current.x === target.x && current.y === target.y) {
            endTime = performance.now();
            const pathLength = generatePath(parent, target);
            updateInfoBox((endTime - startTime).toFixed(2), pathLength);
            return;
        }
        searchToAnimate.push(matrix[current.x][current.y]);

        const neighbours = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key)) {
                visited.add(key);
                queue.push(neighbour);
                parent.set(key, current);
            }
        }
    }

    endTime = performance.now();
    updateInfoBox((endTime - startTime).toFixed(2), "No path possible");
}

function Dijkstra() {
    const distances = new Map();
    const parent = new Map();
    const visited = new Set();

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const key = `${i}-${j}`;
            distances.set(key, Infinity);
        }
    }

    distances.set(`${source.x}-${source.y}`, 0);
    startTime = performance.now();

    while (true) {
        let current;
        let minDistance = Infinity;

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                const key = `${i}-${j}`;
                if (!visited.has(key) && distances.get(key) < minDistance) {
                    minDistance = distances.get(key);
                    current = { x: i, y: j };
                }
            }
        }

        if (!current) break;

        visited.add(`${current.x}-${current.y}`);

        if (current.x === target.x && current.y === target.y) {
            endTime = performance.now();
            const pathLength = generatePath(parent, target);
            updateInfoBox((endTime - startTime).toFixed(2), pathLength);
            return;
        }

        searchToAnimate.push(matrix[current.x][current.y]);
        const neighbours = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall')) {
                const alt = distances.get(`${current.x}-${current.y}`) + 1;
                if (alt < distances.get(key)) {
                    distances.set(key, alt);
                    parent.set(key, current);
                }
            }
        }
    }

    endTime = performance.now();
    updateInfoBox((endTime - startTime).toFixed(2), "No path possible");
}

function Astar() {
    const openSet = [`${source.x}-${source.y}`];
    const closedSet = new Set();
    const gScore = new Map();
    const fScore = new Map();
    const parent = new Map();

    gScore.set(`${source.x}-${source.y}`, 0);
    fScore.set(`${source.x}-${source.y}`, heuristic(source, target));

    function heuristic(node, target) {
        return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
    }

    startTime = performance.now();

    while (openSet.length > 0) {
        let current;
        let minFScore = Infinity;

        for (const key of openSet) {
            const f = fScore.get(key);
            if (f < minFScore) {
                minFScore = f;
                current = key.split('-').map(Number);
            }
        }

        const [currentX, currentY] = current;

        if (currentX === target.x && currentY === target.y) {
            endTime = performance.now();
            const pathLength = generatePath(parent, target);
            updateInfoBox((endTime - startTime).toFixed(2), pathLength);
            return;
        }

        openSet.splice(openSet.indexOf(`${currentX}-${currentY}`), 1);
        closedSet.add(`${currentX}-${currentY}`);

        searchToAnimate.push(matrix[currentX][currentY]);

        const neighbours = [
            { x: currentX + 1, y: currentY },
            { x: currentX - 1, y: currentY },
            { x: currentX, y: currentY + 1 },
            { x: currentX, y: currentY - 1 }
        ];

        for (const neighbour of neighbours) {
            const { x, y } = neighbour;
            const key = `${x}-${y}`;
            if (isValid(x, y) &&
                !matrix[x][y].classList.contains('wall') &&
                !closedSet.has(key)) {
                const tentativeGScore = gScore.get(`${currentX}-${currentY}`) + 1;
                if (!openSet.includes(key)) {
                    openSet.push(key);
                } else if (tentativeGScore >= gScore.get(key)) {
                    continue;
                }

                parent.set(key, { x: currentX, y: currentY });
                gScore.set(key, tentativeGScore);
                fScore.set(key, gScore.get(key) + heuristic(neighbour, target));
            }
        }
    }

    endTime = performance.now();
    updateInfoBox((endTime - startTime).toFixed(2), "No path possible");
}

function greedy() {
    const priorityQueue = new PriorityQueue();
    const visited = new Set();
    const parent = new Map();
    const queued = new Set();

    priorityQueue.enqueue(source, 0);
    queued.add(`${source.x}-${source.y}`);

    function heuristic(node, target) {
        return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
    }

    startTime = performance.now();

    while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.dequeue();
        const { x, y } = current;
        queued.delete(`${x}-${y}`);

        if (x === target.x && y === target.y) {
            endTime = performance.now();
            const pathLength = generatePath(parent, target);
            updateInfoBox((endTime - startTime).toFixed(2), pathLength);
            return;
        }

        visited.add(`${x}-${y}`);

        searchToAnimate.push(matrix[x][y]);

        const neighbours = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key) &&
                !queued.has(key)) {
                priorityQueue.enqueue(neighbour, heuristic(neighbour, target));
                parent.set(key, { x, y });
                queued.add(key);
            }
        }
    }

    endTime = performance.now();
    updateInfoBox((endTime - startTime).toFixed(2), "No path possible");
}

function dfs() {
    const stack = [];
    const visited = new Set();
    const parent = new Map();

    stack.push(source);
    visited.add(`${source.x}-${source.y}`);
    startTime = performance.now();

    while (stack.length > 0) {
        const current = stack.pop();

        if (current.x === target.x && current.y === target.y) {
            endTime = performance.now();
            const pathLength = generatePath(parent, target);
            updateInfoBox((endTime - startTime).toFixed(2), pathLength);
            return;
        }
        searchToAnimate.push(matrix[current.x][current.y]);

        const neighbours = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];

        for (const neighbour of neighbours) {
            const key = `${neighbour.x}-${neighbour.y}`;
            if (isValid(neighbour.x, neighbour.y) &&
                !matrix[neighbour.x][neighbour.y].classList.contains('wall') &&
                !visited.has(key)) {
                visited.add(key);
                stack.push(neighbour);
                parent.set(key, current);
            }
        }
    }

    endTime = performance.now();
    updateInfoBox((endTime - startTime).toFixed(2), "No path possible");
}



class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.sort();
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    sort() {
        this.elements.sort((a, b) => a.priority - b.priority);
    }
}



function recursiveDivisionMaze(rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }

    if (!surroundingWalls) {
        
        for (let i = 0; i < col; i++) {
            if (matrix[0][i].classList.contains('source') || matrix[0][i].classList.contains('target'))
                continue;

            wallToAnimate.push(matrix[0][i]);

            if (matrix[row - 1][i].classList.contains('source') || matrix[row - 1][i].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[row - 1][i]);
        }

        
        for (let i = 0; i < row; i++) {
            if (matrix[i][0].classList.contains('source') || matrix[i][0].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[i][0]);

            if (matrix[i][col - 1].classList.contains('source') || matrix[i][0].classList.contains('target'))
                continue;
            wallToAnimate.push(matrix[i][col - 1]);
        }
        surroundingWalls = true;
    }

   
    if (orientation === "horizontal") {
        let possibleRows = [];
        for (let i = rowStart; i <= rowEnd; i += 2) {
            if (i == 0 || i == row - 1) continue;
            possibleRows.push(i);
        }
        let possibleCols = [];
        for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
            if (i <= 0 || i >= col - 1) continue;
            possibleCols.push(i);
        }

        let currentRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        let colRandom = possibleCols[Math.floor(Math.random() * possibleCols.length)];

        
        for (i = colStart - 1; i <= colEnd + 1; i++) {
            const cell = matrix[currentRow][i];
            if (!cell || i === colRandom || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;

            wallToAnimate.push(cell)
        }


        if (currentRow - 2 - rowStart > colEnd - colStart) {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls);
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls);
        } else {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
        }
    }


    else if (orientation === 'vertical') {
        let possibleCols = [];
        for (let i = colStart; i <= colEnd; i += 2) {
            possibleCols.push(i);
        }
        let possibleRows = [];
        for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
            if (i <= 0 || i >= row - 1) continue;
            possibleRows.push(i);
        }

        let currentCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        let rowRandom = possibleRows[Math.floor(Math.random() * possibleRows.length)];

        
        for (i = rowStart - 1; i <= rowEnd + 1; i++) {
            if (!matrix[i]) continue;

            const cell = matrix[i][currentCol];
            if (i === rowRandom || cell.classList.contains('source') || cell.classList.contains('target'))
                continue;
            wallToAnimate.push(cell)
        }

        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
        }
    }
};
