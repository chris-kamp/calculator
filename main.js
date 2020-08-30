//add two given numbers
function add(a, b) {
    return a + b;
}

//for two given numbers, subtract the second from the first
function subtract(a, b) {
    return a - b;
}

//multiply two given numbers
function multiply(a, b) {
    return a * b;
}

//for two given numbers, divide the first by the second
//division by zero gives an error
function divide(a, b) {
    if(b === 0) {
        return "ERROR! You can't divide by zero."
    }
    else {
        return a / b;
    }
}

//given two numbers and an operator, perform the relevant operation on the two numbers
function operate(a, b, operator) {
    switch(operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
    }
}