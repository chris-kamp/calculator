//Variables to store the first argument, second argument and operation to be performed
const args = {
    firstArg: "0",
    secondArg: null,
    operation: null
}


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
        case "add":
            return add(a, b);
        case "subtract":
            return subtract(a, b);
        case "multiply":
            return multiply(a, b);
        case "divide":
            return divide(a, b);
    }
}

//A string that will be shown in the calculator display
let displayString = "0";

//An array to queue numbers and operations
let queue = [];

//An object containing a dictionary of IDs and what they should output
let idToOutput = {
    n0: "0",
    n1: "1",
    n2: "2",
    n3: "3",
    n4: "4",
    n5: "5",
    n6: "6",
    n7: "7",
    n8: "8",
    n9: "9",
    add: "\u002B",
    subtract: "\u2212",
    multiply: "\u00D7",
    divide: "\u00F7",
};

//Get an array containing all of the number buttons and add an event listener
const numButtons = Array.from(document.querySelectorAll(".numButton"));

numButtons.forEach(button => {
    button.addEventListener("click", pushNumber);
})

//Get an array containing the operator buttons and add an event listener
const opButtons = Array.from(document.querySelectorAll(".opButton"));
opButtons.forEach(button => {
    button.addEventListener("click", pushOperator);
});


//Clear button clears display on click
const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", clear);

const display = document.querySelector("#display");

//A function to update the display
function updateDisplay() {
    displayString = args.firstArg;
    if(args.operation) {displayString += idToOutput[args.operation]}; //This will need to be the symbol, not the name of the operation
    if(args.secondArg) {displayString += args.secondArg};
    display.textContent = displayString;
}

//A function to clear the display
function clear() {
    args.firstArg = "0";
    args.secondArg = null;
    args.operation = null;
    updateDisplay();
}

//An event listener function to append a number to the display when
//its key is pressed
function pushNumber(e) {
    const arg = args.operation ? "secondArg" : "firstArg";
    const number = idToOutput[e.target.id];
    if (args[arg] === "0" || args[arg] === null) {
        if(number !== "0") {
            args[arg] = number; //Needs to refuse leading zero in second arg
        }
    } else {
        args[arg] += number;
    }
    updateDisplay();
}

//An event listener function to append an operator to the display (after performing an operation on the current arguments if all are present)
function pushOperator(e) {
    const operator = e.target.id;
    if(args.secondArg) {
        const answer = operate(+args.firstArg, +args.secondArg, args.operation);
        args.firstArg = answer;
        args.secondArg = null;
    }
        args.operation = operator;
        updateDisplay();
}




