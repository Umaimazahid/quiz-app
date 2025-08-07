
// Questions

const questions = [
  { question: "What color symbolizes love?", options: ["Blue", "Pink", "Red", "Yellow"], answer: "Red" },
  { question: "Which Disney princess has a pet tiger?", options: ["Ariel", "Jasmine", "Cinderella", "Belle"], answer: "Jasmine" },
  { question: "What is a popular girl group from the 90s?", options: ["Backstreet Boys", "Spice Girls", "NSYNC", "BTS"], answer: "Spice Girls" },
  { question: "What’s the name of Barbie’s boyfriend?", options: ["Ken", "Ben", "Ryan", "Leo"], answer: "Ken" },
  { question: "Which makeup item is used to color the lips?", options: ["Foundation", "Lipstick", "Mascara", "Blush"], answer: "Lipstick" },
  { question: "Which singer is known for the hit 'Shake It Off'?", options: ["Selena Gomez", "Ariana Grande", "Taylor Swift", "Dua Lipa"], answer: "Taylor Swift" },
  { question: "What do you call a party with pajamas?", options: ["Slumber party", "Gala", "Brunch", "Sleepwalk"], answer: "Slumber party" },
  { question: "What’s the famous fashion capital of the world?", options: ["New York", "Russia", "Paris", "Rome"], answer: "Paris" },
  { question: "What item do you use to paint your nails?", options: ["Lip gloss", "Hair spray", "Nail polish", "Perfume"], answer: "Nail polish" },
  { question: "Which animal is Hello Kitty?", options: ["Bunny", "Kitten", "Puppy", "Bear"], answer: "Kitten" },
  { question: "Who is Elsa's sister in Frozen?", options: ["Anna", "Moana", "Ariel", "Bella"], answer: "Anna" },
  { question: "Which season is known for pink flowers?", options: ["Summer", "Spring", "Autumn", "Winter"], answer: "Spring" },
  { question: "Which planet is known as the red planet?", options: ["Mars", "Venus", "Jupiter", "Earth"], answer: "Mars" },
  { question: "What does the ‘BFF’ stand for?", options: ["Big Fancy Friend", "Best Fun Forever", "Best Friends Forever", "Best For Fun"], answer: "Best Friends Forever" },
  { question: "Which animal is known for its long neck?", options: ["Giraffe", "Elephant", "Cat", "Zebra"], answer: "Giraffe" }
];

//App state
const TIME_PER_Q = 10;            // seconds per question
let currentIndex = 0;
let timer = null;
let timeLeft = TIME_PER_Q;
let userAnswers = new Array(questions.length).fill(null); // track user choices

//Elements
const startScreen = document.getElementById('start-screen');
const quizScreen  = document.getElementById('quiz-screen');

const startBtn    = document.getElementById('startBtn');
const questionEl  = document.getElementById('question');
const optionsEl   = document.getElementById('options');
const timerEl     = document.getElementById('timer');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const resultEl    = document.getElementById('result');
const qIndexEl    = document.getElementById('qIndex');
const qTotalEl    = document.getElementById('qTotal');

//initialize total
qTotalEl.textContent = questions.length;

//Event listeners
startBtn.addEventListener('click', () => startQuiz());
prevBtn.addEventListener('click', () => prevQuestion());
nextBtn.addEventListener('click', () => nextQuestion());

//Functions

function startQuiz() {
  //reset state
  userAnswers = new Array(questions.length).fill(null);
  currentIndex = 0;
  resultEl.innerHTML = '';
  startScreen.style.display = 'none';
  quizScreen.style.display = 'block';
  nextBtn.disabled = false;
  prevBtn.disabled = false;
  loadQuestion(currentIndex);
}

function loadQuestion(index) {
  // clear old timer
  clearInterval(timer);
  timeLeft = TIME_PER_Q;
  timerEl.textContent = timeLeft;
  timer = setInterval(countdown, 1000);

  // show question + options
  const q = questions[index];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';

  q.options.forEach(optText => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';
    btn.textContent = optText;

    // mark selected if user already answered
    if (userAnswers[index] === optText) btn.classList.add('selected');

    btn.addEventListener('click', () => {
      // mark selection
      userAnswers[index] = optText;
      // reflect UI selected state
      Array.from(optionsEl.children).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // small delay then auto-advance (gives a moment of feedback)
      clearInterval(timer);
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          currentIndex++;
          loadQuestion(currentIndex);
        } else {
          showResult();
        }
      }, 350);
    });

    optionsEl.appendChild(btn);
  });

  // update progress display
  qIndexEl.textContent = index + 1;

  // enable/disable nav buttons
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === questions.length - 1 && userAnswers[index] == null; // if last & unanswered, Next won't help
}

function countdown() {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    // if time ends and it's the last question, show result, otherwise go next
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      loadQuestion(currentIndex);
    } else {
      showResult();
    }
  }
}

function nextQuestion() {
  // manual next: stop timer and move forward
  clearInterval(timer);
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion(currentIndex);
  } else {
    showResult();
  }
}

function prevQuestion() {
  clearInterval(timer);
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion(currentIndex);
  }
}

function showResult() {
  clearInterval(timer);
  // compute score
  const score = userAnswers.reduce((acc, ans, i) => (ans === questions[i].answer ? acc + 1 : acc), 0);

  // message logic: success if >= half
  const passThreshold = Math.ceil(questions.length / 2);
  const message = score >= passThreshold
    ? `🎉 Congratulations! You did amazing!`
    : `😂 Try Again! Better luck next time.`;

  // render result with two buttons: Play Again (starts immediately) and Back to Home (start screen)
  resultEl.innerHTML = `
    <div class="result-card">
      <p style="font-weight:800; font-size:1.05rem;">${message}</p>
      <p>You scored <strong>${score}</strong> out of <strong>${questions.length}</strong>.</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:10px;">
        <button id="playAgainBtn" class="btn">🔄 Play Again</button>
        <button id="backHomeBtn" class="btn">🏠 Back to Start</button>
      </div>
    </div>
  `;

  // disable navigation while result showing
  nextBtn.disabled = true;
  prevBtn.disabled = true;

  // hook up the newly created buttons
  document.getElementById('playAgainBtn').addEventListener('click', () => {
    // reset answers and start quiz immediately
    userAnswers = new Array(questions.length).fill(null);
    currentIndex = 0;
    resultEl.innerHTML = '';
    loadQuestion(currentIndex);
  });

  document.getElementById('backHomeBtn').addEventListener('click', () => {
    // reset and show start screen
    userAnswers = new Array(questions.length).fill(null);
    currentIndex = 0;
    resultEl.innerHTML = '';
    quizScreen.style.display = 'none';
    startScreen.style.display = 'block';
  });
}

//Optional: keyboard navigation (left/right)
document.addEventListener('keydown', (e) => {
  if (quizScreen.style.display === 'block') {
    if (e.key === 'ArrowLeft') prevQuestion();
    if (e.key === 'ArrowRight') nextQuestion();
  }
});