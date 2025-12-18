//SAMPLE TEXTS FOR TYPING
const SAMPLE_TEXTS = [
  "Chemistry is the science that studies matter and its interactions. It helps us understand how atoms combine to form different substances. Many useful products like soap and medicine are created through chemical processes. Chemistry plays a major role in improving everyday life.",
  "Acids and bases are two important groups of chemicals with opposite properties. Acids taste sour and have a low pH, while bases feel slippery and have a high pH. When mixed, they can neutralize each other and form a salt. This concept is used in medicine, cleaning products, and food science.",
  "Matter exists in different states such as solid, liquid, and gas. Each state has unique particle movement and spacing. Heating or cooling a substance can cause it to change from one state to another. These changes help explain natural processes like evaporation and melting.",
  "The periodic table organizes all known elements based on their properties. Elements in the same group share similar behaviors in chemical reactions. Metals, nonmetals, and metalloids all have different characteristics and uses. This structure helps scientists predict how elements will interact.",
  "Atoms form chemical bonds to achieve stability. Ionic bonds occur when electrons are transferred between atoms, while covalent bonds involve shared electrons. These bonds determine a compound’s strength, melting point, and reactivity. Understanding bonding helps explain why materials behave differently.",
  "Chemical reactions occur when substances interact to form new materials. Some reactions release energy in the form of heat or light. Others absorb energy, becoming colder as they progress. These energy changes help scientists understand how reactions behave.",
   
];

// ELEMENTS
const textToTypeEl = document.getElementById('textToType');
const inputEl = document.getElementById('input');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const errorsEl = document.getElementById('errors');
const timeLeftEl = document.getElementById('timeLeft');
const timeSelect = document.getElementById('time');
const restartBtn = document.getElementById('restart');

// VARIABLES
let target = '';
let timer = null;
let timeLeft = parseInt(timeSelect.value, 10);
let started = false;
let totalTyped = 0;
let totalErrors = 0;

// PICK RANDOM TEXT
function pickText() {
  target = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
  renderTarget();
}

// RENDER TEXT AS SPANS
function renderTarget() {
  textToTypeEl.innerHTML = '';
  for (let i = 0; i < target.length; i++) {
    const span = document.createElement('span');
    span.textContent = target[i];
    span.className = 'char untyped';
    textToTypeEl.appendChild(span);
  }
}

// START TIMER
function startTimer() {
  if (started) return;
  started = true;

  timeLeft = parseInt(timeSelect.value, 10);
  timeLeftEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;

    if (timeLeft <= 0) stopTest();
  }, 1000);
}

// STOP TEST
function stopTest() {
  clearInterval(timer);
  timer = null;
  inputEl.disabled = true;
  started = false;
}

// RESET TEST
function resetTest() {
  clearInterval(timer);
  timer = null;
  started = false;

  inputEl.disabled = false;
  inputEl.value = "";

  totalTyped = 0;
  totalErrors = 0;

  wpmEl.textContent = "0";
  errorsEl.textContent = "0";
  accuracyEl.textContent = "100%";

  timeLeft = parseInt(timeSelect.value, 10);
  timeLeftEl.textContent = timeLeft;

  pickText();
  inputEl.focus();
}

// CALCULATE STATS
function calculateStats() {
  const minutesPassed = (parseInt(timeSelect.value, 10) - timeLeft) / 60;
  const wordsTyped = Math.floor(totalTyped / 5);
  const wpm = minutesPassed > 0 ? Math.round(wordsTyped / minutesPassed) : 0;

  const accuracy = totalTyped > 0
    ? Math.round(((totalTyped - totalErrors) / totalTyped) * 100)
    : 100;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy + "%";
  errorsEl.textContent = totalErrors;
}

// INPUT HANDLER
inputEl.addEventListener('input', () => {
  const value = inputEl.value;

  if (!started) startTimer();

  totalTyped = value.length;
  totalErrors = 0;

  const spans = textToTypeEl.querySelectorAll('span');

  for (let i = 0; i < spans.length; i++) {
    const char = value[i];

    spans[i].classList.remove('correct', 'incorrect', 'untyped', 'current');

    if (char == null) {
      spans[i].classList.add('untyped');
    } else if (char === target[i]) {
      spans[i].classList.add('correct');
    } else {
      spans[i].classList.add('incorrect');
      totalErrors++;
    }
  }

  // Mark next char
  const nextIndex = Math.min(value.length, spans.length - 1);
  spans[nextIndex].classList.add('current');

  calculateStats();

  // If finished, load new text
  if (value.length >= target.length) {
    inputEl.value = "";
    pickText();
  }
});

// EVENTS
restartBtn.addEventListener('click', resetTest);

timeSelect.addEventListener('change', () => {
  timeLeft = parseInt(timeSelect.value, 10);
  timeLeftEl.textContent = timeLeft;
});

// INITIALIZE
pickText();
inputEl.focus();
