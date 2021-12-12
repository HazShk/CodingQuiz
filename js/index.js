"use strict";

// selecting elements
const questContainer = document.querySelector(".question-container");
const startingPage = document.querySelector(".starting-page");
const startBtn = document.querySelector(".btn-start");
const timerShow = document.querySelector(".timer");
const quizEndScreen = document.querySelector(".quiz-end");
const scoreShow = document.querySelector(".score");
const btnHome = document.querySelectorAll(".btn-home");
const btnRetry = document.querySelector(".btn-retry");
const btnHighScore = document.querySelector(".viewHighScoreButton");
const hsTableContainer = document.querySelector(".highScoreTable-container");
const hsTableBody = document.querySelector(".table-body");

// global variables

let allQuests = [
  {
    id: 1,
    question: "What is the full form of JS?",
    options: ["JavaSerialization", "JavaSet", "JavaScript", "JoyStick"],
    answer: "JavaScript",
  },
  {
    id: 2,
    question: "Which one is 'function declaration'?",
    options: [
      "var func = function(){}",
      "var func = () => {}",
      "(function(){})",
      "function func(){}",
    ],
    answer: "function func(){}",
  },
  {
    id: 3,
    question: "What is the syntax for arrow function?",
    options: [
      "var func = () => {}",
      "var func = function(){}",
      "(function(){})",
      "function func(){}",
    ],
    answer: "var func = () => {}",
  },
  {
    id: 4,
    question: "The condition in a while loop is inclosed with",
    options: ["Square brackets", "Paranthesis", "Curly brackets", "Qoutes"],
    answer: "Paranthesis",
  },
  {
    id: 5,
    question: "Is JavaScript case-sensetive?",
    options: ["Yes", "No"],
    answer: "Yes",
  },
  {
    id: 6,
    question: "JavaScript and Java is same.",
    options: ["True", "False"],
    answer: "False",
  },
  {
    id: 7,
    question: "What is the way of declaring a variable in JS?",
    options: [
      "v name = Max",
      "variable name = Max",
      "v:name = Max",
      "var name = Mark",
    ],
    answer: "var name = Mark",
  },
  {
    id: 8,
    question: "Which tag is used to include JS in HTML?",
    options: ["form", "script", "span", "scripting"],
    answer: "script",
  },
  {
    id: 9,
    question: "Which operator is used to assign a value to a variable?",
    options: ["=", "$", "-", "*"],
    answer: "=",
  },
  {
    id: 10,
    question: "Does external JS need script tag?",
    options: ["Yes", "No"],
    answer: "No",
  },
];
let answeredQuestions = 0;
let gamePlaying = false;
let time = 100;
let answers = [];
let timerInterval;
let orderOfQuest;
let correctAns = 0;
let wrongAns;
let score;

// generate order
const generateOrder = function () {
  // settting it again to empty
  orderOfQuest = [];
  for (let i = 0; i < allQuests.length; i++) {
    // gettin the random num
    let randNum = Math.floor(Math.random() * 10);
    // checking if the number already is on the array
    if (!orderOfQuest.includes(randNum)) {
      // if not then adding it to the array
      orderOfQuest.push(randNum);
    } else {
      // else repeating the exact step of the loop again
      i -= 1;
    }
  }
};

// add question to the dom
const addToDom = function () {
  // getting a random question data
  const questData = allQuests[orderOfQuest[answeredQuestions]]; // orderOfQuest[answeredQuestions] gets the random number sequentially
  // generting the html for this question
  const quesHtml = generateQuestionHtml(questData);

  // adding the html to the questions container
  questContainer.insertAdjacentHTML("afterbegin", quesHtml);

  // attaching event to the question option
  attachEvent(questData.answer);
};

// for starting the quiz
const startQuiz = function () {
  // random order generator
  generateOrder();

  // adding to the dom
  addToDom();
};

// adding event listener func
const attachEvent = function (ans) {
  // getting the ul and then adding the click event to it
  document.querySelector(".options").addEventListener("click", function (e) {
    // checking if the click happend on a button inside ul
    if (e.target.classList.contains("btn-option")) {
      // if so, checking the ans
      checkAns(e.target, ans);
    }
  });
};

// for ending the quiz
const showEnd = function () {
  // setting display to none for question container
  questContainer.style.display = "none";
  // setting the display to block for end screen
  quizEndScreen.style.display = "block";

  // showing the score on end screen
  scoreShow.innerHTML = `${score}/${allQuests.length * 10}`;
};

// function for checking ans
const checkAns = function (btn, ans) {
  // getting the ans status
  let ansStatus = document.querySelector(".ans-status");

  //checking if the ans and btn clicked's value is same
  if (btn.value === ans) {
    // if same then setting the status to correct by adding ans-correct class and removing the wrong status class
    ansStatus.classList.add("ans-correct");
    ansStatus.classList.remove("ans-wrong");

    answers.push(1); // 1 is for correct ans
  } else {
    // vice versa here
    ansStatus.classList.add("ans-wrong");
    ansStatus.classList.remove("ans-correct");

    answers.push(0); // 0 is for wrong ans
    if (time > 10) {
      time -= 10;
      timerShow.innerHTML = time;
    } else {
      time = 0;
    }
  }
  // increamenting the answered questions here
  answeredQuestions++;

  // getting the current question present on the questions container
  let currentQuestion = document.querySelector(".question-block");
  // removing it
  questContainer.removeChild(currentQuestion);

  // checking if the user answerd all 10 questions
  if (answeredQuestions === 10) {
    // resetting everything
    clearInterval(timerInterval);
    // saving the score on the local storage
    setLocalStorage();
    showEnd();
    answers = [];
    answeredQuestions = 0;
    gamePlaying = false;
    // terminating the quiz
    return;
  }

  // adding to the dom
  addToDom();
};

// for generating the question html block
const generateQuestionHtml = function (quest) {
  // html for options
  let optionsHtml = ``;
  // generting option's html for every option
  quest.options.forEach((opt, i) => {
    // adding the generated string to the options html string
    optionsHtml += `
    <li class="option option${i + 1}">
      <button class="btn btn-option" type="button" value="${opt}">
        ${i + 1}. ${opt}
      </button>
    </li>`;
  });

  // full question block html
  const questHtml = `<div class="question-block">
                        <h1 class="question title">${quest.question}</h1>
                        <div class="option-n-nextBtn">
                          <ul class="options">
                            ${optionsHtml}
                          </ul>
                        </div>
                      </div>`;

  return questHtml;
};

// setting the local storage
const setLocalStorage = function () {
  // getting the previous scores array
  const prevScores = JSON.parse(localStorage.getItem("quizScore"));
  // calculating answers
  correctAns = answers.filter((ans) => ans === 1).length;
  wrongAns = allQuests.length - correctAns;
  score = correctAns * 10;

  // generating dates
  const date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let sec = date.getMinutes();

  // making the new score obj
  const scoreObj = {
    correctAns,
    wrongAns,
    score,
    time: `${hour}:${minute}:${sec}`,
  };

  // checking if the prevScores exists
  if (prevScores) {
    // if so then pushing score score obj to it
    prevScores.push(scoreObj);
    // saving the array with another score obj to the local storage after stringifying it
    localStorage.setItem("quizScore", JSON.stringify(prevScores));
  } else {
    // else
    // saving a new array to the local storage after stringifying it
    localStorage.setItem("quizScore", JSON.stringify([scoreObj]));
  }
};

// for getting from the local storage
const getLocalStorage = function () {
  // getting the array from the local storage
  let allScores = JSON.parse(localStorage.getItem("quizScore"));

  // sorting it
  let sortedSc = allScores.sort((a, b) => b.score - a.score);
  return sortedSc;
};

// for showing the high scores
const showHighScores = function () {
  // getting the scores arr
  const scoresArr = getLocalStorage();
  // setting the innerHTML of the high score table body to empty sring
  hsTableBody.innerHTML = "";

  // genereting and then adding the html to the table body for each of the score obj on the array
  scoresArr.forEach((sc, i) => {
    const scTr = `<tr>
                    <td>${i + 1}</td>
                    <td>${sc.correctAns}</td>
                    <td>${sc.wrongAns}</td>
                    <td>${sc.score}</td>
                    <td>${sc.time}</td>
                  </tr>`;

    hsTableBody.insertAdjacentHTML("beforeend", scTr);
  });
};

// for starting the timer
const startTimer = function () {
  // initializing the time variable
  time = 100;

  // setting the innerHTML of the timerShow to time
  timerShow.innerHTML = time;
  // setting the interval
  timerInterval = setInterval(function () {
    time--;
    timerShow.innerHTML = time;

    // checking if the time hit 0
    if (time === 0) {
      // game over
      // removing the current visible question from the questions container
      let currentQuestion = document.querySelector(".question-block");
      questContainer.removeChild(currentQuestion);

      // clearing the interval
      clearInterval(timerInterval);

      // setting the gamplay status to false
      gamePlaying = false;

      // hiding the question container
      questContainer.style.display = "none";

      // showing the end screen
      showEnd();
    }
  }, 1000);
};

// start button click handler
startBtn.addEventListener("click", function (e) {
  // hidign the home page and showing the question block
  startingPage.style.display = "none";
  questContainer.style.display = "block";

  // starting the quiz
  startQuiz();

  // game status to true
  gamePlaying = true;
  // starting the time
  startTimer();
});

// every home btn click event handler
btnHome.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    // hiding the quiz and table screen and showing the starting page
    quizEndScreen.style.display = hsTableContainer.style.display = "none";
    startingPage.style.display = "block";
  })
);

// retry btn click handler
btnRetry.addEventListener("click", function (e) {
  // hiding the end screen and showing the quiz container
  quizEndScreen.style.display = "none";
  questContainer.style.display = "block";

  // generating new order
  generateOrder();
  // starting the quiz again by adding to the dom
  addToDom();
  // starting the timer again
  startTimer();
});

btnHighScore.addEventListener("click", function (e) {
  // preventing the default behaviour of the link
  e.preventDefault();
  // if game is going on
  if (gamePlaying) {
    alert("please finish the current quiz first");
    return;
  }

  // hiding every other screen
  quizEndScreen.style.display =
    questContainer.style.display =
    startingPage.style.display =
      "none";

  // showing the high score screen
  hsTableContainer.style.display = "block";
  // showing the high scores on that screen
  showHighScores();
});
