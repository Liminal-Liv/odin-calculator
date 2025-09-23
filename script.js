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

    updateDisplay(value) {
        const displayElement = document.querySelector('.current-number');
        if (displayElement) {
            displayElement.value = this.limitNumberDigits(value, this.maxDisplayLength);
            }
    },

    updateStoredDisplay() {
        const displayElement = document.querySelector('.stored-number');
        if (displayElement) {
            const storedValue = this.storedNumber || this.lastOperand;
            let displayValue = '';

            if (storedValue !== '' && storedValue !== null) {
                displayValue += this.limitNumberDigits(storedValue, this.maxDisplayLength);
            }
            if (this.operatorState || this.lastOperation) {
                let operator = this.operatorState ? this.operatorState : this.lastOperation;
                displayValue += ' ' + operator;
            }
            displayElement.value = displayValue;
        }
    },

    limitNumberDigits(num, maxlength) {
        const stringValue = String(num);
        const numericValue = Number(num);
        if (stringValue.length > maxlength) {
            return numericValue.toPrecision(maxlength);
        }
        return num;
    },

    handleNumber(buttonValue) {
        const displayElement = document.querySelector('.current-number');
        if (displayElement.value.length >= this.maxDisplayLength) {
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
    },

    handleEquals() {
        // Standard evaluation for the first '=' press after an operation
        if (this.storedNumber !== '' && this.operatorState !== null && !this.justEvaluated) {
            numA = parseFloat(this.storedNumber);
            numB = parseFloat(this.currentNumber);

            this.lastOperand = numB;
            this. lastOperation = this.operatorState;

            const result = this.operate(this.operatorState, numA, numB)
            this.currentNumber = result.toString();
            this.storedNumber = ''; // Clear storedNumber to prepare for next calculation
            this.operatorState = null;
            this.justEvaluated = true;
        } 
        // repeat '=' press, re-using the last operation and operand
        else if (this.justEvaluated && this.lastOperand !== null) {
            numA = parseFloat(this.currentNumber);
            numB = this.lastOperand;

            const result = this.operate(this.lastOperation, numA, numB);
            this.currentNumber = result.toString();
            this.storedNumber = '';
        } else {
            return;
        }
        this.operatorState = null;
    },

    clear() {
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
    'AC': () => calculator.clear(),
    '⌫': () => calculator.delete(),
};

function handleButtonClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== 'BUTTON') return;
    const buttonValue = clickedElement.textContent;
    toggleActiveButton(clickedElement);

    if (buttonHandlers[buttonValue]) {
        buttonHandlers[buttonValue](buttonValue);
    } else if (!isNaN(parseFloat(buttonValue)) || buttonValue === '.') {
        calculator.handleNumber(buttonValue);
    }
    calculator.updateDisplay(calculator.currentNumber);
    calculator.updateStoredDisplay();
}

function toggleActiveButton(clickedButton) {
    const operators = ['+', '-', 'x', '÷']
    const isOperator = operators.includes(clickedButton.textContent);

    const operatorButtons = document.querySelectorAll('button.operator');

    operatorButtons.forEach(button => {
        button.classList.remove('active');
    })

    if (isOperator) {
        clickedButton.classList.add('active');
    }
}

const calculatorContainer = document.querySelector('.calculator-background');
if (calculatorContainer) {
    calculatorContainer.addEventListener('click', handleButtonClick);
} else {
    console.warn('Calculator container element not found. Event listener not attached.');
}