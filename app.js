// ===== DOM ELEMENTS =====
const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");

// ===== STATE MANAGEMENT =====
const calculatorState = {
  firstOperand: null,
  currentOperator: null,
  shouldResetDisplay: false,
  waitingForOperand: false,
};

// ===== UTILITY FUNCTIONS =====
const formatNumber = (num) => {
  if (typeof num !== "number" || isNaN(num)) return "0";

  // Handle very large or very small numbers
  if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.0000001 && num !== 0)) {
    return num.toExponential(5);
  }

  // Round to avoid floating point precision issues
  const rounded = Math.round(num * 100000000) / 100000000;
  return rounded.toString();
};

const updateDisplay = (value) => {
  display.value = value || "0";
};

const resetCalculator = () => {
  calculatorState.firstOperand = null;
  calculatorState.currentOperator = null;
  calculatorState.shouldResetDisplay = false;
  calculatorState.waitingForOperand = false;
  updateDisplay("0");
};

// ===== CORE FUNCTIONS =====
const appendNumber = (number) => {
  if (calculatorState.shouldResetDisplay || calculatorState.waitingForOperand) {
    updateDisplay("");
    calculatorState.shouldResetDisplay = false;
    calculatorState.waitingForOperand = false;
  }

  const currentValue = display.value === "0" ? "" : display.value;

  // Prevent multiple decimal points
  if (number === "." && currentValue.includes(".")) return;

  // Prevent leading zeros
  if (number === "0" && currentValue === "") return;

  updateDisplay(currentValue + number);
};

const normalizeOperator = (operator) => {
  // Map display symbols to actual operators
  const operatorMap = {
    "×": "*",
    "÷": "/",
    "*": "*",
    "/": "/",
    "+": "+",
    "-": "-",
  };
  return operatorMap[operator] || operator;
};

const chooseOperator = (operator) => {
  const normalizedOperator = normalizeOperator(operator);
  const currentValue = parseFloat(display.value);

  if (calculatorState.firstOperand === null) {
    calculatorState.firstOperand = currentValue;
  } else if (!calculatorState.waitingForOperand) {
    const result = performCalculation();
    updateDisplay(formatNumber(result));
    calculatorState.firstOperand = result;
  }

  calculatorState.currentOperator = normalizedOperator;
  calculatorState.waitingForOperand = true;
  calculatorState.shouldResetDisplay = true;
};

const performCalculation = () => {
  if (calculatorState.currentOperator === null || calculatorState.firstOperand === null) {
    return parseFloat(display.value) || 0;
  }

  const secondOperand = parseFloat(display.value) || 0;
  const result = operate(calculatorState.currentOperator, calculatorState.firstOperand, secondOperand);

  return result;
};

const calculate = () => {
  if (calculatorState.currentOperator === null || calculatorState.waitingForOperand) {
    return;
  }

  const result = performCalculation();
  updateDisplay(formatNumber(result));

  calculatorState.firstOperand = result;
  calculatorState.currentOperator = null;
  calculatorState.waitingForOperand = true;
  calculatorState.shouldResetDisplay = true;
};

const operate = (operator, a, b) => {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        resetCalculator();
        return "Error";
      }
      return a / b;
    default:
      return b;
  }
};

const deleteLast = () => {
  if (calculatorState.waitingForOperand) return;

  const currentValue = display.value;
  if (currentValue.length > 1) {
    updateDisplay(currentValue.slice(0, -1));
  } else {
    updateDisplay("0");
  }
};

// ===== EVENT LISTENERS =====
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.textContent);
  });
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    chooseOperator(button.textContent);
  });
});

if (equalsButton) {
  equalsButton.addEventListener("click", calculate);
}

if (clearButton) {
  clearButton.addEventListener("click", resetCalculator);
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener("keydown", (e) => {
  // Prevent default for calculator keys
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/", "Enter", "Backspace", "Escape"].includes(e.key)) {
    e.preventDefault();
  }

  if (!isNaN(e.key) && e.key !== " ") {
    appendNumber(e.key);
  }

  if (e.key === ".") {
    appendNumber(".");
  }

  if (["+", "-", "*", "/"].includes(e.key)) {
    chooseOperator(e.key);
  }

  if (e.key === "Enter" || e.key === "=") {
    calculate();
  }

  if (e.key === "Backspace") {
    deleteLast();
  }

  if (e.key === "Escape" || e.key === "Delete") {
    resetCalculator();
  }
});

// Initialize display
updateDisplay("0");
