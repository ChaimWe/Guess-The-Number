const difficulty = document.getElementById("difficulty");
const difficultyValue = document.getElementById("difficultyValue");
const startGame = document.getElementById("startGame");
const tries = document.getElementById("tries");
const triesValue = document.getElementById("triesValue");
const game = document.getElementById("game");
const gameHistoryButton = document.getElementById("gameHistory");
let tryCounter = 1;
let number;

difficulty.addEventListener("input", () => {
  updateValue(difficulty, difficultyValue);
  difficultyValue.textContent = "level " + difficulty.value;
});

tries.addEventListener("input", () => {
  updateValue(tries, triesValue);
  if (tries.value % 2 == 0) {
    triesValue.textContent = tries.value / 2 + " tries";
  }
});

gameHistoryButton.addEventListener("click", () => {
  const gameHistory = document.createElement("div");
  gameHistory.innerHTML = localStorage.getItem("previousGames");
  document.body.appendChild(gameHistory);
});

const lastGame = document.createElement("div");
lastGame.id = "lastGame";

const observe = new MutationObserver((mutatuionsList) => {
  for (const mutation of mutatuionsList) {
    if (mutation.type === "childList") {
      mutation.removedNodes.forEach((node) => {
        if (node.id === "game") {
          lastGame.innerHTML = localStorage.getItem("lastGame");
          document.body.appendChild(lastGame);
          document.addEventListener("click", (e) => {
            if (e.target !== lastGame) {
              document.body.removeChild(lastGame);
            }
          });
        }
      });
    }
  }
});
observe.observe(document.body, { childList: true });

startGame.addEventListener("click", () => {
  number = Math.floor(Math.random() * (difficulty.value * 10));

  const game = document.createElement("div");
  game.id = "game";
  document.body.appendChild(game);

  const exit = document.createElement("button");
  exit.id = "exit";
  exit.textContent = "X";
  game.appendChild(exit);

  exit.addEventListener("click", () => {
    document.body.removeChild(game);
  });

  const gameHeader = document.createElement("h2");
  gameHeader.id = "gameHeader";
  gameHeader.textContent = `Guess a number between 0 (inclusive) and ${
    difficulty.value
  }0. You have ${tries.value / 2} tries.`;
  game.appendChild(gameHeader);

  const guessInput = document.createElement("input");
  guessInput.type = "number";
  guessInput.id = "guessInput";
  game.appendChild(guessInput);
  guessInput.focus();

  const guess = document.createElement("button");
  guess.textContent = "Guess";
  guess.id = "guess";
  game.appendChild(guess);

  const guessResponse = document.createElement("h2");
  guessResponse.id = "guessResponse";
  game.appendChild(guessResponse);

  const previousGuesses = document.createElement("ul");
  previousGuesses.id = "previousGuesses";
  game.appendChild(previousGuesses);

  const previousGames = document.createElement("li");
  previousGuesses.id = "previousGames";

  const clrAll = document.createElement("button");
  clrAll.id = "clrAll";
  clrAll.textContent = "Delete Previous Games";
  game.appendChild(clrAll);

  clrAll.addEventListener("click", () => {
    alert("Are you certain that you want to delete your game history?");
    previousGames.innerHTML = "<h3>Game History</h3>";
    localStorage.setItem("previousGames", previousGames.innerHTML);
  });

  game.appendChild(previousGames);
  previousGames.innerHTML = localStorage.getItem("previousGames");

  guessInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      guess.click();
    }
  });

  guess.addEventListener("click", () => {
    if (guessInput.value) {
      if (tryCounter < tries.value / 2) {
        if (guessInput.value < number) {
          guessResponse.innerText = `You're guess is BELOW the Number. ${
            tries.value / 2 - tryCounter
          } tries left`;

          const newGuess = document.createElement("li");
          newGuess.innerHTML = guessInput.value;
          previousGuesses.appendChild(newGuess);
        }
        if (guessInput.value > number) {
          guessResponse.innerText = `You're guess is BEYOND the Number. ${
            tries.value / 2 - tryCounter
          } tries left`;

          const newGuess = document.createElement("li");
          newGuess.innerHTML = guessInput.value;
          previousGuesses.appendChild(newGuess);
        }
        if (guessInput.value == number) {
          guessResponse.innerText = `You got it!!`;
        }
        tryCounter++;
      } else {
        guessResponse.innerText = "Your tries are maxed out";

        const newGame = document.createElement("li");
        newGame.innerHTML =
          "Correct Number was: " +
          number +
          `. You had ${tries.value / 2} tries.`;
        if (guessInput.value == number) {
          newGame.innerHTML += ` You got it in ${tryCounter} tries!`;
        } else {
          newGame.innerHTML += " You didn't get it on ";
        }
        newGame.innerHTML += new Date();
        localStorage.setItem("lastGame", newGame.innerHTML);

        previousGames.appendChild(newGame);
        localStorage.setItem("previousGames", previousGames.innerHTML);
        document.body.removeChild(game);
        tryCounter = 1;
      }
    } else {
      guessResponse.innerText = "Invalid entry";
    }
    guessInput.value = null;
  });

  game.addEventListener("click", (e) => {
    if (e.target === game) document.body.removeChild(game);
  });
});

function updateValue(slider, sliderVal) {
  const val = slider.value;
  const offset = val * (sliderVal.offsetWidth / 17);
  sliderVal.style.left = `${offset}%`;
}
