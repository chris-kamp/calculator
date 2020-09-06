//Variables to store the first argument, second argument, operation to be performed and final resulting answer.
const args = {
    firstArg: "0",
    secondArg: null,
    operation: null,
    answer: null
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


//A function to convert an answer to an argument to be operated upon
function answerToArg() {
    const answer = args.answer;
    clear();
    args.firstArg = answer.toString();
}

//Get a reference to the display field
const display = document.querySelector("#display");
//A function to update the display
function updateDisplay() {
    if(args.answer) {
        displayString = args.answer;
    } else {
        displayString = args.firstArg;
        if(args.operation) {
            displayString += idToOutput[args.operation]
        }; 
        if(args.secondArg) {
            displayString += args.secondArg
        };
    }
    display.textContent = displayString;
}

//A function to clear all args
function clear() {
    args.firstArg = "0";
    args.secondArg = null;
    args.operation = null;
    args.answer = null;
}

//An event listener function to append a number to the display when its key is pressed
function pushNumber(e) {
    //If there is an answer, it should be cleared and replaced with the number pressed
    if(args.answer) {
        clear();
    }
    const arg = args.operation ? "secondArg" : "firstArg";
    const number = idToOutput[e.target.id];
    //If the arg is equal to 0 or is null, set the arg equal to the number pressed.
    if(args[arg] === "0" || args[arg] === null) {
        args[arg] = number;
    } else {
        //Do not allow args longer than 14 characters
        if(args[arg].length >= 14) {
            return;
        }
        args[arg] += number;
    }
    updateDisplay();
}

//An event listener function to append an operator to the display (after performing an operation on the current arguments if all are present)
function pushOperator(e) {
    //If there is an answer, it should be converted to an arg to be operated upon
    if(args.answer) {
        answerToArg();
    }
    const operator = e.target.id;
    if(args.secondArg) {
        args.secondArg = clearTrailingDecimal(args.secondArg);
        const answer = operate(+args.firstArg, +args.secondArg, args.operation);
        args.firstArg = answer.toString();
        args.secondArg = null;
    } else if (args.firstArg === ".") {
        args.firstArg = "0";
    } else {
        args.firstArg = clearTrailingDecimal(args.firstArg);
    }
        args.operation = operator;
        updateDisplay();
}

//A function to clear a trailing decimal point before an operator
function clearTrailingDecimal(arg) {
    const trailingDecimal = /\.$/
    if(arg.search(trailingDecimal) !== -1) {
        return(arg.slice(0, -1));
    } else {
        return arg;
    }
}

//Clear button clears display on click
const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", () => {
    clear();
    updateDisplay();
});

//Equals button generates an answer on click
const equalsButton = document.querySelector("#equals");
equalsButton.addEventListener("click", generateAnswer);
function generateAnswer() {
    if(args.secondArg) {
        args.secondArg = clearTrailingDecimal(args.secondArg);
        args.answer = operate(+args.firstArg, +args.secondArg, args.operation);
        updateDisplay();
    }
}

//A function to check whether an argument contains a decimal
function hasDecimal(arg) {
    const decimal = /\./;
    if (arg.search(decimal) === -1) {
        return false;
    } else {
        return true;
    }
}

//Decimal button inserts a decimal into the relevant argument on click
const decimalButton = document.querySelector("#decimal");
decimalButton.addEventListener("click", pushDecimal);
function pushDecimal() {
    //If there is an answer, clear the calculator first
    if (args.answer) {
        clear();
    }
    if (args.secondArg && !hasDecimal(args.secondArg)) {
        args.secondArg += ".";
    }
    else if (args.operation) {
        args.secondArg = ".";
    }
    else if (args.firstArg === "0") {
        args.firstArg = ".";
    }
    else if (!hasDecimal(args.firstArg)) {
        args.firstArg += ".";
    } else {
        return;
    }
    updateDisplay();
}



