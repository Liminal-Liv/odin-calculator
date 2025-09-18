const calculator = {
    operatorState: null,
    storedNumber: null,
    currentNumber: '0',
    awaitingNextNumber: false,

    updateDisplay(value) {
        const displayElement = document.querySelector('.display');
        if (displayElement) {
            displayElement.value = this.limitNumberDigits(value, 12);
            }
    },

    limitNumberDigits(num, maxlength) {
        const numString = String(num);
        if (numString.length > maxlength) {
            // Use toPrecision for decimal numbers, toExponential for very large numbers
            return numString.includes('.') ? +num.toPrecision(maxlength) : num.toExponential(maxlength - 5);
        }
        return num;
    },

    handleNumber(buttonValue) {
        if (this.awaitingNextNumber) {
            this.currentNumber = (buttonValue === '.') ? '0.' : buttonValue;
            this.awaitingNextNumber = false;
            return;
        } if (buttonValue === '.' && this.currentNumber.includes('.')) {
            return;
        } if (this.currentNumber === '0' && buttonValue !== '.') {
            this.currentNumber = buttonValue;
        } else {
            this.currentNumber += buttonValue;
        }
    },

    handleOperator(operator) {
        // If a previous operation is pending, calculate it first. (allows chaining operations without using equals)
        if (this.operatorState && !this.awaitingNextNumber) {
            const result = this.operate(this.operatorState, parseFloat(this.storedNumber), parseFloat(this.currentNumber));
            const formattedResult = this.limitNumberDigits(result, 12);
            this.storedNumber = formattedResult;
        } else {
            // for starting our first calculation when operatorState = null
            this.storedNumber = parseFloat(this.currentNumber);
        }
    
            this.operatorState = operator;
            this.awaitingNextNumber = true;
    },

    handleEquals() {
        if (this.storedNumber !== null && this.operatorState !== null) {
            const result = this.operate(this.operatorState, parseFloat(this.storedNumber), parseFloat(this.currentNumber));
            const formattedResult = this.limitNumberDigits(result, 12);
            this.currentNumber = formattedResult.toString();
            this.storedNumber = null;
            this.operatorState = null;
            this.awaitingNextNumber = true;
        }
    },

    clear() {
        this.operatorState = null;
        this.currentNumber = '0';
        this.storedNumber = null;
        this.awaitingNextNumber = false;
    },

    operate(operator, numA, numB) {
        const operations = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            'x': (a, b) => a * b,
            '÷': (a, b) => b === 0 ? 'undefined' : a / b
        };
        const operationFunction = operations[operator];
        return operationFunction ? operationFunction(numA, numB) : numB;
    },
};

const buttonHandlers = {
    '+': (value) => calculator.handleOperator(value),
    '-': (value) => calculator.handleOperator(value),
    'x': (value) => calculator.handleOperator(value),
    '÷': (value) => calculator.handleOperator(value),
    '=': () => calculator.handleEquals(),
    'A/C': () => calculator.clear(),
};

function handleButtonClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== 'BUTTON') return;
    const buttonValue = clickedElement.textContent;

    if (buttonHandlers[buttonValue]) {
        buttonHandlers[buttonValue](buttonValue);
    } else if (!isNaN(parseFloat(buttonValue)) || buttonValue === '.') {
        calculator.handleNumber(buttonValue);
    }
    calculator.updateDisplay(calculator.currentNumber);
}

const calculatorContainer = document.querySelector('.calculator-background');
// following best practice, we'll verify an element exists before attempting to click to avoid errors
if (calculatorContainer) {
    calculatorContainer.addEventListener('click', handleButtonClick);
} else {
    console.warn('Calculator container element not found. Event listener not attached.');
}