
// ============================
// 8BIT JANKEN SURVIVAL
// ============================

const titleScreen = document.getElementById("title-screen");
const battleScreen = document.getElementById("battle-screen");
const clearScreen = document.getElementById("clear-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const clearRestartBtn = document.getElementById("clear-restart-btn");

const playerHand = document.getElementById("player-hand");
const cpuHand = document.getElementById("cpu-hand");
const message = document.getElementById("message");

const streakCount = document.getElementById("streak-count");
const meterCells = document.querySelectorAll(".meter-cell");
const roundDisplay = document.getElementById("round");

const handButtons = document.querySelectorAll(".hand-btn");

// ゲームデータ
let streak = 0;
let round = 1;
let gameFinished = false;

// 手のデータ
const hands = {
    gu: {
        emoji: "✊",
        name: "GU"
    },
    choki: {
        emoji: "✌",
        name: "CHOKI"
    },
    pa: {
        emoji: "✋",
        name: "PA"
    }
};

// ============================
// SCREEN CONTROL
// ============================

function showScreen(screen) {
    titleScreen.classList.add("hidden");
    battleScreen.classList.add("hidden");
    clearScreen.classList.add("hidden");

    screen.classList.remove("hidden");
}

// START
startBtn.addEventListener("click", startGame);

// ============================
// BATTLE
// ============================

handButtons.forEach(button => {
    button.addEventListener("click", () => {

        if (gameFinished) return;

        const playerChoice = button.dataset.hand;

        const choices = ["gu", "choki", "pa"];

        const cpuChoice =
            choices[Math.floor(Math.random() * choices.length)];

        playGame(playerChoice, cpuChoice);
    });
});

function playGame(player, cpu) {

    // 手を表示
    playerHand.textContent = hands[player].emoji;
    cpuHand.textContent = hands[cpu].emoji;

    // ボタンを一時停止
    handButtons.forEach(button => {
        button.disabled = true;
    });

    // 勝敗判定
    if (player === cpu) {

        // DRAW
        message.textContent = "DRAW! STAY!";
        message.className = "message draw";

    } else if (
        (player === "gu" && cpu === "choki") ||
        (player === "choki" && cpu === "pa") ||
        (player === "pa" && cpu === "gu")
    ) {

        // WIN
        streak++;

        message.textContent = "YOU WIN!!";
        message.className = "message win";

    } else {

        // LOSE
        streak = 0;

        message.textContent = "YOU LOSE...";
        message.className = "message lose";
    }

    // メーター更新
    updateMeter();

    // 最高記録を更新したかチェック
    if (streak > bestScore) {
        bestScore = streak;
        localStorage.setItem("jankenBestScore", bestScore);
        updateBestScore();
    }

    // 10連勝達成
    if (streak >= 10) {

        gameFinished = true;

        setTimeout(() => {
            showScreen(clearScreen);
        }, 1200);

        return;
    }

    // 次の対戦へ
    if (streak === 0 && message.classList.contains("lose")) {
        nextBtn.classList.add("hidden");
        restartBtn.classList.remove("hidden");
    } else {
        nextBtn.classList.remove("hidden");
    }
}

// ============================
// STREAK METER
// ============================

function updateMeter() {

    streakCount.textContent = streak;

    meterCells.forEach((cell, index) => {

        if (index < streak) {
            cell.classList.add("active");
        } else {
            cell.classList.remove("active");
        }

    });
}

// ============================
// NEXT BATTLE
// ============================

nextBtn.addEventListener("click", () => {

    round++;

    roundDisplay.textContent = round;

    resetBattle();

});

function resetBattle() {

    playerHand.textContent = "?";
    cpuHand.textContent = "?";

    message.textContent = "SELECT YOUR HAND";
    message.className = "message";

    handButtons.forEach(button => {
        button.disabled = false;
    });

    nextBtn.classList.add("hidden");
    restartBtn.classList.add("hidden");
}

// ============================
// RESTART
// ============================

restartBtn.addEventListener("click", () => {
    startGame();
});

clearRestartBtn.addEventListener("click", () => {
    startGame();
});


let bestScore = Number(localStorage.getItem("jankenBestScore")) || 0;

const bestScoreDisplay = document.getElementById("best-score");

function updateBestScore() {
    bestScoreDisplay.textContent = bestScore;
}

function startGame() {
    streak = 0;
    round = 1;
    gameFinished = false;

    updateMeter();
    updateBestScore();

    roundDisplay.textContent = round;

    resetBattle();

    showScreen(battleScreen);
}
