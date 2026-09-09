(() => {
  "use strict";

  const MAX_INPUT_DIGITS = 15;
  const operatorSymbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  const state = {
    tokens: [],
    currentInput: "0",
    previousExpression: "",
    justCalculated: false,
    errorMessage: "",
  };

  const keypad = document.querySelector(".calculator__keypad");
  const previousDisplay = document.querySelector("#previous-display");
  const currentDisplay = document.querySelector("#current-display");

  function isOperator(value) {
    return Object.hasOwn(operatorSymbols, value);
  }

  function countDigits(value) {
    return value.replace(/[^0-9]/g, "").length;
  }

  function displayToken(token) {
    return isOperator(token) ? operatorSymbols[token] : String(token);
  }

  function formatExpression(tokens) {
    return tokens.map(displayToken).join(" ");
  }

  function getLastNumber() {
    for (let index = state.tokens.length - 1; index >= 0; index -= 1) {
      if (typeof state.tokens[index] === "number") {
        return formatResult(state.tokens[index]);
      }
    }

    return "0";
  }

  function updateDisplay() {
    currentDisplay.classList.toggle("is-error", Boolean(state.errorMessage));

    if (state.errorMessage) {
      previousDisplay.textContent = "";
      currentDisplay.value = state.errorMessage;
      currentDisplay.textContent = state.errorMessage;
      return;
    }

    const currentValue = state.currentInput || getLastNumber();
    const expressionTokens = [...state.tokens];

    if (!state.justCalculated && state.currentInput && state.tokens.length > 0) {
      expressionTokens.push(state.currentInput);
    }

    previousDisplay.textContent = state.justCalculated
      ? state.previousExpression
      : state.tokens.length > 0
        ? formatExpression(expressionTokens)
        : "";

    currentDisplay.value = currentValue;
    currentDisplay.textContent = currentValue;

    previousDisplay.scrollLeft = previousDisplay.scrollWidth;
    currentDisplay.scrollLeft = currentDisplay.scrollWidth;
  }

  function resetState() {
    state.tokens = [];
    state.currentInput = "0";
    state.previousExpression = "";
    state.justCalculated = false;
    state.errorMessage = "";
  }

  function clearCalculator() {
    resetState();
    updateDisplay();
  }

  function recoverFromError() {
    if (state.errorMessage) {
      resetState();
    }
  }

  function startFreshInput() {
    state.tokens = [];
    state.currentInput = "0";
    state.previousExpression = "";
    state.justCalculated = false;
  }

  function inputDigit(digit) {
    recoverFromError();

    if (state.justCalculated) {
      startFreshInput();
    }

    if (countDigits(state.currentInput) >= MAX_INPUT_DIGITS) {
      return;
    }

    if (state.currentInput === "0" || state.currentInput === "") {
      state.currentInput = digit;
    } else {
      state.currentInput += digit;
    }

    updateDisplay();
  }

  function inputDecimal() {
    recoverFromError();

    if (state.justCalculated) {
      startFreshInput();
    }

    if (state.currentInput.includes(".")) {
      return;
    }

    state.currentInput = state.currentInput === "" ? "0." : `${state.currentInput}.`;
    updateDisplay();
  }

  function inputOperator(operator) {
    if (!isOperator(operator)) {
      return;
    }

    if (state.errorMessage) {
      clearCalculator();
      return;
    }

    if (state.justCalculated) {
      state.tokens = [Number(state.currentInput), operator];
      state.currentInput = "";
      state.previousExpression = "";
      state.justCalculated = false;
      updateDisplay();
      return;
    }

    const lastToken = state.tokens.at(-1);

    if (state.currentInput !== "") {
      state.tokens.push(Number(state.currentInput), operator);
      state.currentInput = "";
    } else if (isOperator(lastToken)) {
      state.tokens[state.tokens.length - 1] = operator;
    } else if (state.tokens.length > 0) {
      state.tokens.push(operator);
    } else {
      return;
    }

    updateDisplay();
  }

  function applyOperation(left, operator, right) {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        if (right === 0) {
          throw new Error("DIVIDE_BY_ZERO");
        }
        return left / right;
      default:
        throw new Error("INVALID_OPERATOR");
    }
  }

  function validateExpression(tokens) {
    if (tokens.length === 0 || tokens.length % 2 === 0) {
      return false;
    }

    return tokens.every((token, index) => {
      if (index % 2 === 0) {
        return typeof token === "number" && Number.isFinite(token);
      }

      return isOperator(token);
    });
  }

  function evaluateExpression(tokens) {
    if (!validateExpression(tokens)) {
      throw new Error("INVALID_EXPRESSION");
    }

    const reduced = [tokens[0]];

    for (let index = 1; index < tokens.length; index += 2) {
      const operator = tokens[index];
      const nextNumber = tokens[index + 1];

      if (operator === "*" || operator === "/") {
        const leftNumber = reduced.pop();
        reduced.push(applyOperation(leftNumber, operator, nextNumber));
      } else {
        reduced.push(operator, nextNumber);
      }
    }

    let result = reduced[0];

    for (let index = 1; index < reduced.length; index += 2) {
      result = applyOperation(result, reduced[index], reduced[index + 1]);
    }

    if (!Number.isFinite(result)) {
      throw new Error("RESULT_TOO_LARGE");
    }

    return result;
  }

  function formatResult(value) {
    if (!Number.isFinite(value)) {
      throw new Error("RESULT_TOO_LARGE");
    }

    const normalized = Number.parseFloat(value.toPrecision(12));
    const absoluteValue = Math.abs(normalized);

    if (absoluteValue >= 1e12 || (absoluteValue > 0 && absoluteValue < 1e-9)) {
      return normalized.toExponential(8).replace(/\.0+(?=e)/, "").replace(/(\.\d*?)0+(?=e)/, "$1");
    }

    return String(normalized);
  }

  function showError(error) {
    const messages = {
      DIVIDE_BY_ZERO: "Cannot divide by zero",
      RESULT_TOO_LARGE: "Result is too large",
      INVALID_EXPRESSION: "Invalid expression",
      INVALID_OPERATOR: "Invalid operation",
    };

    state.tokens = [];
    state.currentInput = "";
    state.previousExpression = "";
    state.justCalculated = false;
    state.errorMessage = messages[error.message] || "Unable to calculate";
    updateDisplay();
  }

  function calculateResult() {
    if (state.errorMessage || state.justCalculated || state.currentInput === "") {
      return;
    }

    const expression = [...state.tokens, Number(state.currentInput)];

    try {
      const result = evaluateExpression(expression);
      const formattedResult = formatResult(result);

      state.previousExpression = `${formatExpression(expression)} =`;
      state.tokens = [];
      state.currentInput = formattedResult;
      state.justCalculated = true;
      state.errorMessage = "";
      updateDisplay();
    } catch (error) {
      showError(error);
    }
  }

  function deleteLastInput() {
    if (state.errorMessage || state.justCalculated) {
      clearCalculator();
      return;
    }

    if (state.currentInput === "") {
      return;
    }

    state.currentInput = state.currentInput.length > 1
      ? state.currentInput.slice(0, -1)
      : "0";

    updateDisplay();
  }

  function runAction(action, value) {
    switch (action) {
      case "number":
        inputDigit(value);
        break;
      case "operator":
        inputOperator(value);
        break;
      case "decimal":
        inputDecimal();
        break;
      case "calculate":
        calculateResult();
        break;
      case "clear":
        clearCalculator();
        break;
      case "delete":
        deleteLastInput();
        break;
      default:
        break;
    }
  }

  function getButtonAction(button) {
    if (button.dataset.number !== undefined) {
      return { action: "number", value: button.dataset.number };
    }

    if (button.dataset.operator !== undefined) {
      return { action: "operator", value: button.dataset.operator };
    }

    return { action: button.dataset.action, value: "" };
  }

  function flashButton(selector) {
    const button = document.querySelector(selector);

    if (!button) {
      return;
    }

    button.classList.add("is-active");
    window.setTimeout(() => button.classList.remove("is-active"), 100);
  }

  function handleKeyboardInput(event) {
    let command = null;
    let selector = "";

    if (/^[0-9]$/.test(event.key)) {
      command = { action: "number", value: event.key };
      selector = `[data-number="${event.key}"]`;
    } else if (["+", "-", "*", "/"].includes(event.key)) {
      command = { action: "operator", value: event.key };
      selector = `[data-operator="${event.key}"]`;
    } else if (event.key === ".") {
      command = { action: "decimal", value: "" };
      selector = '[data-action="decimal"]';
    } else if (event.key === "Enter" || event.key === "=") {
      command = { action: "calculate", value: "" };
      selector = '[data-action="calculate"]';
    } else if (event.key === "Backspace") {
      command = { action: "delete", value: "" };
      selector = '[data-action="delete"]';
    } else if (event.key === "Escape") {
      command = { action: "clear", value: "" };
      selector = '[data-action="clear"]';
    }

    if (!command) {
      return;
    }

    event.preventDefault();
    runAction(command.action, command.value);
    flashButton(selector);
  }

  keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button || !keypad.contains(button)) {
      return;
    }

    const { action, value } = getButtonAction(button);
    runAction(action, value);
  });

  document.addEventListener("keydown", handleKeyboardInput);
  updateDisplay();
})();
