// operatorState defaults to none on start and clear()
// states are add, subtract, multiply, divide, none
const operatorState = 'none';
const display = 0;

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

// operate:
// check operatorState (+, -, *, or /)

// switch (operatorState):
//     CASES
//     add
//     subtract
//     multiply
//     divide
//     none: (do nothing. just keep the same display)




// updateDisplay()? (or alternatively just an event listener on each button with an anonymous function)
//     the operators will update the state but not display
//     only numbers will be added to display


//  (don't clear last operation. allow user to spam = to repeat last operation)







/*                         IDEAS                         */

// css style to highlight operation you're currently using