// Log localStorage values for debugging
console.log("Initial localStorage values:", {
    username: localStorage.getItem("username"),
    points: localStorage.getItem("points"),
    level: localStorage.getItem("level"),
    tokens: localStorage.getItem("tokens")
});

// Store user data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];

// Daily reset tracking
let lastAdClaim = parseInt(localStorage.getItem("lastAdClaim")) || 0;
let lastCheckInClaim = parseInt(localStorage.getItem("lastCheckInClaim")) || 0;
let lastSpinClaim = parseInt(localStorage.getItem("lastSpinClaim")) || 0;
let lastTaskClaims = JSON.parse(localStorage.getItem("lastTaskClaims")) || { youtube: 0, xAccount: 0, facebook: 0 };
let lastRewardsClaim = parseInt(localStorage.getItem("lastRewardsClaim")) || 0;

// Wheel data
const wheelRewards = [500, 1000, 1500, 2000, 2500, 3000];
const wheelColors = ["#FF4500", "#32CD32", "#1E90FF", "#FFD700", "#FF00FF", "#00CED1"];
let isSpinning = false;

// Game states
let penaltyGameActive = false;
let penaltyShotsTaken = 0;
let penaltyScore = 0;
let penaltyStreak = 0;
let penaltyMultiplier = 1;
let isSuddenDeath = false;
let gameOver = false;
let ballX = 200, ballY = 280, targetX, targetY;
let goalkeeperX = 200;
let isShooting = false;
let shotFrame = 0;
let goalkeeperDiveDirection = 'center';
let playerState = 'standing';
let feedbackMessage = '';
let feedbackTimer = 0;
let selectedPower = 'medium';
let shotDirection = null;
let ballRotation = 0;
let crowdCheer = true;
let celebrationTimer = 0;

let siuuuGameActive = false;
let siuuuScore = 0;
let siuuuStreak = 0;
let siuuuMultiplier = 1;
let siuuuTimeLeft = 2;
let siuuuTimerInterval = null;
let siuuuHighScore = parseInt(localStorage.getItem("siuuuHighScore")) || 0;
const siuuuWords = ["Siuuu!", "Ronaldo!", "Goal!", "Miss!", "CR7!"];
let currentSiuuuWord = "";
let isPaused = false;

let juggleGameActive = false;
let juggleCount = 0;
let juggleTimer = null;
let juggleWindow = 1000;
let lastJuggleTime = 0;

let triviaGameActive = false;
let triviaScore = 0;
let triviaStreak = 0;
let currentQuestionIndex = 0;
const triviaQuestions = [
    { question: "How many Ballon d'Or awards has Cristiano Ronaldo won as of 2025?", options: ["4", "5", "6", "7"], answer: "5" },
    { question: "Which club did Ronaldo join in 2009?", options: ["Barcelona", "Real Madrid", "Manchester United", "Juventus"], answer: "Real Madrid" },
    { question: "What is Ronaldo's jersey number?", options: ["7", "10", "9", "11"], answer: "7" },
    { question: "In which year did Ronaldo win his first Champions League title?", options: ["2008", "2010", "2006", "2014"], answer: "2008" },
    { question: "Which country does Ronaldo represent internationally?", options: ["Spain", "Brazil", "Portugal", "Argentina"], answer: "Portugal" },
    { question: "How many goals did Ronaldo score for Real Madrid?", options: ["350", "400", "450", "500"], answer: "450" },
    { question: "Which club did Ronaldo join after leaving Real Madrid in 2018?", options: ["Juventus", "PSG", "Manchester United", "Bayern Munich"], answer: "Juventus" },
    { question: "What is the name of Ronaldo's famous celebration?", options: ["Siuuu", "Dab", "Heart", "Dance"], answer: "Siuuu" },
    { question: "How many European Championships has Ronaldo won with Portugal?", options: ["0", "1", "2", "3"], answer: "1" },
    { question: "Which club did Ronaldo start his professional career with?", options: ["Sporting CP", "Benfica", "Porto", "Braga"], answer: "Sporting CP" },
    { question: "In which year did Ronaldo return to Manchester United?", options: ["2019", "2020", "2021", "2022"], answer: "2021" },
    { question: "Which league did Ronaldo join after Juventus?", options: ["Premier League", "La Liga", "Serie A", "Saudi Pro League"], answer: "Premier League" },
    { question: "What is Ronaldo's current club as of 2025?", options: ["Al-Nassr", "Manchester United", "Real Madrid", "Juventus"], answer: "Al-Nassr" },
    { question: "How many World Cup goals has Ronaldo scored as of 2025?", options: ["5", "7", "8", "10"], answer: "8" },
    { question: "Which brand is Ronaldo most associated with for his boots?", options: ["Adidas", "Nike", "Puma", "Under Armour"], answer: "Nike" }
];
let selectedAnswer = null;

// Show username setup if it's the user's first session
if (!username) {
    const setupElement = document.getElementById("username-setup");
    if (setupElement) {
        setupElement.classList.remove("hidden");
        const inputElement = document.getElementById("username-input");
        if (inputElement) inputElement.focus();
    }
} else {
    loadSession();
    checkForReferral();
}

function setUsername() {
    try {
        const input = document.getElementById("username-input").value.trim();
        if (input) {
            localStorage.setItem("username", input);
            username = input;
            console.log("Username set to:", input);
            loadSession();
        } else {
            alert("Please enter a valid username.");
        }
    } catch (e) {
        console.error("Error in setUsername:", e);
    }
}

function loadSession() {
    try {
        const setupElement = document.getElementById("username-setup");
        if (setupElement) setupElement.classList.add("hidden");

        const usernameDisplay = document.getElementById("username-display");
        if (usernameDisplay) usernameDisplay.textContent = username;

        const scoreDisplay = document.getElementById("score-display");
        if (scoreDisplay) scoreDisplay.textContent = `${currentPoints} CR7SIU Points`;

        const tokensDisplay = document.getElementById("tokens-display");
        if (tokensDisplay) tokensDisplay.textContent = currentTokens;

        const playerLevelDisplay = document.getElementById("player-level");
        if (playerLevelDisplay) playerLevelDisplay.textContent = playerLevel;

        const pointsDisplay = document.getElementById("cr7siu-points");
        if (pointsDisplay) pointsDisplay.textContent = currentPoints;

        displayImprovements();
        resetTasks();
        updateTaskButtons();
        displayReferrals();
        showPage('home');
    } catch (e) {
        console.error("Error in loadSession:", e);
    }
}

function showPage(page) {
    try {
        document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.remove("hidden");
            console.log(`Navigated to page: ${page}`);
        } else {
            console.error(`Page with id "${page}" not found.`);
        }
        if (page === "rewards") {
            drawWheel();
            updateSpinTimer();
        }
        if (page === "games") {
            initializeGameContainers();
        }
    } catch (e) {
        console.error("Error in showPage:", e);
    }
}

function initializeGameContainers() {
    try {
        const gamesContainer = document.getElementById("games-container");
        if (!gamesContainer) {
            console.error("games-container not found");
            return;
        }

        gamesContainer.innerHTML = `
            <div class="game-container" id="penalty-container">
                <h2>CR7 Penalty Shootout</h2>
                <p>Test your shooting skills with Ronaldo precision!</p>
                <canvas id="penaltyCanvas" width="400" height="300"></canvas>
                <div id="penalty-controls">
                    <button id="start-penalty-btn" onclick="startPenaltyShootout()">Start</button>
                    <button id="end-penalty-btn" onclick="endPenaltyShootout()" disabled>End</button>
                    <div id="game-score">Score: 0 | Streak: 0 | Multiplier: 1x</div>
                </div>
            </div>
            <div class="game-container" id="siuuu-container">
                <h2>SIUUU Reaction Tap</h2>
                <p>Tap "Siuuu!" as fast as you can!</p>
                <div id="siuuu-word-display">---</div>
                <div id="siuuu-timer">Time Left: 2.0s</div>
                <div id="timer-progress-bar" style="width: 100%;"></div>
                <div id="siuuu-score">Score: 0 CR7SIU Points</div>
                <div id="siuuu-streak">Streak: 0 | Multiplier: 1x</div>
                <div id="siuuu-high-score">High Score: ${siuuuHighScore} CR7SIU Points</div>
                <button id="start-siuuu-btn" onclick="startSiuuuReactionTap()">Start</button>
                <button id="end-siuuu-btn" onclick="endSiuuuReactionTap()" disabled>End</button>
                <button id="pause-siuuu-btn" onclick="pauseSiuuuGame()" disabled>Pause</button>
            </div>
            <div class="game-container" id="juggle-container">
                <h2>Tap-to-Juggle Challenge</h2>
                <p>Keep the ball in the air with rapid taps!</p>
                <div id="juggle-counter">Juggles: 0 ⚽</div>
                <button id="start-juggle-btn" onclick="startTapToJuggle()">Start</button>
                <button id="end-juggle-btn" onclick="endTapToJuggle()" disabled>End</button>
            </div>
            <div class="game-container" id="trivia-container">
                <h2>CR7 Trivia Quiz</h2>
                <p>Answer football trivia to earn points!</p>
                <div id="trivia-question"></div>
                <div id="trivia-options"></div>
                <div id="trivia-score">Score: 0 CR7SIU Points | Streak: 0</div>
                <button id="start-trivia-btn" onclick="startCr7Trivia()">Start</button>
                <button id="end-trivia-btn" onclick="endCr7Trivia()" disabled>End</button>
            </div>
        `;

        // Add event listeners for game interactions
        document.getElementById("penaltyCanvas").addEventListener("click", handleGoalTap);
        document.getElementById("penaltyCanvas").addEventListener("touchstart", handleGoalTap);
        document.getElementById("siuuu-word-display").addEventListener("click", handleSiuuuTap);
        document.getElementById("juggle-counter").addEventListener("click", handleJuggleTap);
    } catch (e) {
        console.error("Error in initializeGameContainers:", e);
    }
}

// CR7 Penalty Shootout Game Logic
function startPenaltyShootout() {
    try {
        if (penaltyGameActive) return;
        penaltyGameActive = true;
        penaltyShotsTaken = 0;
        penaltyScore = 0;
        penaltyStreak = 0;
        penaltyMultiplier = 1;
        isSuddenDeath = false;
        gameOver = false;
        ballX = 200;
        ballY = 280;
        targetX = ballX;
        targetY = ballY;
        goalkeeperX = 200;
        isShooting = false;
        shotFrame = 0;
        goalkeeperDiveDirection = 'center';
        playerState = 'standing';
        feedbackMessage = '';
        feedbackTimer = 0;
        selectedPower = 'medium';
        shotDirection = null;
        ballRotation = 0;
        crowdCheer = true;
        celebrationTimer = 0;

        document.getElementById("start-penalty-btn").disabled = true;
        document.getElementById("end-penalty-btn").disabled = false;
        updateGameScore();
        gameLoop();
    } catch (e) {
        console.error("Error in startPenaltyShootout:", e);
    }
}

function endPenaltyShootout() {
    try {
        if (!penaltyGameActive) return;
        penaltyGameActive = false;
        if (penaltyScore > 0) {
            currentPoints += penaltyScore;
            updatePointsAndLevel();
            showRewardToast(`Game Over! You earned ${penaltyScore} CR7SIU Points!`);
        }
        document.getElementById("start-penalty-btn").disabled = false;
        document.getElementById("end-penalty-btn").disabled = true;
        updateGameScore();
    } catch (e) {
        console.error("Error in endPenaltyShootout:", e);
    }
}

function selectPower(power) {
    selectedPower = power;
    const buttons = document.querySelectorAll(".power-btn");
    buttons.forEach(btn => {
        if (btn.id === `power-${power}`) {
            btn.style.background = "#FFD700";
        } else {
            btn.style.background = "linear-gradient(45deg, #444, #666)";
        }
    });
}

function handleGoalTap(event) {
    if (!penaltyGameActive || gameOver || isShooting) return;
    event.preventDefault();
    const canvas = document.getElementById("penaltyCanvas");
    const rect = canvas.getBoundingClientRect();
    const clientX = event.type.includes("touch") ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes("touch") ? event.touches[0].clientY : event.clientY;
    const tapX = (clientX - rect.left) * (canvas.width / rect.width);
    const tapY = (clientY - rect.top) * (canvas.height / rect.height);

    if (tapY > 70) return;

    if (tapX >= 120 && tapX < 173) {
        shotDirection = 'left';
        targetX = 146.5;
    } else if (tapX >= 173 && tapX < 226) {
        shotDirection = 'center';
        targetX = 199.5;
    } else if (tapX >= 226 && tapX <= 280) {
        shotDirection = 'right';
        targetX = 253;
    } else {
        return;
    }
    targetY = 25;

    isShooting = true;
    playerState = 'kicking';
    shotFrame = 0;

    const diveRandom = Math.random();
    if (shotDirection === 'left') {
        goalkeeperDiveDirection = diveRandom < 0.5 ? 'left' : (diveRandom < 0.75 ? 'center' : 'right');
    } else if (shotDirection === 'right') {
        goalkeeperDiveDirection = diveRandom < 0.5 ? 'right' : (diveRandom < 0.75 ? 'center' : 'left');
    } else {
        goalkeeperDiveDirection = diveRandom < 0.4 ? 'center' : (diveRandom < 0.7 ? 'left' : 'right');
    }
}

function checkGoal() {
    const goalScored = shotDirection !== goalkeeperDiveDirection;
    if (goalScored) {
        penaltyStreak++;
        penaltyMultiplier = penaltyStreak >= 3 ? 2 : 1;
        penaltyScore += 100 * penaltyMultiplier;
    } else {
        penaltyStreak = 0;
        penaltyMultiplier = 1;
    }
    return goalScored;
}

function updateMultiplier() {
    penaltyMultiplier = penaltyStreak >= 5 ? 3 : penaltyStreak >= 3 ? 2 : 1;
}

function updateGameScore() {
    const scoreDisplay = document.getElementById("game-score");
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${penaltyScore} | Streak: ${penaltyStreak} | Multiplier: ${penaltyMultiplier}x`;
    }
}

function gameLoop() {
    if (!penaltyGameActive) return;
    const canvas = document.getElementById("penaltyCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw stadium background
    ctx.fillStyle = "#1C2526";
    ctx.fillRect(0, 0, canvas.width, 50);
    ctx.fillStyle = crowdCheer ? "#4A4A4A" : "#5A5A5A";
    crowdCheer = !crowdCheer;
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(50, 0);
    ctx.lineTo(350, 0);
    ctx.lineTo(400, 50);
    ctx.closePath();
    ctx.fill();
    for (let x = 0; x < canvas.width; x += 10) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(x, 5, 5, 5);
    }

    // Draw spotlight effect
    const spotlight = ctx.createRadialGradient(200, 150, 50, 200, 150, 200);
    spotlight.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    spotlight.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = spotlight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pitch background with 3D effect
    const pitchGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    pitchGradient.addColorStop(0, "#1B5E20");
    pitchGradient.addColorStop(1, "#4CAF50");
    ctx.fillStyle = pitchGradient;
    ctx.fillRect(0, 50, canvas.width, canvas.height - 50);

    // Draw grass texture
    ctx.fillStyle = "rgba(0, 100, 0, 0.3)";
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height - 50) + 50;
        ctx.fillRect(x, y, 2, 2);
    }

    // Draw perspective lines for 3D effect
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(200, 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(200, 50);
    ctx.stroke();
    ctx.strokeRect(100, 50, 200, 100);

    // Draw penalty spot
    ctx.beginPath();
    ctx.arc(200, 280, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    // Draw goalpost with 3D effect
    const goalGradient = ctx.createLinearGradient(120, 0, 280, 0);
    goalGradient.addColorStop(0, "#B0BEC5");
    goalGradient.addColorStop(1, "#ECEFF1");
    ctx.fillStyle = goalGradient;
    ctx.fillRect(120, 0, 160, 15);
    ctx.fillRect(120, 0, 15, 70);
    ctx.fillRect(265, 0, 15, 70);
    ctx.beginPath();
    ctx.moveTo(120, 0);
    ctx.lineTo(110, 10);
    ctx.lineTo(125, 10);
    ctx.lineTo(135, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(280, 0);
    ctx.lineTo(290, 10);
    ctx.lineTo(275, 10);
    ctx.lineTo(265, 0);
    ctx.fill();
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(110, 10, 180, 5);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(135, 15, 130, 55);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1;
    for (let x = 135; x < 265; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 15);
        ctx.lineTo(x, 70);
        ctx.stroke();
    }
    for (let y = 15; y < 70; y += 10) {
        ctx.beginPath();
        ctx.moveTo(135, y);
        ctx.lineTo(265, y);
        ctx.stroke();
    }

    // Draw clickable areas on goalpost
    ctx.fillStyle = "rgba(255, 215, 0, 0.3)";
    ctx.fillRect(120, 0, 53, 70);
    ctx.fillRect(173, 0, 53, 70);
    ctx.fillRect(226, 0, 54, 70);

    // Draw player with 3D effect
    ctx.save();
    if (playerState === 'kicking') {
        ctx.translate(200, 275);
        ctx.rotate(-15 * Math.PI / 180);
        ctx.fillStyle = "#D32F2F";
        ctx.fillRect(-20, -30, 40, 40);
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.font = "bold 28px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("7", 0, -5);
        ctx.strokeText("7", 0, -5);
        ctx.fillStyle = "#000";
        ctx.fillRect(-15, 10, 10, 30);
        ctx.fillRect(5, 10, 10, 30);
        ctx.restore();
    } else {
        ctx.fillStyle = "#D32F2F";
        ctx.fillRect(180, 245, 40, 40);
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.font = "bold 28px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("7", 200, 265);
        ctx.strokeText("7", 200, 265);
        ctx.fillStyle = "#000";
        ctx.fillRect(185, 285, 10, 20);
        ctx.fillRect(205, 285, 10, 20);
    }

    // Draw goalkeeper with diving animation
    if (isShooting) {
        if (goalkeeperDiveDirection === 'left') {
            ctx.save();
            ctx.translate(140, 35);
            ctx.rotate(-15 * Math.PI / 180);
            ctx.fillStyle = "#F44336";
            ctx.fillRect(-20, -20, 40, 40);
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.font = "bold 16px Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("GK", 0, 0);
            ctx.strokeText("GK", 0, 0);
            ctx.restore();
        } else if (goalkeeperDiveDirection === 'right') {
            ctx.save();
            ctx.translate(260, 35);
            ctx.rotate(15 * Math.PI / 180);
            ctx.fillStyle = "#4CAF50";
            ctx.fillRect(-20, -20, 40, 40);
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.font = "bold 16px Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("GK", 0, 0);
            ctx.strokeText("GK", 0, 0);
            ctx.restore();
        } else {
            ctx.fillStyle = "#2196F3";
            ctx.fillRect(180, 15, 40, 40);
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.font = "bold 16px Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("GK", 200, 35);
            ctx.strokeText("GK", 200, 35);
        }
    } else {
        ctx.fillStyle = "#2196F3";
        ctx.fillRect(180, 15, 40, 40);
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.font = "bold 16px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GK", 200, 35);
        ctx.strokeText("GK", 200, 35);
    }

    // Draw ball with spinning animation
    if (!isShooting) {
        ctx.save();
        ctx.translate(ballX, ballY);
        ctx.rotate(ballRotation);
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(3, 3, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.font = "16px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⚽", 0, 0);
        ctx.restore();
    } else {
        shotFrame++;
        const frames = selectedPower === 'low' ? 30 : selectedPower === 'medium' ? 20 : 10;
        const progress = Math.min(shotFrame / frames, 1);
        ballX = ballX + (targetX - ballX) * progress;
        ballY = ballY + (targetY - ballY) * progress;
        ballRotation += 0.2;
        ctx.save();
        ctx.translate(ballX, ballY);
        ctx.rotate(ballRotation);
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(3, 3, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.font = "16px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⚽", 0, 0);
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(200, 280);
        ctx.lineTo(ballX, ballY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        if (progress === 1) {
            penaltyShotsTaken++;
            const goalScored = checkGoal();
            if (goalScored) {
                penaltyStreak++;
                updateMultiplier();
                penaltyScore += 100 * penaltyMultiplier;
                feedbackMessage = "Goal!";
                celebrationTimer = 60;
            } else {
                penaltyStreak = 0;
                penaltyMultiplier = 1;
                feedbackMessage = "Miss!";
            }
            feedbackTimer = 60;

            if (penaltyShotsTaken >= 5 && penaltyScore >= 400 && !isSuddenDeath) {
                isSuddenDeath = true;
                updateRewardStatus("Sudden Death Mode! Miss a shot and the game ends!");
            }

            if (isSuddenDeath && !goalScored) {
                gameOver = true;
                endPenaltyShootout();
            }

            updateGameScore();
            isShooting = false;
            playerState = 'standing';
            goalkeeperDiveDirection = 'center';
            shotDirection = null;

            ballX = 200;
            ballY = 280;
            targetX = ballX;
            targetY = ballY;
        }
    }

    // Draw feedback message
    if (feedbackTimer > 0) {
        ctx.font = "bold 24px Roboto";
        ctx.fillStyle = feedbackMessage === "Goal!" ? "#00FF00" : "#FF0000";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.textAlign = "center";
        ctx.fillText(feedbackMessage, canvas.width / 2, canvas.height / 2);
        ctx.strokeText(feedbackMessage, canvas.width / 2, canvas.height / 2);
        feedbackTimer--;
    }

    // Draw goal celebration effect
    if (celebrationTimer > 0) {
        ctx.fillStyle = celebrationTimer % 10 < 5 ? "#FFFF00" : "#FFFFFF";
        ctx.fillRect(110, 0, 10, 70);
        ctx.fillRect(280, 0, 10, 70);
        ctx.fillRect(120, 0, 160, 5);
        celebrationTimer--;
    }

    requestAnimationFrame(gameLoop);
}

// SIUUU Reaction Tap Game Logic
function startSiuuuReactionTap() {
    try {
        if (siuuuGameActive) return;
        siuuuGameActive = true;
        siuuuScore = 0;
        siuuuStreak = 0;
        siuuuMultiplier = 1;
        siuuuTimeLeft = Math.max(0.5, 2 - (playerLevel - 1) * 0.15);
        isPaused = false;

        document.getElementById("start-siuuu-btn").disabled = true;
        document.getElementById("end-siuuu-btn").disabled = false;
        document.getElementById("pause-siuuu-btn").disabled = false;
        updateSiuuuScore();
        updateSiuuuStreak();
        updateSiuuuHighScore();
        nextSiuuuWord();
    } catch (e) {
        console.error("Error in startSiuuuReactionTap:", e);
    }
}

function handleSiuuuTap() {
    try {
        const wordDisplay = document.getElementById("siuuu-word-display");
        if (!wordDisplay) {
            console.error("siuuu-word-display not found");
            return;
        }

        if (!siuuuGameActive || isPaused) return;

        if (currentSiuuuWord === "Siuuu!") {
            siuuuStreak++;
            updateSiuuuMultiplier();
            siuuuScore += 10 * siuuuMultiplier;
            if (siuuuStreak % 5 === 0) {
                const bonusPoints = siuuuStreak * 10;
                siuuuScore += bonusPoints;
                showRewardToast(`Combo Bonus! +${bonusPoints} CR7SIU Points for a ${siuuuStreak} streak!`);
            }
            updateSiuuuScore();
            updateSiuuuStreak();
            wordDisplay.classList.add("correct-tap");
            setTimeout(() => wordDisplay.classList.remove("correct-tap"), 300);
            nextSiuuuWord();
        } else {
            wordDisplay.classList.add("incorrect-tap");
            setTimeout(() => wordDisplay.classList.remove("incorrect-tap"), 300);
            endSiuuuReactionTap();
        }
    } catch (e) {
        console.error("Error in handleSiuuuTap:", e);
    }
}

function nextSiuuuWord() {
    try {
        clearInterval(siuuuTimerInterval);
        siuuuTimeLeft = Math.max(0.5, 2 - (playerLevel - 1) * 0.15);
        updateSiuuuTimer();

        const wordDisplay = document.getElementById("siuuu-word-display");
        if (!wordDisplay) {
            console.error("siuuu-word-display not found");
            return;
        }

        currentSiuuuWord = siuuuWords[Math.floor(Math.random() * siuuuWords.length)];
        wordDisplay.textContent = currentSiuuuWord;

        siuuuTimerInterval = setInterval(() => {
            if (!isPaused && siuuuGameActive) {
                siuuuTimeLeft -= 0.1;
                updateSiuuuTimer();
                if (siuuuTimeLeft <= 0) {
                    clearInterval(siuuuTimerInterval);
                    wordDisplay.classList.add("incorrect-tap");
                    setTimeout(() => wordDisplay.classList.remove("incorrect-tap"), 300);
                    endSiuuuReactionTap();
                }
            }
        }, 100);
    } catch (e) {
        console.error("Error in nextSiuuuWord:", e);
    }
}

function updateSiuuuScore() {
    const scoreDisplay = document.getElementById("siuuu-score");
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${siuuuScore} CR7SIU Points`;
}

function updateSiuuuTimer() {
    const timerDisplay = document.getElementById("siuuu-timer");
    const progressBar = document.getElementById("timer-progress-bar");
    if (timerDisplay) {
        timerDisplay.textContent = `Time Left: ${siuuuTimeLeft.toFixed(1)}s`;
    }
    if (progressBar) {
        const maxTime = Math.max(0.5, 2 - (playerLevel - 1) * 0.15);
        const percentage = (siuuuTimeLeft / maxTime) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

function updateSiuuuStreak() {
    const streakDisplay = document.getElementById("siuuu-streak");
    if (streakDisplay) streakDisplay.textContent = `Streak: ${siuuuStreak} | Multiplier: ${siuuuMultiplier}x`;
}

function updateSiuuuMultiplier() {
    siuuuMultiplier = siuuuStreak >= 10 ? 3 : siuuuStreak >= 5 ? 2 : 1;
}

function updateSiuuuHighScore() {
    const highScoreDisplay = document.getElementById("siuuu-high-score");
    if (highScoreDisplay) highScoreDisplay.textContent = `High Score: ${siuuuHighScore} CR7SIU Points`;
}

function endSiuuuReactionTap() {
    try {
        if (!siuuuGameActive) return;
        siuuuGameActive = false;
        clearInterval(siuuuTimerInterval);
        if (siuuuScore > siuuuHighScore) {
            siuuuHighScore = siuuuScore;
            localStorage.setItem("siuuuHighScore", siuuuHighScore);
            updateSiuuuHighScore();
        }
        if (siuuuScore > 0) {
            currentPoints += siuuuScore;
            updatePointsAndLevel();
            showRewardToast(`Game Over! You earned ${siuuuScore} CR7SIU Points with a ${siuuuStreak} streak!`);
        }
        document.getElementById("start-siuuu-btn").disabled = false;
        document.getElementById("end-siuuu-btn").disabled = true;
        document.getElementById("pause-siuuu-btn").disabled = true;
    } catch (e) {
        console.error("Error in endSiuuuReactionTap:", e);
    }
}

function pauseSiuuuGame() {
    try {
        if (!siuuuGameActive) return;
        if (isPaused) {
            isPaused = false;
            document.getElementById("pause-siuuu-btn").textContent = "Pause";
            nextSiuuuWord();
        } else {
            isPaused = true;
            clearInterval(siuuuTimerInterval);
            document.getElementById("pause-siuuu-btn").textContent = "Resume";
            document.getElementById("siuuu-timer").textContent = "Paused";
        }
    } catch (e) {
        console.error("Error in pauseSiuuuGame:", e);
    }
}

// Tap-to-Juggle Challenge Logic
function startTapToJuggle() {
    try {
        if (juggleGameActive) return;
        juggleGameActive = true;
        juggleCount = 0;
        juggleWindow = 1000;
        lastJuggleTime = Date.now();

        document.getElementById("start-juggle-btn").disabled = true;
        document.getElementById("end-juggle-btn").disabled = false;
        updateJuggleCounter();
    } catch (e) {
        console.error("Error in startTapToJuggle:", e);
    }
}

function handleJuggleTap() {
    try {
        if (!juggleGameActive) startTapToJuggle();
        if (juggleGameActive) {
            const currentTime = Date.now();
            if (currentTime - lastJuggleTime <= juggleWindow) {
                juggleCount++;
                juggleWindow = Math.max(500, juggleWindow - 50);
                lastJuggleTime = currentTime;
                animateJuggle();
                updateJuggleCounter();
            } else {
                endTapToJuggle();
            }
        }
    } catch (e) {
        console.error("Error in handleJuggleTap:", e);
    }
}

function updateJuggleCounter() {
    const counterDisplay = document.getElementById("juggle-counter");
    if (counterDisplay) counterDisplay.textContent = `Juggles: ${juggleCount} ⚽`;
}

function animateJuggle() {
    const counterDisplay = document.getElementById("juggle-counter");
    if (counterDisplay) {
        counterDisplay.classList.add("juggle-anim");
        setTimeout(() => counterDisplay.classList.remove("juggle-anim"), 300);
    }
}

function endTapToJuggle() {
    try {
        if (!juggleGameActive) return;
        juggleGameActive = false;
        const pointsEarned = juggleCount * 5;
        if (pointsEarned > 0) {
            currentPoints += pointsEarned;
            updatePointsAndLevel();
            showRewardToast(`Game Over! You earned ${pointsEarned} CR7SIU Points with ${juggleCount} juggles!`);
        }
        document.getElementById("start-juggle-btn").disabled = false;
        document.getElementById("end-juggle-btn").disabled = true;
    } catch (e) {
        console.error("Error in endTapToJuggle:", e);
    }
}

// CR7 Trivia Quiz Logic
function startCr7Trivia() {
    try {
        if (triviaGameActive) return;
        triviaGameActive = true;
        triviaScore = 0;
        triviaStreak = 0;
        currentQuestionIndex = 0;
        selectedAnswer = null;

        document.getElementById("start-trivia-btn").disabled = true;
        document.getElementById("end-trivia-btn").disabled = false;
        nextTriviaQuestion();
    } catch (e) {
        console.error("Error in startCr7Trivia:", e);
    }
}

function nextTriviaQuestion() {
    try {
        if (!triviaGameActive || currentQuestionIndex >= triviaQuestions.length) {
            endCr7Trivia();
            return;
        }

        const question = triviaQuestions[currentQuestionIndex];
        const questionDisplay = document.getElementById("trivia-question");
        const optionsDisplay = document.getElementById("trivia-options");
        if (questionDisplay && optionsDisplay) {
            questionDisplay.textContent = question.question;
            optionsDisplay.innerHTML = question.options.map((opt, index) => `
                <button class="trivia-option" onclick="selectTriviaAnswer('${opt}', '${question.answer}')">${opt}</button>
            `).join('');
            document.getElementById("trivia-options").querySelectorAll("button").forEach(btn => btn.disabled = false);
            document.getElementById("trivia-question").classList.remove("correct-answer", "incorrect-answer");
        }
    } catch (e) {
        console.error("Error in nextTriviaQuestion:", e);
    }
}

function selectTriviaAnswer(selected, correct) {
    try {
        selectedAnswer = selected;
        const options = document.querySelectorAll(".trivia-option");
        options.forEach(opt => opt.disabled = true);

        if (selected === correct) {
            triviaStreak++;
            triviaScore += 20 * (triviaStreak >= 5 ? 2 : 1);
            const questionDisplay = document.getElementById("trivia-question");
            if (questionDisplay) questionDisplay.classList.add("correct-answer");
            setTimeout(() => {
                questionDisplay.classList.remove("correct-answer");
                currentQuestionIndex++;
                nextTriviaQuestion();
            }, 300);
        } else {
            triviaStreak = 0;
            const questionDisplay = document.getElementById("trivia-question");
            if (questionDisplay) questionDisplay.classList.add("incorrect-answer");
            setTimeout(() => {
                questionDisplay.classList.remove("incorrect-answer");
                endCr7Trivia();
            }, 300);
        }

        updateTriviaScore();
    } catch (e) {
        console.error("Error in selectTriviaAnswer:", e);
    }
}

function updateTriviaScore() {
    const scoreDisplay = document.getElementById("trivia-score");
    if (scoreDisplay) scoreDisplay.textContent = `Score: ${triviaScore} CR7SIU Points | Streak: ${triviaStreak}`;
}

function endCr7Trivia() {
    try {
        if (!triviaGameActive) return;
        triviaGameActive = false;
        if (triviaScore > 0) {
            currentPoints += triviaScore;
            updatePointsAndLevel();
            showRewardToast(`Quiz Over! You earned ${triviaScore} CR7SIU Points with a ${triviaStreak} streak!`);
        }
        document.getElementById("start-trivia-btn").disabled = false;
        document.getElementById("end-trivia-btn").disabled = true;
        document.getElementById("trivia-question").textContent = "";
        document.getElementById("trivia-options").innerHTML = "";
    } catch (e) {
        console.error("Error in endCr7Trivia:", e);
    }
}

function earnPoints() {
    try {
        currentPoints += 5;
        updatePointsAndLevel();
    } catch (e) {
        console.error("Error in earnPoints:", e);
    }
}

function updatePointsAndLevel() {
    try {
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
        localStorage.setItem("level", playerLevel);
        console.log("Updated localStorage:", { points: currentPoints, tokens: currentTokens, level: playerLevel });
        const scoreDisplay = document.getElementById("score-display");
        if (scoreDisplay) scoreDisplay.textContent = `${currentPoints} CR7SIU Points`;
        const pointsDisplay = document.getElementById("cr7siu-points");
        if (pointsDisplay) pointsDisplay.textContent = currentPoints;
        const tokensDisplay = document.getElementById("tokens-display");
        if (tokensDisplay) tokensDisplay.textContent = currentTokens;
        updateLevel();
    } catch (e) {
        console.error("Error in updatePointsAndLevel:", e);
    }
}

function updateLevel() {
    try {
        playerLevel = Math.floor(currentPoints / 1000) + 1;
        const playerLevelDisplay = document.getElementById("player-level");
        if (playerLevelDisplay) playerLevelDisplay.textContent = playerLevel;
        localStorage.setItem("level", playerLevel);
    } catch (e) {
        console.error("Error in updateLevel:", e);
    }
}

function convertToTokens() {
    try {
        const tokens = Math.floor(currentPoints / 5000);
        if (tokens > 0) {
            currentPoints -= tokens * 5000;
            currentTokens += tokens;
            localStorage.setItem("points", currentPoints);
            localStorage.setItem("tokens", currentTokens);
            const tokensDisplay = document.getElementById("tokens-display");
            if (tokensDisplay) tokensDisplay.textContent = currentTokens;
            showRewardToast(`You converted ${tokens} CR7SIU Tokens!`);
            updatePointsAndLevel();
        } else {
            alert("Not enough points to convert to tokens (5000 points = 1 token).");
        }
    } catch (e) {
        console.error("Error in convertToTokens:", e);
    }
}

function displayTasks() {
    try {
        const tasksContainer = document.getElementById("tasks-container");
        if (!tasksContainer) return;
        tasksContainer.innerHTML = Object.keys(tasksCompleted).map(task => `
            <div class="task">
                <h3>Complete ${task.charAt(0).toUpperCase() + task.slice(1)} Task</h3>
                <p>${task === 'youtube' ? 'Watch and like our latest video' : 
                    task === 'xAccount' ? 'Tweet with our hashtag' : 
                    'Share our post on your timeline'}</p>
                <button id="task-${task}" onclick="completeTask('${task}')" ${lastTaskClaims[task] && !isNewDay(lastTaskClaims[task]) ? 'disabled' : ''}>
                    ${lastTaskClaims[task] && !isNewDay(lastTaskClaims[task]) ? 'Claimed' : 'Complete'}
                </button>
            </div>
        `).join('');
        updateTaskButtons();
    } catch (e) {
        console.error("Error in displayTasks:", e);
    }
}

function completeTask(task) {
    try {
        console.log(`Attempting to complete task: ${task}`);
        if (lastTaskClaims[task] && !isNewDay(lastTaskClaims[task])) {
            updateRewardStatus("You can only claim this task once per day!");
            return;
        }

        tasksCompleted[task] = true;
        lastTaskClaims[task] = Date.now();
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        localStorage.setItem("lastTaskClaims", JSON.stringify(lastTaskClaims));
        currentPoints += 100;
        updatePointsAndLevel();
        showRewardToast(`Task Completed! You earned 100 CR7SIU Points!`);
        updateTaskButtons();
    } catch (e) {
        console.error("Error in completeTask:", e);
    }
}

function updateTaskButtons() {
    try {
        Object.keys(tasksCompleted).forEach(task => {
            const button = document.getElementById(`task-${task}`);
            if (button) {
                const canClaim = isNewDay(lastTaskClaims[task]);
                if (canClaim) {
                    tasksCompleted[task] = false;
                    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
                }
                button.disabled = !canClaim;
                button.textContent = canClaim ? "Complete" : "Claimed";
            }
        });
        const claimButton = document.getElementById("claim-rewards-btn");
        if (claimButton) {
            claimButton.disabled = !Object.values(tasksCompleted).some(task => task) || !isNewDay(lastRewardsClaim);
        }
    } catch (e) {
        console.error("Error in updateTaskButtons:", e);
    }
}

function claimRewards() {
    try {
        console.log("Attempting to claim rewards");
        if (!isNewDay(lastRewardsClaim)) {
            updateRewardStatus("You can only claim rewards once per day!");
            return;
        }

        if (Object.values(tasksCompleted).some(task => task)) {
            const totalReward = Object.values(tasksCompleted).filter(task => task).length * 100;
            currentPoints += totalReward;
            updatePointsAndLevel();
            showRewardToast(`Claimed ${totalReward} CR7SIU Points!`);
            tasksCompleted = { youtube: false, xAccount: false, facebook: false };
            lastRewardsClaim = Date.now();
            localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
            localStorage.setItem("lastRewardsClaim", lastRewardsClaim);
            updateTaskButtons();
        } else {
            updateRewardStatus("Complete some tasks to claim rewards!");
        }
    } catch (e) {
        console.error("Error in claimRewards:", e);
    }
}

function showRewardToast(message) {
    try {
        console.log("Showing reward toast with message:", message);
        const toast = document.getElementById("reward-toast");
        const messageElement = document.getElementById("reward-message");
        if (toast && messageElement) {
            messageElement.textContent = message;
            toast.classList.remove("hidden");
            setTimeout(() => {
                toast.classList.add("hidden");
            }, 3000);
        } else {
            console.error("Toast or message element not found.");
        }
    } catch (e) {
        console.error("Error in showRewardToast:", e);
    }
}

function displayImprovements() {
    try {
        const improvements = [
            { name: "Speed", level: attributes.speed || 1, cost: 1000 * (attributes.speed || 1) },
            { name: "Power", level: attributes.power || 1, cost: 1000 * (attributes.power || 1) },
            { name: "Stamina", level: attributes.stamina || 1, cost: 1000 * (attributes.stamina || 1) }
        ];
        const container = document.getElementById("attributes-container");
        if (!container) return;
        container.innerHTML = improvements.map(attr => `
            <div class="attribute-card">
                <h3>${attr.name}</h3>
                <p>Level: ${attr.level}</p>
                <p>Cost to Upgrade: ${attr.cost} CR7SIU Points</p>
                <button onclick="upgradeAttribute('${attr.name.toLowerCase()}', ${attr.cost})">Upgrade</button>
            </div>
        `).join('');
    } catch (e) {
        console.error("Error in displayImprovements:", e);
    }
}

function upgradeAttribute(attribute, cost) {
    try {
        const level = attributes[attribute] || 1;
        if (currentPoints >= cost) {
            currentPoints -= cost;
            attributes[attribute] = level + 1;
            updatePointsAndLevel();
            localStorage.setItem("attributes", JSON.stringify(attributes));
            displayImprovements();
            showRewardToast(`${attribute.charAt(0).toUpperCase() + attribute.slice(1)} upgraded to Level ${attributes[attribute]}!`);
        } else {
            updateRewardStatus("Not enough CR7SIU Points to upgrade!");
        }
    } catch (e) {
        console.error("Error in upgradeAttribute:", e);
    }
}

function generateReferralLink() {
    try {
        if (username) {
            const referralLink = `${window.location.origin}/?ref=${encodeURIComponent(username)}`;
            const referralField = document.getElementById('referral-link-field');
            if (referralField) referralField.value = referralLink;
            updateRewardStatus("Referral link generated. Share this to earn points!");
        } else {
            updateRewardStatus("Please set a username first!");
        }
    } catch (e) {
        console.error("Error in generateReferralLink:", e);
    }
}

function checkForReferral() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref && ref !== username && !referralUsers.includes(ref)) {
            referralUsers.push(ref);
            localStorage.setItem("referralUsers", JSON.stringify(referralUsers));
            currentPoints += 5000;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You've earned 5000 CR7SIU Points for a successful referral!");
            displayReferrals();
        }
    } catch (e) {
        console.error("Error in checkForReferral:", e);
    }
}

function shareLink(platform) {
    try {
        const link = document.getElementById('referral-link-field').value;
        if (link) {
            if (navigator.share) {
                navigator.share({
                    title: 'Join CR7SIU!',
                    text: 'Check out this cool app for Ronaldo fans!',
                    url: link
                }).then(() => console.log('Successful share'))
                  .catch((error) => console.log('Error sharing', error));
            } else {
                switch(platform) {
                    case 'facebook':
                        window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(link));
                        break;
                    case 'x':
                        window.open("https://twitter.com/intent/tweet?text=Check out CR7SIU!&url=" + encodeURIComponent(link));
                        break;
                    case 'whatsapp':
                        window.open("whatsapp://send?text=Check out CR7SIU! " + link);
                        break;
                    case 'telegram':
                        window.open("https://telegram.me/share/url?url=" + encodeURIComponent(link) + "&text=Check out CR7SIU!");
                        break;
                    case 'instagram':
                        updateRewardStatus("Instagram sharing not directly supported. Share link manually.");
                        break;
                }
            }
        } else {
            updateRewardStatus("Please generate a referral link first!");
        }
    } catch (e) {
        console.error("Error in shareLink:", e);
    }
}

function toggleShareOptions() {
    try {
        const shareOptions = document.getElementById('social-share');
        if (shareOptions) shareOptions.classList.toggle('hidden');
    } catch (e) {
        console.error("Error in toggleShareOptions:", e);
    }
}

function displayReferrals() {
    try {
        const referralList = document.getElementById("referrals-list");
        if (referralList) {
            referralList.innerHTML = referralUsers.map(user => `<div>${user}</div>`).join('');
            const referralCount = document.getElementById("referral-count");
            if (referralCount) referralCount.textContent = referralUsers.length;
        }
    } catch (e) {
        console.error("Error in displayReferrals:", e);
    }
}

function resetTasks() {
    try {
        tasksCompleted = { youtube: false, xAccount: false, facebook: false };
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        const claimButton = document.getElementById("claim-rewards-btn");
        if (claimButton) claimButton.disabled = true;
        updateTaskButtons();
    } catch (e) {
        console.error("Error in resetTasks:", e);
    }
}

function isNewDay(lastClaimTime) {
    try {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        return now - lastClaimTime >= oneDay;
    } catch (e) {
        console.error("Error in isNewDay:", e);
        return false;
    }
}

function updateButtonStates() {
    try {
        if (isNewDay(lastAdClaim)) enableSpecificButton('ad-claim-button');
        else disableSpecificButton('ad-claim-button');
        if (isNewDay(lastCheckInClaim)) enableSpecificButton('check-in-button');
        else disableSpecificButton('check-in-button');
        if (isNewDay(lastSpinClaim)) enableSpecificButton('spin-button');
        else disableSpecificButton('spin-button');

        Object.keys(tasksCompleted).forEach(task => {
            const button = document.getElementById(`task-${task}`);
            if (button) {
                const canClaim = isNewDay(lastTaskClaims[task]);
                if (canClaim) {
                    tasksCompleted[task] = false;
                    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
                }
                button.disabled = !canClaim;
                button.textContent = canClaim ? "Complete" : "Claimed";
            }
        });

        const claimButton = document.getElementById("claim-rewards-btn");
        if (claimButton) {
            const canClaim = isNewDay(lastRewardsClaim);
            claimButton.disabled = !canClaim || !Object.values(tasksCompleted).some(Boolean);
            claimButton.textContent = canClaim ? "Claim Rewards" : "Claimed";
        }
    } catch (e) {
        console.error("Error in updateButtonStates:", e);
    }
}

function enableSpecificButton(buttonId) {
    try {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = buttonId === 'spin-button' ? 'Spin to Win!' : 'Claim Reward';
        }
    } catch (e) {
        console.error("Error in enableSpecificButton:", e);
    }
}

function disableSpecificButton(buttonId) {
    try {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.textContent = 'Claimed';
        }
    } catch (e) {
        console.error("Error in disableSpecificButton:", e);
    }
}

function completeAdTask() {
    try {
        console.log("Attempting to complete ad task");
        if (isNewDay(lastAdClaim)) {
            currentPoints += 200;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You earned 200 CR7SIU Points from the ad reward.");
            showRewardToast("Reward Claimed! 200 CR7SIU Points have been credited to your account.");
            lastAdClaim = Date.now();
            localStorage.setItem("lastAdClaim", lastAdClaim);
            disableSpecificButton('ad-claim-button');
        } else {
            updateRewardStatus("You can only claim this reward once per day!");
        }
    } catch (e) {
        console.error("Error in completeAdTask:", e);
    }
}

function completeCheckInTask() {
    try {
        console.log("Attempting to complete check-in task");
        if (isNewDay(lastCheckInClaim)) {
            currentPoints += 50;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You earned 50 CR7SIU Points for your daily check-in.");
            showRewardToast("Reward Claimed! 50 CR7SIU Points have been credited to your account.");
            lastCheckInClaim = Date.now();
            localStorage.setItem("lastCheckInClaim", lastCheckInClaim);
            disableSpecificButton('check-in-button');
        } else {
            updateRewardStatus("You can only claim this reward once per day!");
        }
    } catch (e) {
        console.error("Error in completeCheckInTask:", e);
    }
}

function drawWheel(angle = 0) {
    try {
        const canvas = document.getElementById("wheelCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const sections = 6;
        const arc = (2 * Math.PI) / sections;
        const radius = canvas.width / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(radius, radius);
        ctx.rotate(angle);

        for (let i = 0; i < sections; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);
            ctx.lineTo(0, 0);
            ctx.fillStyle = wheelColors[i];
            ctx.fill();
            ctx.save();

            ctx.fillStyle = "#FFF";
            ctx.font = "bold 20px Roboto";
            ctx.textAlign = "center";
            ctx.rotate(i * arc + arc / 2);
            ctx.fillText(wheelRewards[i], radius * 0.6, 0);
            ctx.restore();
        }

        ctx.rotate(-angle);
        ctx.translate(-radius, -radius);
    } catch (e) {
        console.error("Error in drawWheel:", e);
    }
}

function spinWheel() {
    try {
        console.log("Attempting to spin the wheel");
        if (isSpinning || !isNewDay(lastSpinClaim)) {
            updateRewardStatus("You can only spin once per day!");
            return;
        }

        isSpinning = true;
        disableSpecificButton("spin-button");

        const spins = 5 + Math.random() * 5;
        const randomSection = Math.floor(Math.random() * 6);
        const targetAngle = (2 * Math.PI * spins) + (randomSection * (2 * Math.PI / 6));
        let currentAngle = 0;
        const duration = 3000;
        const startTime = performance.now();

        function animateWheel(time) {
            try {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                currentAngle = targetAngle * (1 - Math.pow(1 - progress, 2));
                drawWheel(currentAngle);

                if (progress < 1) {
                    requestAnimationFrame(animateWheel);
                } else {
                    isSpinning = false;
                    const reward = wheelRewards[randomSection];
                    currentPoints += reward;
                    updatePointsAndLevel();
                    showRewardToast(`Reward Claimed! ${reward} CR7SIU Points have been credited to your account.`);
                    lastSpinClaim = Date.now();
                    localStorage.setItem("lastSpinClaim", lastSpinClaim);
                    enableSpecificButton('spin-button');
                }
            } catch (e) {
                console.error("Error in animateWheel:", e);
            }
        }

        requestAnimationFrame(animateWheel);
    } catch (e) {
        console.error("Error in spinWheel:", e);
    }
}

function updateRewardStatus(message) {
    try {
        const statusElement = document.getElementById("reward-status");
        if (statusElement) {
            statusElement.innerText = message;
        }
    } catch (e) {
        console.error("Error in updateRewardStatus:", e);
    }
}

function updateSpinTimer() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const timeLeft = oneDay - (now - lastSpinClaim);
    if (timeLeft <= 0) {
        document.getElementById("spin-button").disabled = false;
        document.getElementById("spin-timer").textContent = "00:00:00";
    } else {
        document.getElementById("spin-button").disabled = true;
        const timer = setInterval(() => {
            const remaining = Math.max(0, oneDay - (Date.now() - lastSpinClaim));
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            document.getElementById("spin-timer").textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (remaining === 0) {
                clearInterval(timer);
                document.getElementById("spin-button").disabled = false;
            }
        }, 1000);
    }
}

document.addEventListener('touchstart', function(event) {
    try {
        if (event.target.id === "juggle-counter" || event.target.id === "tap-to-earn") {
            event.target.click();
            if (event.target.id === "juggle-counter") handleJuggleTap();
            else if (event.target.id === "tap-to-earn") earnPoints();
        } else if (event.target.tagName === 'BUTTON') {
            event.target.click();
        }
    } catch (e) {
        console.error("Error in touchstart listener:", e);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        updateRewardStatus("Welcome back! Complete your daily tasks to claim rewards.");
        updateButtonStates();
        updateSpinTimer();
        if (document.getElementById("rewards") && !document.getElementById("rewards").classList.contains("hidden")) {
            drawWheel();
        }
    } catch (e) {
        console.error("Error in DOMContentLoaded:", e);
    }
});