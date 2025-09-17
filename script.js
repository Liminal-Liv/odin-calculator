let operatorState = null;
let storedNumber = null;
let currentNumber = '0';
let awaitingNextNumber = false;

function updateDisplay(value) {
    const displayElement = document.querySelector('.display');
    if (displayElement) {
        displayElement.value = value;
    }
}

// basic arithmetic functions
function add(numA, numB) {
    return numA + numB;
}

function subtract(numA, numB) {
    return numA - numB;
}

function multiply(numA, numB) {
    return numA * numB;
}

function divide(numA, numB) {
    return numB === 0 ? 'undefined' : numA / numB;
}

function operate(operator, numA, numB) {
    switch (operator) {
        case '+':
            return add(numA, numB);
        case '-':
            return subtract(numA, numB);
        case 'x':
            return multiply(numA, numB);
        case '÷':
            return divide(numA, numB);
        default:
            return numB;
    }
}

function handleButtonClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== 'BUTTON') {
        return; // ignores clicks on non-button elements
    }

    const buttonValue = clickedElement.textContent;

    if (!isNaN(parseFloat(buttonValue)) || buttonValue === '.') {
        handleNumber(buttonValue);
    } else if (buttonValue === '+' || buttonValue === '-' || buttonValue === 'x' || buttonValue === '÷') {
        handleOperator(buttonValue);
    } else if (buttonValue === '=') {
        handleEquals();
    } else if (buttonValue === 'A/C') {
        clear();
    }
}

function handleNumber(buttonValue) {
    if (awaitingNextNumber) {
        currentNumber = buttonValue;
        awaitingNextNumber = false;
    } else if (currentNumber === '0' && buttonValue !== '.') {
        currentNumber = buttonValue;}
     else {
        currentNumber += buttonValue;
    }
    updateDisplay(currentNumber);
}

function handleOperator(operator) {
    // check to see if we already have an operator, calculate result first if so
    if (operatorState && !awaitingNextNumber) {
        const result = operate(operatorState, parseFloat(storedNumber), parseFloat(currentNumber));
        currentNumber = result.toString();
    } 
        storedNumber = currentNumber;
        operatorState = operator;
        awaitingNextNumber = true;
        updateDisplay(currentNumber);
}

function handleEquals() {
    if (storedNumber !== null && operatorState !== null) {
        const result = operate(operatorState, parseFloat(storedNumber), parseFloat(currentNumber));
        currentNumber = result.toString();
        storedNumber = null;
        operatorState = null;
        awaitingNextNumber = true;
        updateDisplay(currentNumber);
    }
}

function clear() {
    operatorState = null;
    currentNumber = '0';
    storedNumber = null;
    awaitingNextNumber = false;
    updateDisplay('0');
}

const calculatorContainer = document.querySelector('.calculator-background');
calculatorContainer.addEventListener('click', handleButtonClick);

// fix: only allow one . per number
// change the gap between buttons and padding on calculator
// change operations to arrow functions
// round display to max number

// const buttonValue = clickedElement.textContent





// updateDisplay()? (or alternatively just an event listener on each button with an anonymous function)
//     the operators will update the state but not display
//     only numbers will be added to display

//  (don't clear last operation. allow user to spam = to repeat last operation)





/*                         IDEAS                         */

// css style to highlight operation you're currently using
// turn handlebuttonclick into a switch statement and substitute a variable for the first if check conditional