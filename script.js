// operatorState defaults to none on start and clear()
// states are add, subtract, multiply, divide, none
let operatorState = 'none';
let display = 0;

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

function operate(numA, numB) {
    switch (operatorState) {
        case 'add':
            display = add(numA, numB);
            return display;
        case 'subtract':
            display = subtract(numA, numB);
            return display;
        case 'multiply':
            display = multiply(numA, numB);
            return display;
        case 'divide':
            display = divide(numA, numB);
            return display;
        case 'none':
            // the display shouldn't change when you hit = without an operator
            return;
        default:
            return 'Error';
    }
}

// updateDisplay()? (or alternatively just an event listener on each button with an anonymous function)
//     the operators will update the state but not display
//     only numbers will be added to display

//  (don't clear last operation. allow user to spam = to repeat last operation)





/*                         IDEAS                         */

// css style to highlight operation you're currently using