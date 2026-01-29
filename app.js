const display = document.getElementById("display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.getElementById("egal");
const deleteButton = document.getElementById("delete");

let firstOperand = "";
let secondOperand = "";
let currentOperator = null;
let shouldResetDisplay = false;

// ===== FUNCTIONS =====

function appendNumber(number) {
  if (shouldResetDisplay) {
    display.value = "";
    shouldResetDisplay = false;
  }

  if (number === "." && display.value.includes(".")) return;

  display.value += number;
}

function chooseOperator(operator) {
  if (display.value === "") return;

  if (firstOperand !== "") {
    calculate();
  }

  firstOperand = display.value;
  currentOperator = operator;
  shouldResetDisplay = true;
}

function calculate() {
  if (currentOperator === null || shouldResetDisplay) return;

  secondOperand = display.value;

  let result = operate(
    currentOperator,
    parseFloat(firstOperand),
    parseFloat(secondOperand),
  );

  display.value = result;
  firstOperand = result;
  currentOperator = null;
}

function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) return "Error";
      return a / b;
    default:
      return null;
  }
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

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

equalsButton.addEventListener("click", calculate);

deleteButton.addEventListener("click", deleteLast);

// ===== Keyboard support =====

document.addEventListener("keydown", (e) => {
  if (!isNaN(e.key)) appendNumber(e.key);

  if (e.key === ".") appendNumber(".");

  if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);

  if (e.key === "Enter") calculate();

  if (e.key === "Backspace") deleteLast();
});
