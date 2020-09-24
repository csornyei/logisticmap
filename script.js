const populationCanvas = document.getElementById('population');
const equilibriumCanvas = document.getElementById('equilibriums');
const populationInput = document.getElementById('startPopulation');
const growthRateInput = document.getElementById('growthRate');
const populationSlider = document.getElementById('populationSlider');
const growthRateSlider = document.getElementById('growthSlider');
const drawButton = document.getElementById('drawButton');
const eqList = document.getElementById('eqList');

let values = [populationInput.value];
let growthRate = 1.8;
let equDots = [];

const eqCtx = equilibriumCanvas.getContext('2d');
const popCtx = populationCanvas.getContext('2d');

const nullValueOnX = 10;
const maxValueOnX = 550;

const nullValueOnY = 375;
const maxVlaueOnY = 30;

reDrawPopulationCanvas();
reDrawEquilibriumCanvas();

function reDrawPopulationCanvas() {
    emptyCanvas(popCtx, populationCanvas);
    drawGraph(popCtx);
    titlesForPopGraph(popCtx);
    for (let i = 0; i <= 100; i += 5) {
        const step = (maxValueOnX - nullValueOnX) / 100;
        numberOnXAxis(i, i * step + nullValueOnX, i % 10 === 0 && i > 0, popCtx);
    }
    for (let i = 0; i <= 1.2; i += .1) {
        const step = (nullValueOnY - maxVlaueOnY) / 1.20;
        numberOnYAxis(i.toFixed(1), nullValueOnY - (i * step), i.toFixed(1) == 1 || i.toFixed(1) == .5, popCtx);
    }

    for (let i = 0; i < 100; i++) {
        values.push(logisticMap(values[i], growthRate));
    }

    values.forEach((val, index) => {
        drawDot(index + 1, val, popCtx);
        if (index < values.length) {
            connectDot(index + 1, val, index + 2, values[index + 1], popCtx);
        }
    });
}

function reDrawEquilibriumCanvas() {
    emptyCanvas(eqCtx, equilibriumCanvas);
    drawGraph(eqCtx);
    titlesForEqGraph(eqCtx);

    for (let i = 0; i <= 4.1; i += 0.1) {
        const step = (maxValueOnX - nullValueOnX) / 4;
        numberOnXAxis(i.toFixed(1), i * step + nullValueOnX, i.toFixed(1) % 1 === 0 && i > 0, eqCtx);
    }
    for (let i = 0; i <= 1.2; i += .1) {
        const step = (nullValueOnY - maxVlaueOnY) / 1.20;
        numberOnYAxis(i.toFixed(1), nullValueOnY - (i * step), i.toFixed(1) == 1 || i.toFixed(1) == .5, eqCtx);
    }
}

function drawGraph(ctx) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(5, 15);
    ctx.lineTo(10, 7);
    ctx.lineTo(15, 15);
    ctx.moveTo(10, 7);
    ctx.lineTo(10, 390);
    ctx.moveTo(5, 375);
    ctx.lineTo(580, 375);
    ctx.moveTo(572, 370);
    ctx.lineTo(580, 375);
    ctx.lineTo(572, 380);
    ctx.stroke()
}

function titlesForPopGraph(ctx) {
    ctx.font = '16px Open Sans';
    ctx.fillStyle = '#fff';
    ctx.fillText('Population', 20, 30);
    ctx.fillText('Generations', 480, 394);
}

function titlesForEqGraph(ctx) {
    ctx.font = '16px Open Sans';
    ctx.fillStyle = '#fff';
    ctx.fillText('Equilibrium', 20, 30);
    ctx.fillText('Growth Rate', 480, 394);
}

function numberOnXAxis(number, xValue, showNumber, ctx) {
    ctx.beginPath();
    ctx.moveTo(xValue, 370);
    ctx.lineTo(xValue, 380);
    ctx.stroke();
    if (showNumber) {
        ctx.font = '12px Open Sans';
        ctx.fillStyle = '#fff';
        ctx.fillText(number, xValue - 5, 367);
    }
}

function numberOnYAxis(number, yValue, showNumber, ctx) {
    ctx.beginPath();

    ctx.moveTo(5, yValue);
    ctx.lineTo(15, yValue);
    ctx.stroke();
    if (showNumber) {
        ctx.font = '12px Open Sans';
        ctx.fillStyle = '#fff';
        ctx.fillText(number, 20, yValue + 5);
    }
}

function logisticMap(previousValue, growthRate) {
    return (growthRate * previousValue * (1 - previousValue));
}

function drawDot(x, y, ctx, stepX = 100, stepY = 1.2) {
    if (x < 0 || x > 110) {
        console.log(x);
        throw new Error('Point out of range on x-axis');
    }
    if (y < -0.01 || y > 1.22) {
        console.log(y);
        throw new Error('Point out of range on y-axis');
    }

    const xValue = getXCoord(x, stepX);
    const yValue = getYCoord(y, stepY);
    ctx.beginPath();
    ctx.arc(xValue, yValue, 2, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = '#2F2FA2'
    ctx.fill();
}

function connectDot(thisDotX, thisDotY, nextDotX, nextDotY, ctx) {
    const thisXValue = getXCoord(thisDotX);
    const thisYValue = getYCoord(thisDotY);
    const nextXValue = getXCoord(nextDotX);
    const nextYValue = getYCoord(nextDotY);
    ctx.beginPath();
    ctx.strokeStyle = "#F64C72";
    ctx.lineWidth = 1;
    ctx.moveTo(thisXValue, thisYValue);
    ctx.lineTo(nextXValue, nextYValue);
    ctx.stroke();
}

function emptyCanvas(ctx, canvas) {
    ctx.fillStyle = '#553D67';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function onPopulationChange(event) {
    const newValue = event.target.value
    populationInput.value = newValue;
    populationSlider.value = newValue;
    values = [newValue];
    reDrawPopulationCanvas();
}

function onGrowthRateChange(event) {
    const newValue = event.target.value
    growthRateInput.value = newValue;
    growthRateSlider.value = newValue;
    growthRate = newValue;
    values = [populationInput.value];
    reDrawPopulationCanvas();
}

function onDrawEquilibrium() {
    growthRate = 0.01;
    const interval = setInterval(() => {
        if (growthRate < 3.999) {
            if (growthRate < 3.3) {
                onGrowthRateChange({
                    target: {
                        value: growthRate + 0.01
                    }
                });
            } else {
                onGrowthRateChange({
                    target: {
                        value: growthRate + 0.005
                    }
                });
            }
            const equilibriums = getEquilibrium(values);
            equilibriums.forEach(val => {
                drawDot(growthRate, val, eqCtx, 4, 1.2);
            })
        } else {
            clearInterval(interval);
        }
    }, 25);
}

function getXCoord(xValue, step = 100) {
    return nullValueOnX + ((maxValueOnX - nullValueOnX) / step) * xValue
}

function getYCoord(yValue, step = 1.2) {
    return nullValueOnY - ((nullValueOnY - maxVlaueOnY) / step) * yValue;
}

function getEquilibrium(valuesArray) {
    const biggers = [];
    const smallers = [];
    const goodies = [];
    const mean = getMean(valuesArray);
    valuesArray.forEach(val => {
        val = parseFloat(val);
        if (val > mean + 0.001) {
            biggers.push(val);
        } else if (val < mean - 0.001) {
            smallers.push(val)
        } else {
            goodies.push(val);
        }
    });
    const returnValue = [];
    if (goodies.length > 1) {
        returnValue.push(mean);
    }
    if (biggers.length > 1) {
        const biggersEq = getEquilibrium(biggers);
        biggersEq.forEach(val => {
            returnValue.push(val)
        });
    }
    if (smallers.length > 1) {
        const smallersEq = getEquilibrium(smallers);
        smallersEq.forEach(val => {
            returnValue.push(val)
        })
    }


    return returnValue;
}

function getMean(array) {
    const sum = array.reduce((acc, val) => {
        val = parseFloat(val);
        acc = parseFloat(acc);
        return acc + val
    });
    return sum / array.length;
}

populationInput.onchange = (event) => {
    onPopulationChange(event);
}

populationSlider.oninput = (event) => {
    onPopulationChange(event);
}

growthRateInput.onchange = (event) => {
    onGrowthRateChange(event);
}

growthRateSlider.oninput = (event) => {
    onGrowthRateChange(event);
}

drawButton.onclick = () => {
    reDrawEquilibriumCanvas();
    onDrawEquilibrium();
}