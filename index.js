import csQuestion from "./computerSc.js";
import geoQuestion from "./geography.js";
import sportsQuestion from "./sports.js";

let questions;

const questionEle = document.getElementById("question");
const ansBtns = document.getElementById("ansBtns");
const nextBtn = document.getElementById("nextBtn");
const timerEle = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;

let radios = document.querySelectorAll('input[type="radio"]');
let isCheck = false;
let categoryVal;

radios.forEach((ele) => {
    ele.addEventListener("change", (e) => {
        // console.log(e.target.value);
        if (e.currentTarget.value) {
            isCheck = true;
            categoryVal = e.currentTarget.value;
        }
    });
});

startBtn.addEventListener("click", startFunc);

function startFunc() {
    if (isCheck) {
        document.querySelector(".showContent").style.display = "block";
        document.querySelector(".info").style.display = "none";

        if (categoryVal) {
            if (categoryVal === "Sports") {
                questions = sportsQuestion;
            } else if (categoryVal === "IT") {
                questions = csQuestion;
            } else if (categoryVal === "Geography") {
                questions = geoQuestion;
            }
            startQuiz();
        }
    } else {
        alert("Please Select a Category");
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextBtn.innerHTML = "Next";
    showQuestions();
    startTimer();
}

function resetState() {
    while (ansBtns.firstChild) {
        ansBtns.removeChild(ansBtns.firstChild);
    }
}

function showQuestions() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let qNo = currentQuestionIndex + 1;
    questionEle.innerHTML = qNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach((ans) => {
        const buttonEle = document.createElement("button");
        const iconEle = document.createElement("i");
        iconEle.style.float = "right";
        iconEle.style.position = "relative";
        iconEle.style.top = "4px";
        iconEle.style.display = "none";
        buttonEle.innerHTML = ans.text;
        buttonEle.classList.add("btn");

        if (ans.isCorrect) {
            buttonEle.dataset.ans = ans.isCorrect;
        }

        ansBtns.appendChild(buttonEle);
        buttonEle.appendChild(iconEle);
        buttonEle.addEventListener("click", selectedAnswer);
    });
}

function startTimer() {
    nextBtn.style.display = "none";
    document.querySelector("#timer").style.display = "block";
    timeLeft = 15;
    timerEle.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerEle.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            document.querySelector("#timer").style.display = "none";

            addStyleIntoBtn(ansBtns.children);
            nextBtn.style.display = "block";
        }
    }, 1000);
}

function selectedAnswer(e) {
    clearInterval(timer);

    // get selectedBtn eLement

    const SelectedBtnEle = e.currentTarget;
    // console.log('SelectedBtnEle 138===========>',SelectedBtnEle);

    // check if select btn dataset ans is true or not

    const corectBtn = SelectedBtnEle.dataset.ans === "true";
    console.log('Answer is========' + corectBtn);

    // if answer is wrong than answer showing with icon

    if (!corectBtn) {
        // console.log("SelectedBtnEle===========", SelectedBtnEle.children);
        SelectedBtnEle.classList.add("red");
        Array.from(SelectedBtnEle.children).forEach((child) => {
            child.style.display = "block";
            child.className = "fa-solid fa-circle-xmark";
        });
    } else {
        score++;
    }

    // if answer is wrong than right answer also show with icon if Selected answer is true than also show with icon

    addStyleIntoBtn(ansBtns.children);
    nextBtn.style.display = "block";
}

function addStyleIntoBtn(btnELement) {
    Array.from(btnELement).forEach((btn) => {
        if (btn.dataset.ans === "true") {
            btn.classList.add("green");

            Array.from(btn.children).forEach((child) => {
                child.style.display = "block";
                child.className = "fa-solid fa-circle-check";
            });
        }
        btn.disabled = true;
    });
}

function showScore() {
    resetState();
    document.querySelector("#timer").style.display = "none";
    document.querySelector(".showContent").style.display = "none";
    document.querySelector(".showScore").style.display = "block";
    document.querySelector('#scoreId').innerHTML = `You Scored ${score} out of ${questions.length}!`;
    document.querySelector('#restartBtn').innerHTML = "Play Again";
}

function handleNextBtn() {
    clearInterval(timer);
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestions();
        startTimer();
    } else {
        showScore();
    }
}

document.querySelector('#restartBtn').addEventListener('click', () => {
    document.querySelector(".info").style.display = "block";
    document.querySelector(".showContent").style.display = "none";
    document.querySelector(".showScore").style.display = "none";

    radios.forEach((ele) => {
        ele.checked = false;
    });
});

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextBtn();
    }
});