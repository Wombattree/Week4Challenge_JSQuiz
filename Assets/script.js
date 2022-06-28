var startQuizButton = document.getElementById("startQuizButton");
var viewHighScoresButton = document.getElementById("viewHighScoresButton");
var quizQuestionElement = document.getElementById("quizQuestion");
var quizOptionsElement = document.getElementById("quizOptions");
var quizResponseElement = document.getElementById("quizResponse");
var quizScoreElement = document.getElementById("quizScore");

var timerElement = document.getElementById("timer");

var enterInitialsTextElement = document.getElementById("enterInitialsText");
var displayScoreAtGameOverElement = document.getElementById("displayScoreAtGameOver");

var gameOverTitleElement = document.getElementById("gameOverTitle");
var submitHighScoreButton = document.getElementById("submitHighScoreButton");
var skipSubmittingHighScoreButton = document.getElementById("skipSubmittingHighScoreButton");
var highScoresListElement = document.getElementById("highScoreList");
var thereAreNoHighScoresElement = document.getElementById("thereAreNoHighScores");
var playAgainButton = document.getElementById("playAgainButton");
var returnToMenuButton = document.getElementById("returnToMenuButton");
var clearHighScoresButton = document.getElementById("clearHighScoresButton");

var mainScreenCard = document.getElementById("mainScreen");
var quizScreenCard = document.getElementById("quizScreen");
var enterHighScoreScreenCard = document.getElementById("enterHighScoreScreen");
var displayHighScoreScreenCard = document.getElementById("displayHighScoreScreen");

var timeLeft;
var timerFunction;

var questions = [];
var currentQuestionIndex;

var currentScore;

var currentScreen;
var screens = ["MainScreen", "QuizScreen", "EnterHighScore", "DisplayHighScore"];

var highScores = [];

var highScore = 
{
    initials: "",
    score: 0
}

var question = 
{
    questionTitle: "",
    possibleAnswers: [],
    correctAnswerIndex: -1
}

function Init()
{
    UpdateScreen(0);
    CreateQuestions();
    GetSavedHighScores();
}

function UpdateScreen(screenIndex)
{
    currentScreen = screens[screenIndex];
    DisplayCurrentScreen();
}

function DisplayCurrentScreen()
{
    mainScreenCard.setAttribute("class", "card " + (currentScreen === screens[0] ? "display" : "hide"));
    quizScreenCard.setAttribute("class", "card " + (currentScreen === screens[1] ? "display" : "hide"));
    enterHighScoreScreenCard.setAttribute("class", "card " + (currentScreen === screens[2] ? "display" : "hide"));
    displayHighScoreScreenCard.setAttribute("class", "card " + (currentScreen === screens[3] ? "display" : "hide"));
}

function CreateQuestions()
{
    questions.push(CreateQuestion(
        "Are ternary operators incredibly sexy?", 
        ["Absolutely", "No, it is better to take up lots of room", "What's a ternary operator?"], 0));

    questions.push(CreateQuestion(
        "A for loop inside of a for loop is called a ___", 
        ["Parented for loop", "Bubbled for loop", "Nested for loop", "Multiple for loops in a trench coat"], 2));

    questions.push(CreateQuestion(
        "When attacked by a large bear, what Javascript method can help you?", 
        ["element.addEventListener()", "array.push()", "No Javascript functions can help you in this situation", "Bears aren't real"], 2));

    questions.push(CreateQuestion(
        "The method to add a new element to the end of an array is called ___", 
        ["array.extend()", "array.push()","array.add()", "array.makeBigger()"], 1));

    questions.push(CreateQuestion(
        "The methods for adding a new div to the page through JavaScript are ___",
        ["document.addElement(div) and element.setChild()", "document.createElement(\"div\") and element.setChild()", "document.createElement(\"div\") and element.appendChild()",], 2));

    questions.push(CreateQuestion(
        "Starting your methods and functions with lower case is ___", 
        ["Essentially a war crime", "Perfectly acceptable", "A great idea", "You should use underscores instead"], 0));

    function CreateQuestion(questionTitle, possibleAnswers, correctAnswerIndex)
    {
        var newQuestion = Object.create(question);
        newQuestion.questionTitle = questionTitle;
        newQuestion.possibleAnswers = possibleAnswers;
        newQuestion.correctAnswerIndex = correctAnswerIndex;
        return newQuestion;
    }
}

function GetSavedHighScores()
{
    let savedHighScores = JSON.parse(localStorage.getItem("highScores"));
    if (savedHighScores != null)
    {
        highScores = savedHighScores;
    }
}

function StartQuiz()
{
    Reset();
    UpdateScreen(1);
    GetNewQuestion();
    EndCountdown();
    StartCountdown();
}

function Reset()
{
    currentScore = 0;
    currentQuestionIndex = -1;
    quizResponseElement.textContent = "";
    quizScoreElement.textContent = "Current Score: " + currentScore;
}

function GetNewQuestion()
{
    GetNextQuestionIndex();
    DisplayCurrentQuestion(questions[currentQuestionIndex]);
}

function GetNextQuestionIndex()
{
    if (currentQuestionIndex < questions.length - 1) currentQuestionIndex++;
    else QuizOver(true);
}

function DisplayCurrentQuestion(question)
{
    quizQuestionElement.textContent = GetCurrentQuestionInfo("QuestionTitle");

    quizOptionsElement.innerHTML = "";

    for (let i = 0; i < question.possibleAnswers.length; i++) 
    {
        let newLi = document.createElement("li");
        newLi.textContent = question.possibleAnswers[i];
        newLi.setAttribute("class", "questionOption");
        newLi.setAttribute("data-index", i);
        newLi.addEventListener("click", CheckAnswer);
        quizOptionsElement.appendChild(newLi);
    }
}

function EndCountdown()
{
    clearInterval(timerFunction);
    timerElement.textContent = "";
}

function StartCountdown()
{
    timeLeft = 30;
    timerElement.textContent = timeLeft + " seconds remaining";
    timerFunction = setInterval(TickTimer, 1000);
}

function TickTimer()
{
    timeLeft--;
    UpdateCountdown();
}

function UpdateCountdown()
{
    timerElement.textContent = timeLeft + " second" + (timeLeft > 1 ? "s" : "") + " remaining";

    if (timeLeft <= 0)
    {
        QuizOver(false);
        return false;
    }
    return true;
}

function GetCurrentQuestionInfo(info)
{
    switch(info)
    {
        case "QuestionTitle": return questions[currentQuestionIndex].questionTitle;
        case "PossibleAnswers": return questions[currentQuestionIndex].possibleAnswers;
        case "CorrectAnswerIndex": return questions[currentQuestionIndex].correctAnswerIndex;
        case "CorrectAnswer": return questions[currentQuestionIndex].possibleAnswers[questions[currentQuestionIndex].correctAnswerIndex];
        default: return;
    }
}

function CheckAnswer(event)
{
    let index = event.currentTarget.getAttribute("data-index");
    if (index == GetCurrentQuestionInfo("CorrectAnswerIndex")) CorrectAnswer();
    else IncorrectAnswer();
}

function CorrectAnswer()
{
    currentScore++;
    quizScoreElement.textContent = "Current Score: " + currentScore;
    quizResponseElement.textContent = "Correct!";
    GetNewQuestion();
}

function IncorrectAnswer()
{
    timeLeft -= 5;
    quizResponseElement.textContent = "Wrong, the corrent answer to: " + "\"" + GetCurrentQuestionInfo("QuestionTitle") + "\"" + " is: " + "\"" + GetCurrentQuestionInfo("CorrectAnswer") + "\"";
    //If the game hasn't ended then get a new question
    if (UpdateCountdown()) GetNewQuestion();
}

function QuizOver(gotAllQuestions)
{
    EndCountdown();
    gameOverTitleElement.textContent = gotAllQuestions ? "That's all the questions! Please enter your initials for the leaderboard:" : "Game Over! Please enter your initials for the leaderboard:";
    displayScoreAtGameOverElement.textContent = "You scored: " + currentScore;
    UpdateScreen(2);
}

function InitialsSubmited(event)
{
    event.preventDefault();
    if (enterInitialsTextElement.value === "") {console.log("Please enter your initials");}
    else
    {
        var newHighScore = Object.create(highScore);
        newHighScore.initials = enterInitialsTextElement.value.toUpperCase();
        newHighScore.score = currentScore;
        highScores.push(newHighScore);
        SaveHighScores();
        DisplayHighScores();
    }
}

function SaveHighScores()
{
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function DisplayHighScores()
{
    highScoresListElement.innerHTML = "";
    highScores = BubbleSortScores(highScores);

    thereAreNoHighScoresElement.textContent = highScores.length === 0 ? "There are no high scores, why are you here?" : "";

    for (let i = 0; i < highScores.length; i++) 
    {
        let newLi = document.createElement("li");
        newLi.textContent = highScores[i].initials + ": " + highScores[i].score;
        newLi.setAttribute("class", "highScoreList");
        highScoresListElement.appendChild(newLi);
    }
    UpdateScreen(3);
}

function BubbleSortScores(array)
{
    sortedArray = array;
    for (let i = 0; i < array.length; i++) 
    {
        for (let j = 0; j < array.length - i - 1; j++) 
        {
            if (array[j + 1].score > array[j].score)
            {
                [array[j + 1], array[j]] = [array[j], array[j + 1]]
            }
        }
    }
    return sortedArray;
}

function ReturnToMenu()
{
    EndCountdown();
    UpdateScreen(0);
}

function ViewHighScores()
{
    DisplayHighScores();
}

function ClearHighScores()
{
    localStorage.removeItem("highScores");
    highScores = [];
    DisplayHighScores();
}

startQuizButton.addEventListener("click", StartQuiz);
viewHighScoresButton.addEventListener("click", ViewHighScores);
submitHighScoreButton.addEventListener("click", InitialsSubmited);
skipSubmittingHighScoreButton.addEventListener("click", DisplayHighScores);
playAgainButton.addEventListener("click", StartQuiz);
returnToMenuButton.addEventListener("click", ReturnToMenu);
clearHighScoresButton.addEventListener("click", ClearHighScores);

Init();