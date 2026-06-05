// Global State Tracking
let currentInput = '0';
let previousInput = '';
let operation = undefined;
let selectedPlanType = null;

const currentDisplay = document.getElementById('current-display');
const previousDisplay = document.getElementById('previous-display');

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && number !== '.') {
        currentInput = number.toString();
    } else {
        currentInput = currentInput.toString() + number.toString();
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        let prev = parseFloat(previousInput);
        let current = parseFloat(currentInput);
        if (!isNaN(prev) && !isNaN(current)) {
            showPaywall();
            return;
        }
    }
    operation = op;
    previousInput = currentInput;
    currentInput = '';
    updateDisplay();
}

function clearScreen() {
    currentInput = '0';
    previousInput = '';
    operation = undefined;
    updateDisplay();
}

function deleteNumber() {
    if (currentInput === '0' || currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Logic Interceptor 
function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current) || !operation) return;

    // Show the prank wall instead of calculating directly
    showPaywall();
}

// Allows selecting packages dynamically 
function selectPlan(planType) {
    selectedPlanType = planType;
    
    // Manage active UI borders manually
    document.getElementById('plan-basic').classList.remove('selected');
    document.getElementById('plan-quantum').classList.remove('selected');
    
    if(planType === 'basic') {
        document.getElementById('plan-basic').classList.add('selected');
    } else {
        document.getElementById('plan-quantum').classList.add('selected');
    }

    // Activate the main subscription submission button
    const payBtn = document.getElementById('pay-button');
    payBtn.classList.add('enabled');
}

function showPaywall() {
    // Reset package choices if reopening
    selectedPlanType = null;
    document.getElementById('plan-basic').classList.remove('selected');
    document.getElementById('plan-quantum').classList.remove('selected');
    document.getElementById('pay-button').classList.remove('enabled');

    const modal = document.getElementById('paywall-modal');
    modal.classList.add('active');
}

// Processes the core calculation secretly behind the scene
function getHiddenResult() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operation) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': computation = current === 0 ? "Error" : prev / current; break;
        case '%': computation = prev % current; break;
        default: return;
    }
    
    currentInput = computation.toString();
    operation = undefined;
    previousInput = '';
}

// Drops paywall alerts, hides modal, and outputs final math values
function revealPrankAndAnswer() {
    if (!selectedPlanType) return; // Prevent action if button is disabled

    alert("Gotcha! It's just a prank! 😂 Releasing your answer now...");
    
    // Close window overlay
    const modal = document.getElementById('paywall-modal');
    modal.classList.remove('active');
    
    // Resolve math and update screen
    getHiddenResult();
    updateDisplay();
}

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    if (operation != null) {
        let displaySymbol = operation;
        if (operation === '*') displaySymbol = '×';
        if (operation === '/') displaySymbol = '÷';
        previousDisplay.innerText = `${previousInput} ${displaySymbol}`;
    } else {
        previousDisplay.innerText = '';
    }
}