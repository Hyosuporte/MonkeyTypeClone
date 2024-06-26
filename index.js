import { words as INITIAL_WORDS } from "./data.js";

const $time = document.querySelector("time");
const $paragraph = document.querySelector("p");
const $input = document.querySelector("input");

const INITIAL_TIME = 30;

let currentTime = INITIAL_TIME;
let words = [];
let playing;

function generateParagraph() {
  words = INITIAL_WORDS.toSorted(() => Math.random() - 0.5).slice(0, 50);

  $paragraph.innerHTML = words
    .map((word) => {
      const letters = word.split("");

      return `<word>
        ${letters.map((letter) => `<letter>${letter}</letter>`).join("")}
      </word>
      `;
    })
    .join("");

  const $firstWord = $paragraph.querySelector("word");
  $firstWord.classList.add("active");
  $firstWord.querySelector("letter").classList.add("active");
}

function timer(currentTime) {
  const intervalId = setInterval(() => {
    currentTime--;
    $time.textContent = currentTime;

    if (currentTime == 0) {
      clearInterval(intervalId);
    }
  }, 1000);
}

function onkeydown(event) {
  const $currentWord = $paragraph.querySelector("word.active");
  const $currentLetter = $paragraph.querySelector("letter.active");

  const { key } = event;
  console.log(key);

  if (key == " ") {
    event.preventDefault();
    const $nextWord = $currentWord.nextElementSibling;
    const $nextLetter = $nextWord.querySelector("letter");

    $currentWord.classList.remove("active");
    $currentLetter.classList.remove("active");

    $nextWord.classList.add("active");
    $nextLetter.classList.add("active");

    $input.value = "";

    const hasMissedLetters =
      $currentWord.querySelectorAll("letter:not(.correct)").length > 0;
    const classToAdd = hasMissedLetters ? "marked" : "correct";
    $currentWord.classList.add(classToAdd);
    return;
  }

  if (key == "Backspace") {
    const $preventWord = $currentWord.previousElementSibling;
    const $prevLetter = $currentLetter?.previousElementSibling;

    if (!$preventWord && !$prevLetter) {
      event.preventDefault();
      return;
    }

    const $wordMarked = $paragraph.querySelector("word.marked");
    if ($wordMarked && !$prevLetter) {
      event.preventDefault();
      $preventWord.classList.remove("marked");
      $preventWord.classList.add("active");

      const $letterToGo = $preventWord.querySelector("letter:last-child");

      $currentLetter.classList.remove("active");
      $letterToGo.classList.add("active");

      $input.value = [
        ...$preventWord.querySelectorAll("letter.correct, letter.incorrect"),
      ]
        .map(($el) => {
          return $el.classList.contains("correct") ? $el.innerText : "*";
        })
        .join("");
    }
  }
}

function onkeyUp() {
  const $currentWord = $paragraph.querySelector("word.active");
  const $currentLetter = $paragraph.querySelector("letter.active");

  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;

  const $allLetters = $currentWord.querySelectorAll("letter");

  $allLetters.forEach(($letter) =>
    $letter.classList.remove("correct", "incorrect")
  );

  $input.value.split("").forEach((char, index) => {
    const $letter = $allLetters[index];
    const letterToCheck = currentWord[index];

    const isCorrect = char === letterToCheck;
    const letterClass = isCorrect ? "correct" : "incorrect";
    $letter.classList.add(letterClass);
  });

  $currentLetter.classList.remove("active", "is-last");
  const inputLength = $input.value.length;
  const $nextActiveLetter = $allLetters[inputLength];

  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add("active");
  } else {
    $currentLetter.classList.add("active", "is-last");
  }
}

function initGame() {
  currentTime = INITIAL_TIME;
  $time.textContent = currentTime;
  timer(currentTime);
  generateParagraph();
  playing = false;
}

function initEvents() {
  document.addEventListener("keydown", () => {
    $input.focus();
  });

  $input.addEventListener("keydown", onkeydown);
  $input.addEventListener("keyup", onkeyUp);
}

initEvents();
initGame();
