let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

let grid = [];
let lastHover = [];

const opcaitySlider = document.querySelector('.brush-opacity');
const opcaityText = document.querySelector('.brush-opacity-text');
const sizeSlider = document.querySelector('.brush-size');
const sizeText = document.querySelector('.brush-size-text');

let usingEraser = false;

opcaityText.textContent = 'Brush Opacity: ' + opcaitySlider.value / 10;
sizeText.textContent = 'Brush Size: ' + sizeSlider.value;

let brushSize = sizeSlider.value - 1;
let brushOpacity = opcaitySlider.value / 10;


sizeSlider.oninput = function() {
    brushSize = sizeSlider.value - 1;
    sizeText.textContent = 'Brush Size: ' + this.value;
}

opcaitySlider.oninput = function() {
    brushOpacity = opcaitySlider.value / 10;
    opcaityText.textContent = 'Brush Opacity: ' + (this.value / 10);
}

function drawColor(e) {

    lastHover.forEach(e => {
        e.classList.remove('hovering');
        e.classList.add('nohover'); 
    });

    lastHover = [];

    if(brushSize === 0)
    {
        lastHover.push(e.target);
        if(mouseDown) paintGrid(e.target);
    }
    else
    {
        const pos = e.target.getAttribute('data-pos').split(','); //x,y
        const x = Number(pos[0]);
        const y = Number(pos[1]);

        for(let yy = y - brushSize; yy <= y + brushSize; yy++)
        {
            for(let xx = x - brushSize; xx <= x + brushSize; xx++)
            {
                const element = document.querySelector(`[data-pos="${xx},${yy}"]`);
                if(element) 
                {
                    lastHover.push(element);
                    if(mouseDown) paintGrid(element);
                }
            }
        }
    }

    lastHover.forEach(e => {
        e.classList.remove('nohover');
        e.classList.add('hovering'); 
    });
}

function paintGrid(e) {
    const currentColor = e.style.backgroundColor;
    if(usingEraser)
    {
        e.style.backgroundColor = '';
        return;
    }
    if(currentColor === 'rgb(0, 0, 0)') return;
    if(currentColor === '')
    {
        e.style.backgroundColor = document.querySelector('.color-picker').value;
        //e.style.backgroundColor = `rgba(0,0,0,${brushOpacity})`;
    }
    else
    {
        let opacity = Number(currentColor.split(',')[3].split(')')[0]) + brushOpacity;
        if(opacity > 1) opacity = 1;
        e.style.backgroundColor = `rgba(0,0,0,${opacity}`;
    }
}

function generateGrid(size) {
    if(document.querySelector(".container")) document.querySelector(".container").remove();
    let newContainer = document.createElement("div");
    newContainer.classList.add('container');
    document.querySelector(".canvas").append(newContainer);

    grid = [];

    let dimensionCount = size;
    let gridSize = 400 / dimensionCount;
    let paletteSize = 400;
    newContainer.style.width = paletteSize + 'px';
    newContainer.style.height = paletteSize + 'px';

    for(let y = 0; y < dimensionCount; y++) {
        let row = [];
        for(let x = 0; x < dimensionCount; x++)
        {
            const gridDiv = document.createElement('div');
            gridDiv.classList.add('grid');
            gridDiv.classList.add('nohover');

            const borderWidth = 1;
            const outerBorderWidth = borderWidth * 2;
            topBorder = (y === 0) ? outerBorderWidth : borderWidth;
            rightBorder = (x === dimensionCount - 1) ? outerBorderWidth : borderWidth;
            bottomBorder = (y === dimensionCount - 1) ? outerBorderWidth : borderWidth;
            leftBorder = (x === 0) ? outerBorderWidth : borderWidth;

            gridDiv.style = 
            `width:${gridSize}px; 
            height:${gridSize}px;
            border-top-width: ${topBorder}px;
            border-right-width: ${rightBorder}px;
            border-bottom-width: ${bottomBorder}px;
            border-left-width: ${leftBorder}px;`;

            gridDiv.addEventListener("mousedown", drawColor);
            gridDiv.addEventListener("mouseenter", drawColor);

            gridDiv.setAttribute('data-pos', `${x},${y}`);
            row.push(gridDiv);

            newContainer.appendChild(gridDiv);
        }
        grid.push(row);
    }
}

generateGrid(16);