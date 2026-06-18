let secretNumber = createSecretNumber();
let tries = 0;

function createSecretNumber() {
  return Math.floor(Math.random() * 20) + 1;
}

function updateTries() {
  document.querySelector("#tries-count").textContent = `已猜 ${tries} 次`;
}

function showMessage(message) {
  document.querySelector("#game-message").textContent = message;
}

function restartGame() {
  secretNumber = createSecretNumber();
  tries = 0;
  updateTries();
  showMessage("新数字已经准备好，请输入一个数字。");
  document.querySelector("#guess-input").value = "";
  document.querySelector("#guess-input").focus();
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#guess-form");
  const input = document.querySelector("#guess-input");
  const restartButton = document.querySelector("#restart-button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const guess = Number(input.value);

    if (!Number.isInteger(guess) || guess < 1 || guess > 20) {
      showMessage("请输入 1 到 20 之间的整数。");
      return;
    }

    tries += 1;
    updateTries();

    if (guess === secretNumber) {
      showMessage(`猜对了！答案就是 ${secretNumber}，你一共猜了 ${tries} 次。`);
      return;
    }

    if (guess > secretNumber) {
      showMessage("猜大了，再小一点。");
    } else {
      showMessage("猜小了，再大一点。");
    }
  });

  restartButton.addEventListener("click", restartGame);
});
