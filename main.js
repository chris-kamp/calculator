//The maximum string length of an argument or answer
const MAX_ARG_LENGTH = 14;

//The string shown in the calculator display
let displayString = "0";

//An array containing all of the buttons on the page
const buttons = Array.from(document.querySelectorAll("button"));

//The element in which numbers are displayed
const display = document.querySelector("#display");

//An object to store the first argument, second argument, operation to be performed and final resulting answer.
const args = {
    firstArg: "0",
    secondArg: null,
    operation: null,
    answer: null
}

//A dictionary of button IDs and what they should output when activated
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

//A dictionary of keyboard keys and the ID of the button to activate when each is pressed
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
    ".": "decimal",
    "Escape": "clear",
    "Backspace": "backspace",
}

//Functions to perform mathematical operations on two given arguments
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if(b === 0) {
        return "ERROR (Divide by 0)"
    }
    else {
        return a / b;
    }
}

//Given two numbers and an operator, perform the relevant operation on the two numbers
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

//Update the display
function updateDisplay() {
    if(args.answer !== null) {
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

//Clear all parameters and reset the calculator to its base state
function clear() {
    args.firstArg = "0";
    args.secondArg = null;
    args.operation = null;
    args.answer = null;
}

//When a keyboard key is pressed, call pushButton on the ID of the associated button (if any)
window.addEventListener("keydown", keyToButton);

function keyToButton(e) {
    if(keyToID[e.key]) {
        const id = keyToID[e.key];
        pushButton(id);
    }
}

//Add event handlers to each button
buttons.forEach(button => {
    //Call pushButton on click
    button.addEventListener("click", e => {
        pushButton(e.target.id);
        removeFocusEffect(e.target);
    });
    //Give visual effects on focus (separated from actual focus for accessibility reasons)
    button.addEventListener("focus", (e) => {
        if(!(e.target.classList.contains("pseudofocus"))) {
            e.target.classList.add("pseudofocus");
        }
    });
    //Remove visual effects on unfocus
    button.addEventListener("blur", (e) => {
        if(e.target.classList.contains("pseudofocus")) {
            removeFocusEffect(e.target);
        }
    });
})


//Remove focus effects on a button (without affecting actual focus)
function removeFocusEffect(button) {
    if(button.classList.contains("pseudofocus")) {
        button.classList.remove("pseudofocus");
    }
}

//Given a button ID, perform its associated operations
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
    } else if (id === "backspace") {
        backspace();
        updateDisplay();
    }
    button.classList.add("pressed");
}

//When a number button is activated, push it to the relevant argument and update the display.
function pushNumber(id) {
    if(args.answer !== null) {
        clear();
    }
    const arg = args.operation ? "secondArg" : "firstArg";
    const number = idToOutput[id];
    if(args[arg] === "0" || args[arg] === null) {
        args[arg] = number;
    } else {
        if(args[arg].length >= MAX_ARG_LENGTH) {
            return;
        }
        args[arg] += number;
    }
    updateDisplay();
}

//When the decimal button is activated, push a decimal to the relevant argument and update the display.
function pushDecimal() {
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

//When an operator button is activated, set it as the operation to be performed. If there is an existing operator and two arguments, first perform that operation.
function pushOperator(id) {
    if(args.answer !== null) {
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

//When the equals button is activated, generate an answer from two arguments and an operator
function generateAnswer() {
    if(args.secondArg) {
        args.secondArg = clearTrailingDecimal(args.secondArg);
        args.answer = roundAnswer(operate(+args.firstArg, +args.secondArg, args.operation));
    }
}

//When the backspace button is activated, remove the last character (or clear a displayed answer)
function backspace() {
    console.log("test");
    if(args.answer !== null) {
        clear();
    } else if(args.secondArg) {
        args.secondArg = (args.secondArg.length > 1) ? args.secondArg.slice(0, -1) : null;
    } else if(args.operation) {
        args.operation = null;
    } else if (args.firstArg.length > 1) {
        args.firstArg = args.firstArg.slice(0, -1);
    } else {
        clear();
    }
}

//Convert the answer from a previous operation to an argument to be operated upon
function answerToArg() {
    const answer = args.answer;
    clear();
    args.firstArg = answer.toString();
}

//Clear a trailing decimal point
function clearTrailingDecimal(arg) {
    const trailingDecimal = /\.$/
    if(arg.search(trailingDecimal) !== -1) {
        return(arg.slice(0, -1));
    } else {
        return arg;
    }
}

//Round a given number such that, when converted to a string, it is no more than MAX_ARG_LENGTH characters long. Give an error message if the number exceeds the max safe value.
function roundAnswer(ans) {
    if(ans > Number.MAX_SAFE_INTEGER) {
        return "ERROR (Number too big)";
    }
    const ansString = ans.toString();
    const decimalIndex = ansString.indexOf(".");
    if(ansString.length > MAX_ARG_LENGTH && decimalIndex !== -1) {
        const eIndex = ansString.indexOf("e");
        const tailLength = (eIndex === -1) ? 0 : ansString.slice(eIndex).length;
        const integralLength = decimalIndex + 1;
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

//Check whether an argument contains a decimal
function hasDecimal(arg) {
    const decimal = /\./;
    if (arg.search(decimal) === -1) {
        return false;
    } else {
        return true;
    }
}