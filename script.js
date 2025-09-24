const calculator = {
    operatorState: null,
    storedNumber: '',
    currentNumber: '0',
    awaitingNextNumber: false,
    maxDisplayLength: 12,
    // these last three properties are all used for chaining repeat equal presses
    lastOperation: null,
    lastOperand: null,
    justEvaluated: false,

    updateCurrentDisplay(value) {
        const currentDisplay = document.querySelector('.current-display');
        if (currentDisplay) {
            currentDisplay.value = this.limitNumberDigits(value, this.maxDisplayLength);
            }
    },

    updatePreviousDisplay(value) {
        const previousDisplay = document.querySelector('.previous-display');
        if (previousDisplay) {
            previousDisplay.value = value;
        }
    },

    limitNumberDigits(num, maxlength) {
        const stringValue = String(num);
        const numericValue = Number(num);
        if (stringValue.length <= maxlength) {
            return stringValue;
        }

        const precision = maxlength - 5;
        let formatted = numericValue.toPrecision(precision);
        if (formatted.length > maxlength) {
            return numericValue.toExponential(precision - 1);
        }
        return formatted;
    },

    handleNumber(buttonValue) {
        const currentDisplay = document.querySelector('.current-display');
        if (currentDisplay.value.length >= this.maxDisplayLength) {
            return;
        } if (this.awaitingNextNumber) {
            this.currentNumber = (buttonValue === '.') ? '0.' : buttonValue;
            this.awaitingNextNumber = false;
            this.justEvaluated = false; // Added this line to prevent repeat equal issue
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
        // updates the operator if you press operator buttons multiple times in a row
        if (this.awaitingNextNumber) {
            this.operatorState = operator;
            this.lastOperation = operator;
            const prevCalculation = this.storedNumber + ' ' + operator;
            calculator.updatePreviousDisplay(prevCalculation);
            return;
        }

        // The justEvaluated flag is reset here to ensure that switching to a different operation 
        // after multiple equal presses will not reuse the wrong number. (lastOperand from last equal press)
        this.justEvaluated = false;

        // If a previous operation is pending, calculate it first when pressing operator.
        if (this.operatorState && !this.awaitingNextNumber) {
            this.lastOperand = parseFloat(this.currentNumber);
            const result = this.operate(this.operatorState, parseFloat(this.storedNumber), parseFloat(this.currentNumber));
            this.storedNumber = result;
        } else {
            // for starting our first calculation when operatorState = null
            this.storedNumber = parseFloat(this.currentNumber);
        }
            this.currentNumber = '';
            this.operatorState = operator;
            this.lastOperation = operator;
            this.awaitingNextNumber = true;

            const prevCalculation = this.storedNumber + ' ' + operator;
            calculator.updatePreviousDisplay(prevCalculation);
    },

    handleEquals() {
        // Standard evaluation for the first '=' press after an operation
        if (this.storedNumber !== '' && this.operatorState !== null && !this.justEvaluated) {
            numA = parseFloat(this.storedNumber);
            numB = parseFloat(this.currentNumber);
            const prevCalculation = `${numA} ${this.operatorState} ${numB}`;
            this.updatePreviousDisplay(prevCalculation);

            this.lastOperand = numB;
            this.lastOperation = this.operatorState;

            const result = this.operate(this.operatorState, numA, numB)
            this.currentNumber = result.toString();
            this.storedNumber = ''; // Clear storedNumber to prepare for next calculation
            this.justEvaluated = true;
        }
        // repeat '=' press, re-using the last operation and operand
        else if (this.justEvaluated && this.lastOperand !== null) {
            numA = parseFloat(this.currentNumber);
            numB = this.lastOperand;
            const prevCalculation = `${numA} ${this.lastOperation} ${numB}`;
            this.updatePreviousDisplay(prevCalculation);

            const result = this.operate(this.lastOperation, numA, numB);
            this.currentNumber = result.toString();
            this.storedNumber = '';
        } else {
            return;
        }
        this.operatorState = null;
    },

    clearAll() {
        this.updatePreviousDisplay('');
        this.operatorState = null;
        this.currentNumber = '0';
        this.storedNumber = '';
        this.awaitingNextNumber = false;
        this.lastOperation = null;
        this.lastOperand = null;
        this.justEvaluated = false;
    },

    delete() {
        this.currentNumber = this.currentNumber.toString().slice(0, -1);
        if (this.currentNumber === '') {
            this.currentNumber = '0';
        }
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
    'AC': () => calculator.clearAll(),
    '⌫': () => calculator.delete(),
};

function handleButtonClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== 'BUTTON') return;
    const buttonValue = clickedElement.textContent;

    const operatorButtons = document.querySelectorAll('button.operator');
    operatorButtons.forEach(button => button.classList.remove('active'));
    if (buttonHandlers[buttonValue]) {
        buttonHandlers[buttonValue](buttonValue);
        // this prevents AC from getting the active class
        if (['+', '-', 'x', '÷'].includes(buttonValue)) {
            clickedElement.classList.add('active');
          }
    } else if (!isNaN(parseFloat(buttonValue)) || buttonValue === '.') {
        calculator.handleNumber(buttonValue);
    }
    calculator.updateCurrentDisplay(calculator.currentNumber);
}

const calculatorContainer = document.querySelector('.calculator-background');
if (calculatorContainer) {
    calculatorContainer.addEventListener('click', handleButtonClick);
} else {
    console.warn('Calculator container element not found. Event listener not attached.');
}

// fix: NaN on back to back operator presses