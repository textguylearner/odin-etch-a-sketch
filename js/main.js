const containerElement = document.querySelector(".container");

let dimensionCount = 16;
let gridSize = 25;
let paletteSize = dimensionCount * gridSize;
containerElement.style.width = paletteSize + 'px';
containerElement.style.height = paletteSize + 'px';

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

let grid = [];

let brushSize = 0;
let brushOpacity = 1;

function drawColor(e) {
    if(!mouseDown) return;
    if(brushSize === 0)
    {
        paintGrid(e.target);
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
                const element = containerElement.querySelector(`[data-pos="${xx},${yy}"]`);
                if(element) paintGrid(element);
            }
        }
    }
}

function paintGrid(e) {
    const currentColor = e.style.backgroundColor;
    if(currentColor === 'rgb(0, 0, 0)') return;
    if(currentColor === '')
    {
        e.style.backgroundColor = `rgba(0,0,0,${brushOpacity})`;
    }
    else
    {
        let opacity = Number(currentColor.split(',')[3].split(')')[0]) + brushOpacity;
        if(opacity > 1) opacity = 1;
        e.style.backgroundColor = `rgba(0,0,0,${opacity}`;
    }
}

for(let y = 0; y < dimensionCount; y++) {
    let row = [];
    for(let x = 0; x < dimensionCount; x++)
    {
        const gridDiv = document.createElement('div');
        gridDiv.classList.add('grid');

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
        gridDiv.addEventListener("mouseover", drawColor);

        gridDiv.setAttribute('data-pos', `${x},${y}`);
        row.push(gridDiv);

        containerElement.appendChild(gridDiv);
    }
    grid.push(row);
}