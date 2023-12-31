// Define all variables to point to HTML ID's
let startContainer = $("#starter-container");
let questionContainer = $("#question-container");
let endContainer = $("#end-container");
let highScoreContainer = $("#high-score-container");
let scoreContainer = $("#score-banner");
let correctEl = $("#correct");
let wrongEl = $("#wrong");
let usernameFieldEl = $("#username-form");
let rickdiv = $("#rickdiv");
let grimaceButton = $("#grimaceButton");

// Define all variables to point to the buttons of start quiz, go back, and clear high scores
let startBtn = $("#start-game");
let goBackBtn = $("#go-back");
let clearHighScoreBtn = $("#clear-high-scores");

// Define variables to point to questions, answers, timer
let questionsEl = $("#question");
let answersEl = $("#answer-buttons");

// Define base starting variables like score, time left, game over state
let timerEl = $("#timer");
let score = 0;
timerEl.text("0");
let gameover = "";
let timeLeft;

// Variables associated with highscores and define an array to store high scores
let viewHighScoreEl = $("#view-high-scores");
let listHighScoreEl = $("#high-score-list");
let initialsFormEl = $("#initials-form");
let highScores = [];
let submitScoreEl = $("#submit-score");

// We will be using an array to shuffle questions
let arrayShuffleQuestions = [];
let initQuestionIndex = 0;

// These are the variables associated with the GitHub API functionality
let usernameField = $("#username-input");
let passEl = $("#passed");
let failEl = $("#failed");
const collaboratorLogins = [];

// JokeAPI Variables
let hintButton = $("#hint-button");
let hintElement = $("#hint");

// ------------------------------------------------------------------------------------------------------------
// This section contains the code and functions for the base quiz functionality
// The questions will be stored in an array with each index holding the object of question, answer, and choices
let questions = [
  {
    q: "Where does the President of the United States live while in office?",
    a: "B. The White House",
    choices: [
      { choice: "A. Trump Tower" },
      { choice: "B. The White House" },
      { choice: "C. The Capitol Building" },
      { choice: "D. The Naval Observatory" },
    ],
  },
  {
    q: "How many days are in a year usually?",
    a: "C. 365",
    choices: [
      { choice: "A. 366" },
      { choice: "B. 364" },
      { choice: "C. 365" },
      { choice: "D. 363" },
    ],
  },
  {
    q: "Who is Batman`s crime-fighting partner?",
    a: "A. Robin",
    choices: [
      { choice: "A. Robin" },
      { choice: "B. Batgirl" },
      { choice: "C. Alfred" },
      { choice: "D. Nightwing" },
    ],
  },
  {
    q: "How many planets are in our solar system?",
    a: "A. 8",
    choices: [
      { choice: "A. 8" },
      { choice: "B. 9" },
      { choice: "C. 7" },
      { choice: "D. 10" },
    ],
  },
  {
    q: "What is the largest mammal in the world?",
    a: "D. Blue Whale",
    choices: [
      { choice: "A. African Elephant" },
      { choice: "B. Polar Bear" },
      { choice: "C. Giraffe" },
      { choice: "D. Blue Whale" },
    ],
  },
  {
    q: "How many continents are there in the world?",
    a: "C. 7",
    choices: [
      { choice: "A. 5" },
      { choice: "B. 6" },
      { choice: "C. 7" },
      { choice: "D. 8" },
    ],
  },
  {
    q: "What is the largest organ of the human body?",
    a: "D. Skin",
    choices: [
      { choice: "A. Brain" },
      { choice: "B. Heart" },
      { choice: "C. Liver" },
      { choice: "D. Skin" },
    ],
  },
  {
    q: "How many months have 28 days?",
    a: "C. 12",
    choices: [
      { choice: "A. 1" },
      { choice: "B. 6" },
      { choice: "C. 12" },
      { choice: "D. 0" },
    ],
  },
  {
    q: "(True or False: On average, at least 1 person is killed by a drunk driver in the United States every hour.",
    a: "True",
    choices: [{ choice: "A. True" }, { choice: "B. False" }],
  },
  {
    q: "Name 3 Countries Fast!",
    a: "",
    choices: [{ choice: "A. True" }, { choice: "B. False" }],
  },
];

// Set timer function for quiz
let quizStartTime = function () {
  timeLeft = 30;

  let timerCountDown = setInterval(function () {
    timerEl.text(timeLeft);
    timeLeft--;

    if (gameover) {
      clearInterval(timerCountDown);
    }

    if (timeLeft < 0) {
      showScore();
      timerEl.text("0");
      clearInterval(timerCountDown);
    }
  }, 1000);
};

// create function to start the game

let startGame = function () {
  startContainer.addClass("is-hidden");
  startContainer.removeClass("show");
  questionContainer.addClass("show");
  questionContainer.removeClass("is-hidden");
  usernameFieldEl.addClass("is-hidden");
  hintButton.removeClass("is-hidden");
  arrayShuffleQuestions = questions.sort(() => Math.random() - 0.5);
  quizStartTime();
  setQuestions();
};

let resetAnswers = function () {
  while (answersEl.children().length > 0) {
    answersEl.children().remove();
  }
};

// function to hide other containers and show the questions container
let displayQuestions = function (index) {
  questionsEl.text(index.q);
  if (index.isWrittenResponse) {
    // For written response questions, create a textarea element instead of answer buttons
    let answerTextarea = $("<textarea></textarea>");
    answerTextarea.addClass("written-response");
    answersEl.append(answerTextarea);
  } else {
    // For multiple-choice questions, create answer buttons
    for (let i = 0; i < index.choices.length; i++) {
      let answerBtn = $("<button></button>");
      answerBtn.text(index.choices[i].choice);
      answerBtn.addClass("btn");
      answerBtn.addClass("answerbtn");
      answerBtn.on("click", answerCheck);
      answersEl.append(answerBtn);
    }
  }
};

let checkWrittenResponse = function () {
  // Get the user's written response from the textarea
  let userResponse = $(".written-response").val();
  // Check if the user's response is correct (for example, check if it contains three countries separated by commas)
  let correctResponse = "Country 1, Country 2, Country 3"; // Replace this with the correct response for your quiz
  if (userResponse === correctResponse) {
    answerCorrect();
    score = score + 10;
  } else {
    answerWrong();
    score = score - 3;
    timeLeft = timeLeft - 5;
  }
  initQuestionIndex++;
  if (initQuestionIndex < arrayShuffleQuestions.length) {
    setQuestions();
  } else {
    gameover = "true";
    showScore();
  }
};

let setQuestions = function () {
  resetAnswers();
  displayQuestions(arrayShuffleQuestions[initQuestionIndex]);
};

// display for if question is right or wrong

let answerCorrect = function () {
  correctEl.addClass("banner");
  correctEl.removeClass("is-hidden");
  wrongEl.removeClass("banner");
  wrongEl.addClass("is-hidden");
};

let answerWrong = function () {
  wrongEl.addClass("banner");
  wrongEl.removeClass("is-hidden");
  correctEl.addClass("is-hidden");
  correctEl.removeClass("banner");
};

// function checks if the selected answer matches the answer in the shuffled questions object
let answerCheck = function (event) {
  let selectedanswer = event.target;
  if (arrayShuffleQuestions[initQuestionIndex].isWrittenResponse) {
    // For written response questions, call the checkWrittenResponse function
    checkWrittenResponse();
  } else {
    // For multiple-choice questions, check if the selected answer is correct
    if (
      arrayShuffleQuestions[initQuestionIndex].a === $(selectedanswer).text()
    ) {
      answerCorrect();
      score = score + 10;
    } else {
      answerWrong();
      score = score - 3;
      timeLeft = timeLeft - 5;
    }
    initQuestionIndex++;
    if (initQuestionIndex < arrayShuffleQuestions.length) {
      setQuestions();
    } else {
      gameover = "true";
      showScore();
    }
  }
};

// function shows the score by hiding other containers
let showScore = function () {
  questionContainer.addClass("is-hidden");
  questionContainer.removeClass("show");
  endContainer.addClass("show");
  endContainer.removeClass("is-hidden");
  wrongEl.addClass("is-hidden");
  wrongEl.removeClass("banner");
  correctEl.addClass("is-hidden");
  correctEl.removeClass("banner");
  grimaceButton.removeClass("is-hidden");
  rickdiv.removeClass("is-hidden");

  checkCollaborator();

  let displayScore = $("<p></p>");
  displayScore.text("Your score is " + score + "!");
  $("#score-banner").append(displayScore);
};

let displayHighScores = function () {
  highScoreContainer.addClass("show");
  highScoreContainer.removeClass("is-hidden");
  gameover = "true";

  if (endContainer.hasClass("show")) {
    endContainer.removeClass("show").addClass("is-hidden");
  }

  if (startContainer.hasClass("show")) {
    startContainer.removeClass("show").addClass("is-hidden");
  }

  if (questionContainer.hasClass("show")) {
    questionContainer.removeClass("show").addClass("is-hidden");
  }

  if (correctEl.hasClass("show")) {
    correctEl.removeClass("show").addClass("is-hidden");
  }

  if (wrongEl.hasClass("show")) {
    wrongEl.removeClass("show").addClass("is-hidden");
  }
  rickdiv.addClass('is-hidden');
  grimaceButton.addClass('is-hidden')
};
// clears the scores both on the page and in local storage
// let clearScores = function() {
//   highScores= [];

//   listHighScoreEl.empty();
//   saveHighScore();

//   }

// resets the page back to the initial start
let resetToStart = function () {
  startContainer.addClass("show").removeClass("is-hidden");
  highScoreContainer.addClass("is-hidden").removeClass("show");
  questionContainer.addClass("is-hidden").removeClass("show");
  endContainer.addClass("is-hidden").removeClass("show");
  scoreContainer.addClass("is-hidden").removeClass("show");
  correctEl.addClass("is-hidden").removeClass("show");
  wrongEl.addClass("is-hidden").removeClass("show");
  gameover = "";
  timerEl.text("0");
  score = 0;
};

// loads the stored high scores and holds all the event listeners for the buttons
// loadHighScore()
startBtn.on("click", startGame);
submitScoreEl.on("click", displayHighScores);
viewHighScoreEl.on("click", displayHighScores);
goBackBtn.on("click", resetToStart);
// clearHighScoreBtn.on('click',clearScores)

// ------------------------------------------------------------------------------------------------------------
// This part of the code pulls the collaborators from the Github repository this will be used to compare against the entered
// Github username to determine if they pass or not
// We haven't learned how to use Node.js yet, which I'm reading is needed to securely store the key.
// Key will keep being auto-revoked by GitHub on pushing to GitHub

const token =
  "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";
gitHubURL = "https://api.github.com/repos/BaBread/RealWinners/collaborators";

$.ajax({
  url: gitHubURL,
  method: "GET",
  beforeSend: function (xhr) {
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  },
})
  .done(function (collaborators) {
    // Extract the login names of the collaborators and store in the array
    collaborators.forEach(function (collaborator) {
      collaboratorLogins.push(collaborator.login);
    });

    // Display the list of collaborators
    console.log("Collaborators:", collaboratorLogins);
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.error("Error fetching collaborators from GitHub API:", errorThrown);
  });

let checkCollaborator = function () {
  let isMatch = collaboratorLogins.includes(usernameField.val());

  if (isMatch) {
    passEl.addClass("show");
    passEl.removeClass("is-hidden");
    failEl.addClass("is-hidden");
    failEl.removeClass("show");
  } else {
    passEl.addClass("is-hidden");
    passEl.removeClass("show");
    failEl.addClass("show");
    failEl.removeClass("is-hidden");
  }
};

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// This part of the code pulls the JokeAPI

$(document).ready(function () {
  // function that handles the click event
  function handleClick() {
    // ajax request to the jokes api with safemode enabled for sfw jokes
    hintElement.removeClass('is-hidden')
    $.ajax({
      url: "https://v2.jokeapi.dev/joke/Misc,Programming?format=json&safe-mode&type=single",
      method: "GET",
      success: function (response) {
        hintElement.text(response.joke);
      },
      error: function (xhr, status, error) {
        console.log("Error:", error);
        hintElement.text("Failed to fetch joke from the API.");
      },
    });
  }

  // adds event listener for the click event on the hint button
  hintButton.on("click", handleClick);
});

//--------------------------------------------------------------------------------------------------------
// new rick roll code
document.getElementById("rickroll").addEventListener("click", function (event) {
  event.preventDefault();
  const url = this.href;
  window.open(url, "_blank", "width=800,height=600");
});

// New grimace code
document.getElementById("grimaceButton").addEventListener("click", function () {
  const newWindow = window.open("", "_blank", "fullscreen=yes");
});
// newWindow.document.write(
//   `<img src="./assets/images/grimace.jpg" style="width: 100%; height: 100%;" />`
// );

// /------------------------------------------------------------------------------------------------
//adds event listener for grimace and hides id=lastContainer until gameover
// const lastContainer = document.getElementById("lastContainer");

// let showLastContainer = function () {};

// const grimaceButton = document.getElementById("grimace");
// const grimaceImage = document.getElementById("grimace-image");

// grimaceButton.addEventListener("click", function () {
//   if (grimaceImage.style.display === "none") {
//     grimaceImage.style.display = "block";
//   } else {
//     grimaceImage.style.display = "none";
//   }
// });

// the code for the youtube api that would not work:point_down::sweat:. Issues loading the video consistently
// also cannot embed the way we wanted it to due to copyright concerns on the video
//o-YBDTqX_ZU
// function onPlayerReady(event) {
//   document.querySelector("#player").addEventListener("click", function () {
//     event.target.playVideo();
//   });
// }
// rickvid.addEventListener("click", function () {
//   console.log("clicked!");
//insert play function
//   // Load the YouTube Iframe API
//   var tag = document.createElement("script");
//   tag.src =
//     "https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UC2eEHetmyPERpOQzJzEdZpA&maxResults=1&order=viewCount&key=AIzaSyDZbbPr0Mdly1jEEnY-bNZTl9UoKK5d0PA";
//   var firstScriptTag = document.getElementsByTagName("script")[0];
//   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//   // Event handler for when the YouTube Iframe API is ready
//   window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
//});
