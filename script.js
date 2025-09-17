let operatorState = null;
let storedNumber = null;
let currentNumber = '0';
let awaitingNextNumber = false;

function updateDisplay(value) {
    const displayElement = document.querySelector('.display');
    if (displayElement) {
        // only shortens calculations (numbers)
        if (typeof value === 'number') {
            displayElement.value = limitNumberDigits(value, 12);
        } else {
            displayElement.value = value;
        }
    }
}

function limitNumberDigits(num, maxlength) {
    // Convert number to string for length check
    const numString = String(num);
    if (numString.length > maxlength) {
      // If it's a floating-point number, use toPrecision
      if (numString.includes('.')) {
        return +num.toPrecision(maxlength);
      }
      // If it's a large integer, handle appropriately (e.g., show in scientific notation)
      return num.toExponential(maxlength - 5);
    }
    return num;
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
        currentNumber = (buttonValue === '.') ? '0.' : buttonValue;
        awaitingNextNumber = false;
        updateDisplay(currentNumber);
        return;
    } if (buttonValue === '.' && currentNumber.includes('.')) {
        return;
    } if (currentNumber === '0' && buttonValue !== '.') {
        currentNumber = buttonValue;
    } else {
        currentNumber += buttonValue;
    }

    updateDisplay(currentNumber);
}

function handleOperator(operator) {
    // If a previous operation is pending, calculate it first. (allows chaining operations without using equals)
    if (operatorState && !awaitingNextNumber) {
        const result = operate(operatorState, parseFloat(storedNumber), parseFloat(currentNumber));
        const formattedResult = limitNumberDigits(result, 12);
        storedNumber = formattedResult;
        updateDisplay(formattedResult);
    } else {
        // for starting our first calculation when operatorState = null
        storedNumber = parseFloat(currentNumber);
    }

        operatorState = operator;
        awaitingNextNumber = true;
}

function handleEquals() {
    if (storedNumber !== null && operatorState !== null) {
        const result = operate(operatorState, parseFloat(storedNumber), parseFloat(currentNumber));
        const formattedResult = limitNumberDigits(result, 12);
        updateDisplay(formattedResult);

        currentNumber = formattedResult.toString();
        storedNumber = null;
        operatorState = null;
        awaitingNextNumber = true;
    }
}

function clear() {
    operatorState = null;
    currentNumber = 0;
    storedNumber = null;
    awaitingNextNumber = false;
    updateDisplay('0');
}

const calculatorContainer = document.querySelector('.calculator-background');
calculatorContainer.addEventListener('click', handleButtonClick);