/**
 * SpeedMath Arena - 60-Second Mental Arithmetic Challenge
 * Developer: Tareq Aboushi (Tareq0001)
 */

// --- Localization Strings ---
const i18nData = {
  ar: {
    appTitle: "SpeedMath Arena",
    appSubtitle: "تحدي الحساب الذهني السريع لتعزيز سرعة البديهة والتركيز",
    soundLabel: "الصوت",
    startTitle: "جاهز لاختبار سرعتك الذهنية؟",
    startDesc: "أجب على أكبر عدد ممكن من المعادلات الرياضية خلال 60 ثانية واجمع أعلى النقاط والمضاعفات!",
    selectDiff: "اختر مستوى الصعوبة:",
    diffEasy: "سهل (مبتدئ)",
    diffEasyMeta: "جمع وطرح (1-20)",
    diffMedium: "متوسط (تحدي)",
    diffMediumMeta: "جمع وطرح وضرب (1-50)",
    diffHard: "خبير (صعب)",
    diffHardMeta: "العمليات الأربع مع القسمة (1-100)",
    bestScoreLabel: "أعلى رقم قياسي محفوظ:",
    btnStartGame: "بدء التحدي (60 ثانية)",
    hudScore: "النقاط",
    hudTimer: "الوقت المتبقي",
    hudStreak: "المضاعف",
    resTitle: "انتهى الوقت! ملخص التحدي",
    resSub: "أداء رائع وجهد ذهني مميز!",
    resFinalScore: "النتيجة النهائية",
    resAccuracy: "الدقة",
    resMaxStreak: "أعلى سلسلة صحيحة",
    resSpeed: "السرعة",
    btnPlayAgain: "العب مرة أخرى",
    btnReview: "مراجعة الإجابات",
    thEq: "المعادلة",
    thYourAns: "إجابتك",
    thCorrectAns: "الإجابة الصحيحة",
    thStatus: "الحالة",
    statusCorrect: "صحيحة ✔",
    statusWrong: "خاطئة ❌",
    combo3: "رائع! استمر ⚡",
    combo5: "سلسلة نارية! 🔥",
    combo10: "لا يمكن إيقافك! 🚀",
    newRecord: "رقم قياسي جديد! 🏆"
  },
  en: {
    appTitle: "SpeedMath Arena",
    appSubtitle: "Fast-Paced Mental Arithmetic Challenge for Sharp Reflexes",
    soundLabel: "Sound",
    startTitle: "Ready to Test Your Mental Speed?",
    startDesc: "Solve as many math equations as you can in 60 seconds to rack up multipliers and break records!",
    selectDiff: "Select Difficulty:",
    diffEasy: "Easy (Beginner)",
    diffEasyMeta: "Add & Subtract (1-20)",
    diffMedium: "Medium (Challenger)",
    diffMediumMeta: "Add, Subtract & Multiply (1-50)",
    diffHard: "Hard (Expert)",
    diffHardMeta: "All 4 Operations with Division (1-100)",
    bestScoreLabel: "Current High Score:",
    btnStartGame: "Start Challenge (60s)",
    hudScore: "Score",
    hudTimer: "Time Left",
    hudStreak: "Multiplier",
    resTitle: "Time's Up! Challenge Summary",
    resSub: "Phenomenal mental performance!",
    resFinalScore: "Final Score",
    resAccuracy: "Accuracy",
    resMaxStreak: "Max Streak",
    resSpeed: "Speed",
    btnPlayAgain: "Play Again",
    btnReview: "Review Answers",
    thEq: "Equation",
    thYourAns: "Your Answer",
    thCorrectAns: "Correct Answer",
    thStatus: "Status",
    statusCorrect: "Correct ✔",
    statusWrong: "Wrong ❌",
    combo3: "Great Job! Keep Going ⚡",
    combo5: "On Fire! 🔥",
    combo10: "Unstoppable! 🚀",
    newRecord: "New High Score! 🏆"
  }
};

// --- Game State ---
let currentLang = "ar";
let selectedDiff = "easy";
let isGameActive = false;
let timeLeft = 60;
let timerInterval = null;
let currentScore = 0;
let currentStreak = 0;
let maxStreak = 0;
let currentEquation = null;
let answeredQuestions = [];
let soundEnabled = true;
let audioCtx = null;

// --- DOM Elements ---
const startScreen = document.getElementById("startScreen");
const playScreen = document.getElementById("playScreen");
const resultsScreen = document.getElementById("resultsScreen");

const startHighScore = document.getElementById("startHighScore");
const startGameBtn = document.getElementById("startGameBtn");
const diffButtons = document.querySelectorAll(".diff-btn");

const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const streakDisplay = document.getElementById("streakDisplay");
const timerBox = document.getElementById("timerBox");
const timerProgressFill = document.getElementById("timerProgressFill");
const comboBubble = document.getElementById("comboBubble");
const equationText = document.getElementById("equationText");
const answerInput = document.getElementById("answerInput");
const submitAnswerBtn = document.getElementById("submitAnswerBtn");
const keypad = document.querySelector(".onscreen-keypad");

const resScore = document.getElementById("resScore");
const resAccuracy = document.getElementById("resAccuracy");
const resMaxStreak = document.getElementById("resMaxStreak");
const resSpeed = document.getElementById("resSpeed");
const resSubtitle = document.getElementById("resSubtitle");
const playAgainBtn = document.getElementById("playAgainBtn");
const toggleReviewBtn = document.getElementById("toggleReviewBtn");
const reviewContainer = document.getElementById("reviewContainer");
const reviewTableBody = document.getElementById("reviewTableBody");

const soundToggleBtn = document.getElementById("soundToggleBtn");
const soundIcon = document.getElementById("soundIcon");
const langToggleBtn = document.getElementById("langToggleBtn");

// --- Audio Synthesizer ---
function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

function playSfx(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || audioCtx.state === "suspended") {
      audioCtx?.resume();
    }

    const now = audioCtx.currentTime;

    if (type === "correct") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "streak") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2); // C6
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "wrong") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.18); // D3
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "gameover") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.12);
      osc.frequency.setValueAtTime(659.25, now + 0.24);
      osc.frequency.setValueAtTime(880, now + 0.36);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    // Audio context gesture restrictions
  }
}

// --- Question Generator ---
function generateQuestion(diff) {
  let a, b, op, ans;

  if (diff === "easy") {
    op = Math.random() < 0.5 ? "+" : "-";
    if (op === "+") {
      a = Math.floor(Math.random() * 15) + 1;
      b = Math.floor(Math.random() * 15) + 1;
      ans = a + b;
    } else {
      a = Math.floor(Math.random() * 20) + 2;
      b = Math.floor(Math.random() * a) + 1;
      ans = a - b;
    }
  } else if (diff === "medium") {
    const ops = ["+", "-", "×"];
    op = ops[Math.floor(Math.random() * ops.length)];
    if (op === "+") {
      a = Math.floor(Math.random() * 40) + 5;
      b = Math.floor(Math.random() * 40) + 5;
      ans = a + b;
    } else if (op === "-") {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * a) + 1;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      ans = a * b;
    }
  } else {
    // Hard
    const ops = ["+", "-", "×", "÷"];
    op = ops[Math.floor(Math.random() * ops.length)];
    if (op === "+") {
      a = Math.floor(Math.random() * 80) + 10;
      b = Math.floor(Math.random() * 80) + 10;
      ans = a + b;
    } else if (op === "-") {
      a = Math.floor(Math.random() * 100) + 20;
      b = Math.floor(Math.random() * a) + 5;
      ans = a - b;
    } else if (op === "×") {
      a = Math.floor(Math.random() * 16) + 3;
      b = Math.floor(Math.random() * 12) + 2;
      ans = a * b;
    } else {
      // Division: clean integers
      b = Math.floor(Math.random() * 11) + 2;
      const quotient = Math.floor(Math.random() * 12) + 2;
      a = b * quotient;
      ans = quotient;
    }
  }

  return {
    text: `${a} ${op} ${b} = ?`,
    displayEq: `${a} ${op} ${b}`,
    expectedAnswer: ans
  };
}

// --- Multiplier & Scoring ---
function getMultiplier(streak) {
  if (streak >= 10) return 3.0;
  if (streak >= 5) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
}

function getDiffWeight(diff) {
  if (diff === "hard") return 3;
  if (diff === "medium") return 2;
  return 1;
}

function updateHUD() {
  scoreDisplay.textContent = currentScore.toLocaleString();
  const mult = getMultiplier(currentStreak);
  streakDisplay.textContent = `${mult.toFixed(1)}x 🔥${currentStreak}`;
}

function showComboNotification(text) {
  comboBubble.textContent = text;
  comboBubble.classList.add("show");
  setTimeout(() => {
    comboBubble.classList.remove("show");
  }, 1200);
}

// --- Gameplay Flow ---
function startGame() {
  isGameActive = true;
  timeLeft = 60;
  currentScore = 0;
  currentStreak = 0;
  maxStreak = 0;
  answeredQuestions = [];

  startScreen.style.display = "none";
  resultsScreen.style.display = "none";
  playScreen.style.display = "flex";
  reviewContainer.style.display = "none";

  updateHUD();
  timerDisplay.textContent = "60";
  timerProgressFill.style.width = "100%";
  timerBox.classList.remove("urgent");

  nextQuestion();
  answerInput.focus();

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    const progress = (timeLeft / 60) * 100;
    timerProgressFill.style.width = `${progress}%`;

    if (timeLeft <= 10) {
      timerBox.classList.add("urgent");
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function nextQuestion() {
  currentEquation = generateQuestion(selectedDiff);
  equationText.textContent = currentEquation.text;
  answerInput.value = "";
  answerInput.focus();
}

function submitAnswer() {
  if (!isGameActive || !currentEquation) return;
  const rawVal = answerInput.value.trim();
  if (rawVal === "") return;

  const userAns = parseInt(rawVal, 10);
  const isCorrect = userAns === currentEquation.expectedAnswer;

  answeredQuestions.push({
    equation: currentEquation.displayEq,
    userAns: userAns,
    correctAns: currentEquation.expectedAnswer,
    isCorrect: isCorrect
  });

  const lang = i18nData[currentLang];

  if (isCorrect) {
    currentStreak++;
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }

    const mult = getMultiplier(currentStreak);
    const pts = Math.round(100 * getDiffWeight(selectedDiff) * mult);
    currentScore += pts;

    if (currentStreak === 3) {
      playSfx("streak");
      showComboNotification(lang.combo3);
    } else if (currentStreak === 5) {
      playSfx("streak");
      showComboNotification(lang.combo5);
    } else if (currentStreak === 10) {
      playSfx("streak");
      showComboNotification(lang.combo10);
    } else {
      playSfx("correct");
    }
  } else {
    currentStreak = 0;
    playSfx("wrong");
  }

  updateHUD();
  nextQuestion();
}

function endGame() {
  clearInterval(timerInterval);
  isGameActive = false;
  playSfx("gameover");

  playScreen.style.display = "none";
  resultsScreen.style.display = "flex";

  const total = answeredQuestions.length;
  const correctCount = answeredQuestions.filter(q => q.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const speed = total; // 60s total, so count = per minute

  resScore.textContent = currentScore.toLocaleString();
  resAccuracy.textContent = `${accuracy}%`;
  resMaxStreak.textContent = `${maxStreak}🔥`;
  resSpeed.textContent = `${speed} Q/min`;

  // LocalStorage High Score check
  const storageKey = `speedmath_highscore_${selectedDiff}`;
  const oldHigh = parseInt(localStorage.getItem(storageKey) || "0", 10);
  const lang = i18nData[currentLang];

  if (currentScore > oldHigh) {
    localStorage.setItem(storageKey, currentScore.toString());
    resSubtitle.textContent = lang.newRecord;
    resSubtitle.style.color = "var(--accent-amber)";
  } else {
    resSubtitle.textContent = lang.resSub;
    resSubtitle.style.color = "var(--text-muted)";
  }

  updateStartHighScore();
  buildReviewTable();
}

function buildReviewTable() {
  reviewTableBody.innerHTML = "";
  const lang = i18nData[currentLang];

  answeredQuestions.forEach(q => {
    const tr = document.createElement("tr");
    tr.className = q.isCorrect ? "correct" : "wrong";

    tr.innerHTML = `
      <td>${q.equation}</td>
      <td class="${q.isCorrect ? 'ans-correct' : 'ans-wrong'}">${q.userAns}</td>
      <td class="ans-correct">${q.correctAns}</td>
      <td>${q.isCorrect ? lang.statusCorrect : lang.statusWrong}</td>
    `;
    reviewTableBody.appendChild(tr);
  });
}

function updateStartHighScore() {
  const storageKey = `speedmath_highscore_${selectedDiff}`;
  const high = localStorage.getItem(storageKey) || "0";
  startHighScore.textContent = parseInt(high, 10).toLocaleString();
}

// --- Keypad & Input Handling ---
keypad.addEventListener("click", (e) => {
  const btn = e.target.closest(".key-btn");
  if (!btn) return;
  const key = btn.getAttribute("data-key");

  if (key === "clear") {
    answerInput.value = "";
  } else if (key === "enter") {
    submitAnswer();
  } else {
    answerInput.value += key;
  }
  answerInput.focus();
});

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitAnswer();
  }
});

submitAnswerBtn.addEventListener("click", submitAnswer);

// --- Difficulty Buttons ---
diffButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    diffButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDiff = btn.getAttribute("data-diff");
    updateStartHighScore();
  });
});

// --- Screens Navigation ---
startGameBtn.addEventListener("click", startGame);

playAgainBtn.addEventListener("click", () => {
  resultsScreen.style.display = "none";
  startScreen.style.display = "flex";
  updateStartHighScore();
});

toggleReviewBtn.addEventListener("click", () => {
  const isHidden = reviewContainer.style.display === "none";
  reviewContainer.style.display = isHidden ? "block" : "none";
});

// --- Audio & Language Controls ---
soundToggleBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
  soundToggleBtn.style.opacity = soundEnabled ? "1" : "0.6";
});

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18nData[lang][key]) {
      el.textContent = i18nData[lang][key];
    }
  });

  document.getElementById("langText").textContent = lang === "ar" ? "English" : "العربية";
  if (!isGameActive && answeredQuestions.length > 0) {
    buildReviewTable();
  }
}

langToggleBtn.addEventListener("click", () => {
  setLanguage(currentLang === "ar" ? "en" : "ar");
});

// Initialize on Load
window.addEventListener("DOMContentLoaded", () => {
  updateStartHighScore();
});
