//Variables to store the first argument, second argument, operation to be performed and final resulting answer.
const args = {
    firstArg: "0",
    secondArg: null,
    operation: null,
    answer: null
}

//The maximum string length of an argument
const MAX_ARG_LENGTH = 14;

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
        return "ERROR (Divide by 0)"
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

//An object containing a dictionary of keys and the ID of the associated button
let keyToID = {
    "0": "n0",
    "1": "n1",
    "2": "n2",
    "3": "n3",
    "4": "n4",
    "5": "n5",
    "6": "n6",
    "7": "n7",
    "8": "n8",
    "9": "n9",
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    "=": "equals",
    "Enter": "equals",
    ".": "decimal",
    "Escape": "clear",
}

//Get an array containing all of the number buttons and add event listeners
const numButtons = Array.from(document.querySelectorAll(".numButton"));

numButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        pushButton(e.target.id);
    });
})

//Add an event listener for keypresses
window.addEventListener("keydown", keyToButton);

//Get an array containing all buttons
const buttons = Array.from(document.querySelectorAll("button"));

//A function to get a button from a key press
function keyToButton(e) {
    const id = keyToID[e.key];
    pushButton(id);
}

//A function to activate a button given its ID
//TODO: Refactor this with an object
function pushButton(id) {
    const button = document.getElementById(id);
    if(button.classList.contains("numButton")) {
        pushNumber(id);
    } else if (button.classList.contains("opButton")) {
        pushOperator(id);
    } else if(id === "clear") {
        clear();
        updateDisplay();
    } else if (id === "equals") {
        generateAnswer();
        updateDisplay();
    } else if (id === "decimal") {
        pushDecimal();
    }
}

//Get an array containing the operator buttons and add an event listener
const opButtons = Array.from(document.querySelectorAll(".opButton"));
opButtons.forEach(button => {
    button.addEventListener("click", () => {
        pushButton(e.target.id);
    });
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
function pushNumber(id) {
    //If there is an answer, it should be cleared and replaced with the number pressed
    if(args.answer) {
        clear();
    }
    const arg = args.operation ? "secondArg" : "firstArg";
    const number = idToOutput[id];
    //If the arg is equal to 0 or is null, set the arg equal to the number pressed.
    if(args[arg] === "0" || args[arg] === null) {
        args[arg] = number;
    } else {
        //Do not allow args longer than MAX_ARG_LENGTH characters
        if(args[arg].length >= MAX_ARG_LENGTH) {
            return;
        }
        args[arg] += number;
    }
    updateDisplay();
}

//An event listener function to append an operator to the display (after performing an operation on the current arguments if all are present)
function pushOperator(id) {
    //If there is an answer, it should be converted to an arg to be operated upon
    if(args.answer) {
        answerToArg();
    }
    const operator = id;
    if(args.secondArg) {
        args.secondArg = clearTrailingDecimal(args.secondArg);
        const answer = roundAnswer(operate(+args.firstArg, +args.secondArg, args.operation));
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
    pushButton("clear");
});

//Equals button generates an answer on click
//TODO: Refactor so all buttons have the same event listener
const equalsButton = document.querySelector("#equals");
equalsButton.addEventListener("click", () => {
    pushButton("equals");
});

//A function to generate an answer from two args and an operator
function generateAnswer() {
    if(args.secondArg) {
        args.secondArg = clearTrailingDecimal(args.secondArg);
        args.answer = roundAnswer(operate(+args.firstArg, +args.secondArg, args.operation));
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
decimalButton.addEventListener("click", () => {
    pushButton("decimal");
});
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

//Round a given number such that, when converted to a string, it is no more than MAX_ARG_LENGTH characters long. 
//Give an error message if the number exceeds the max safe value.
function roundAnswer(ans) {
    //If number exceeds max safe value, give an error message
    if(ans > Number.MAX_SAFE_INTEGER) {
        return "ERROR (Number too big)";
    }
    const ansString = ans.toString();
    const decimalIndex = ansString.indexOf(".");
    if(ansString.length > MAX_ARG_LENGTH && decimalIndex !== -1) {
        const eIndex = ansString.indexOf("e");
        const tailLength = (eIndex === -1) ? 0 : ansString.slice(eIndex).length;
        const integralLength = decimalIndex + 1;
        //If length up to and including decimal + length of "e notation" portion is equal to or greater than max length, simply round the answer to a whole number.
        if(integralLength + tailLength >= MAX_ARG_LENGTH) {
            return Math.round(ans);
        } else {
            const decimalPlaces = MAX_ARG_LENGTH - (integralLength + tailLength);
            return ans.toFixed(decimalPlaces);
        }
    } else {
        return ans;
    }
}
