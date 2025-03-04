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
const wheelRewards = [500, 1000, 1500, 2000, 2500, 300];
const wheelColors = ["#FF4500", "#32CD32", "#1E90FF", "#FFD700", "#FF00FF", "#00CED1"];
let isSpinning = false;

// Penalty Shootout game state
let penaltyGameActive = false;
let penaltyShotsTaken = 0;
let penaltyScore = 0;
let penaltyStreak = 0;
let penaltyMultiplier = 1;
let isSuddenDeath = false;
let gameOver = false;
let ballX, ballY, targetX, targetY;
let goalkeeperX, goalkeeperDirection;
let swipeStartX = null;
let swipeStartY = null;
let isShooting = false;
let shotFrame = 0;
let goalkeeperDiveDirection = 'center'; // 'left', 'right', or 'center'
let playerState = 'standing'; // 'standing' or 'kicking'
let feedbackMessage = '';
let feedbackTimer = 0;

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
        displayTasks();
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
        }
        // Reset game area visibility when navigating away from Games page
        if (page !== "games") {
            const gameArea = document.getElementById("game-area");
            if (gameArea) gameArea.classList.add("hidden");
            endPenaltyShootout();
        }
    } catch (e) {
        console.error("Error in showPage:", e);
    }
}

// CR7 Penalty Shootout Game Logic
function startPenaltyShootout() {
    try {
        penaltyGameActive = true;
        penaltyShotsTaken = 0;
        penaltyScore = 0;
        penaltyStreak = 0;
        penaltyMultiplier = 1;
        isSuddenDeath = false;
        gameOver = false;
        ballX = 200; // Center of canvas
        ballY = 250; // Near bottom of canvas
        targetX = ballX;
        targetY = ballY;
        goalkeeperX = 200; // Center of goal
        goalkeeperDirection = 1; // 1 for right, -1 for left
        isShooting = false;
        shotFrame = 0;
        goalkeeperDiveDirection = 'center';
        playerState = 'standing';
        feedbackMessage = '';
        feedbackTimer = 0;

        const gameArea = document.getElementById("game-area");
        if (gameArea) gameArea.classList.remove("hidden");

        const canvas = document.getElementById("penaltyCanvas");
        canvas.addEventListener("mousedown", startSwipe);
        canvas.addEventListener("mousemove", updateSwipe);
        canvas.addEventListener("mouseup", endSwipe);
        canvas.addEventListener("touchstart", startSwipe);
        canvas.addEventListener("touchmove", updateSwipe);
        canvas.addEventListener("touchend", endSwipe);

        updateGameScore();
        gameLoop();
    } catch (e) {
        console.error("Error in startPenaltyShootout:", e);
    }
}

function endPenaltyShootout() {
    try {
        if (penaltyGameActive) {
            penaltyGameActive = false;
            if (penaltyScore > 0) {
                const pointsEarned = penaltyScore;
                currentPoints += pointsEarned;
                updatePointsAndLevel();
                showRewardToast(`Game Over! You earned ${pointsEarned} CR7SIU Points!`);
            }
            const canvas = document.getElementById("penaltyCanvas");
            canvas.removeEventListener("mousedown", startSwipe);
            canvas.removeEventListener("mousemove", updateSwipe);
            canvas.removeEventListener("mouseup", endSwipe);
            canvas.removeEventListener("touchstart", startSwipe);
            canvas.removeEventListener("touchmove", updateSwipe);
            canvas.removeEventListener("touchend", endSwipe);
        }
    } catch (e) {
        console.error("Error in endPenaltyShootout:", e);
    }
}

function startSwipe(event) {
    if (!penaltyGameActive || gameOver || isShooting) return;
    event.preventDefault();
    const canvas = document.getElementById("penaltyCanvas");
    const rect = canvas.getBoundingClientRect();
    const clientX = event.type.includes("touch") ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes("touch") ? event.touches[0].clientY : event.clientY;
    swipeStartX = (clientX - rect.left) * (canvas.width / rect.width);
    swipeStartY = (clientY - rect.top) * (canvas.height / rect.height);
}

function updateSwipe(event) {
    if (!penaltyGameActive || gameOver || swipeStartX === null) return;
    event.preventDefault();
    const canvas = document.getElementById("penaltyCanvas");
    const rect = canvas.getBoundingClientRect();
    const clientX = event.type.includes("touch") ? event.touches[0].clientX : event.clientX;
    const clientY = event.type.includes("touch") ? event.touches[0].clientY : event.clientY;
    targetX = (clientX - rect.left) * (canvas.width / rect.width);
    targetY = (clientY - rect.top) * (canvas.height / rect.height);
}

function endSwipe(event) {
    if (!penaltyGameActive || gameOver || swipeStartX === null || isShooting) return;
    event.preventDefault();
    const canvas = document.getElementById("penaltyCanvas");
    const rect = canvas.getBoundingClientRect();
    const clientX = event.type.includes("touch") && event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
    const clientY = event.type.includes("touch") && event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
    const endX = (clientX - rect.left) * (canvas.width / rect.width);
    const endY = (clientY - rect.top) * (canvas.height / rect.height);

    // Calculate swipe direction and power
    const dx = endX - swipeStartX;
    const dy = endY - swipeStartY;
    const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 40, 2.5); // Increased sensitivity for better control
    targetX = ballX + dx * power;
    targetY = ballY + dy * power;

    // Start shooting animation
    isShooting = true;
    playerState = 'kicking';
    shotFrame = 0;

    // AI Goalkeeper decides dive direction
    const diveRandom = Math.random();
    if (targetX < 180) {
        goalkeeperDiveDirection = diveRandom < 0.5 ? 'left' : (diveRandom < 0.75 ? 'center' : 'right');
    } else if (targetX > 220) {
        goalkeeperDiveDirection = diveRandom < 0.5 ? 'right' : (diveRandom < 0.75 ? 'center' : 'left');
    } else {
        goalkeeperDiveDirection = diveRandom < 0.4 ? 'center' : (diveRandom < 0.7 ? 'left' : 'right');
    }

    swipeStartX = null;
    swipeStartY = null;
}

function checkGoal(x, y) {
    // Goal area: x between 130 and 270, y between 0 and 50 (widened for easier scoring)
    const inGoal = x >= 130 && x <= 270 && y >= 0 && y <= 50;
    // Goalkeeper area: x within 40 units of center dive position, y near the top
    let blocked = false;
    if (goalkeeperDiveDirection === 'left') {
        blocked = x >= 130 && x <= 170 && y <= 60; // Left side of goal
    } else if (goalkeeperDiveDirection === 'right') {
        blocked = x >= 230 && x <= 270 && y <= 60; // Right side of goal
    } else {
        blocked = x >= 170 && x <= 230 && y <= 60; // Center of goal
    }
    // 40% chance for goalkeeper to save if in correct position (reduced difficulty)
    const saveChance = Math.random() < 0.4;
    return inGoal && !(blocked && saveChance);
}

function updateMultiplier() {
    if (penaltyStreak >= 5) {
        penaltyMultiplier = 3;
    } else if (penaltyStreak >= 3) {
        penaltyMultiplier = 2;
    } else {
        penaltyMultiplier = 1;
    }
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

    // Clear canvas and draw pitch background
    ctx.fillStyle = "#2E7D32"; // Green grass
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw penalty box lines
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 0, 200, 100); // Penalty box
    ctx.beginPath();
    ctx.arc(200, 250, 5, 0, Math.PI * 2); // Penalty spot
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    // Draw goalpost
    ctx.fillStyle = "#fff";
    ctx.fillRect(130, 0, 140, 10); // Top bar
    ctx.fillRect(130, 0, 10, 50); // Left post
    ctx.fillRect(260, 0, 10, 50); // Right post
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(130, 10, 140, 40); // Net

    // Draw player (red rectangle with "7")
    ctx.save();
    if (playerState === 'kicking') {
        ctx.translate(200, 245);
        ctx.rotate(-15 * Math.PI / 180); // Tilt for kicking animation
        ctx.fillStyle = "#D32F2F"; // Red jersey
        ctx.fillRect(-20, -25, 40, 50);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("7", 0, 0);
        ctx.restore();
    } else {
        ctx.fillStyle = "#D32F2F"; // Red jersey
        ctx.fillRect(180, 220, 40, 50);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("7", 200, 245);
    }

    // Draw goalkeeper (colored rectangle based on dive direction)
    if (goalkeeperDiveDirection === 'left') {
        ctx.fillStyle = "#F44336"; // Red for left dive
        ctx.fillRect(130, 10, 40, 40);
    } else if (goalkeeperDiveDirection === 'right') {
        ctx.fillStyle = "#4CAF50"; // Green for right dive
        ctx.fillRect(230, 10, 40, 40);
    } else {
        ctx.fillStyle = "#2196F3"; // Blue for center
        ctx.fillRect(180, 10, 40, 40);
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (goalkeeperDiveDirection === 'left') {
        ctx.fillText("GK", 150, 30);
    } else if (goalkeeperDiveDirection === 'right') {
        ctx.fillText("GK", 250, 30);
    } else {
        ctx.fillText("GK", 200, 30);
    }

    // Draw ball (white circle with ⚽)
    if (!isShooting) {
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.font = "16px Roboto";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⚽", ballX, ballY);
    } else {
        // Animate ball towards target
        shotFrame++;
        const progress = Math.min(shotFrame / 20, 1);
        ballX = ballX + (targetX - ballX) * progress;
        ballY = ballY + (targetY - ballY) * progress;
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.font = "16px Roboto";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⚽", ballX, ballY);

        // Draw ball trail
        ctx.beginPath();
        ctx.moveTo(200, 250);
        ctx.lineTo(ballX, ballY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        if (progress === 1) {
            // Check if the shot scores
            penaltyShotsTaken++;
            const goalScored = checkGoal(targetX, targetY);
            if (goalScored) {
                penaltyScore += 100 * penaltyMultiplier;
                penaltyStreak++;
                updateMultiplier();
                feedbackMessage = "Goal!";
            } else {
                penaltyStreak = 0;
                penaltyMultiplier = 1;
                feedbackMessage = "Miss!";
            }
            feedbackTimer = 60; // Show feedback for ~1 second (assuming 60 FPS)

            // Check for Sudden Death after 5 shots
            if (penaltyShotsTaken >= 5 && penaltyScore >= 400 && !isSuddenDeath) {
                isSuddenDeath = true;
                updateRewardStatus("Sudden Death Mode! Miss a shot and the game ends!");
            }

            // End game in Sudden Death if the player misses
            if (isSuddenDeath && !goalScored) {
                gameOver = true;
                endPenaltyShootout();
            }

            updateGameScore();
            isShooting = false;
            playerState = 'standing';
            goalkeeperDiveDirection = 'center';

            // Reset ball position
            ballX = 200;
            ballY = 250;
            targetX = ballX;
            targetY = ballY;
        }
    }

    // Draw feedback message
    if (feedbackTimer > 0) {
        ctx.font = "bold 20px Roboto";
        ctx.fillStyle = feedbackMessage === "Goal!" ? "#00FF00" : "#FF0000";
        ctx.textAlign = "center";
        ctx.fillText(feedbackMessage, canvas.width / 2, canvas.height / 2);
        feedbackTimer--;
    }

    requestAnimationFrame(gameLoop);
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
        playerLevel = Math.floor(currentPoints / 100000) + 1;
        const playerLevelDisplay = document.getElementById("player-level");
        if (playerLevelDisplay) playerLevelDisplay.textContent = playerLevel;
        localStorage.setItem("level", playerLevel);
    } catch (e) {
        console.error("Error in updateLevel:", e);
    }
}

function buyPoints() {
    try {
        currentPoints += 1000;
        updatePointsAndLevel();
    } catch (e) {
        console.error("Error in buyPoints:", e);
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
            updateRewardStatus(`You converted ${tokens} CR7SIU tokens!`);
            updatePointsAndLevel();
        } else {
            updateRewardStatus("Not enough points.");
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
        updateTaskButtons();
        checkAllTasksCompleted();
        currentPoints += 5000;
        updatePointsAndLevel();
        showRewardToast(`Reward Claimed! 5000 CR7SIU Points have been credited to your account.`);
        const button = document.getElementById(`task-${task}`);
        if (button) {
            button.disabled = true;
            button.textContent = "Claimed";
        }
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
    } catch (e) {
        console.error("Error in updateTaskButtons:", e);
    }
}

function checkAllTasksCompleted() {
    try {
        if (Object.values(tasksCompleted).every(Boolean)) {
            const claimButton = document.getElementById("claim-rewards-btn");
            if (claimButton) {
                const canClaim = isNewDay(lastRewardsClaim);
                claimButton.disabled = !canClaim;
                updateRewardStatus(canClaim ? "All tasks completed! You can now claim additional rewards." : "You can only claim rewards once per day!");
            }
        }
    } catch (e) {
        console.error("Error in checkAllTasksCompleted:", e);
    }
}

function claimRewards() {
    try {
        console.log("Attempting to claim rewards");
        if (!isNewDay(lastRewardsClaim)) {
            updateRewardStatus("You can only claim rewards once per day!");
            return;
        }

        if (Object.values(tasksCompleted).every(Boolean)) {
            currentPoints += 5000;
            updatePointsAndLevel();
            showRewardToast("Reward Claimed! 5000 CR7SIU Points have been credited to your account.");
            resetTasks();
            lastRewardsClaim = Date.now();
            localStorage.setItem("lastRewardsClaim", lastRewardsClaim);
            const claimButton = document.getElementById("claim-rewards-btn");
            if (claimButton) {
                claimButton.disabled = true;
                claimButton.textContent = "Claimed";
            }
        } else {
            updateRewardStatus("Complete all tasks before claiming rewards.");
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
        const improvements = ['Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing', 'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity', 'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power', 'Ball Handling', 'Acceleration'];
        const container = document.getElementById("attributes-container");
        if (!container) return;
        let html = '';
        improvements.forEach((attr, index) => {
            const level = attributes[attr] || 1;
            const cost = 500 + 250 * (level - 1);
            html += `
                <div class="attribute-card">
                    <h3>${attr}</h3>
                    <p>Upgrade Cost: ${cost} points</p>
                    <p>Level: <span id="attribute-level-${index}">${level}</span></p>
                    <button onclick="upgradeSkill('${attr}', ${index}, ${cost})">Upgrade</button>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        console.error("Error in displayImprovements:", e);
    }
}

function upgradeSkill(attribute, index, cost) {
    try {
        const level = attributes[attribute] || 1;
        if (currentPoints >= cost) {
            currentPoints -= cost;
            attributes[attribute] = level + 1;
            updatePointsAndLevel();
            localStorage.setItem("attributes", JSON.stringify(attributes));
            const levelDisplay = document.getElementById(`attribute-level-${index}`);
            if (levelDisplay) levelDisplay.textContent = attributes[attribute];
            if (attributes[attribute] % 10 === 0) {
                currentPoints += 2500;
                updatePointsAndLevel();
                updateRewardStatus("Level milestone achieved! Cashback of 2500 points awarded.");
            }
        } else {
            updateRewardStatus("Not enough points!");
        }
    } catch (e) {
        console.error("Error in upgradeSkill:", e);
    }
}

function generateReferralLink() {
    try {
        if (username) {
            let link = `${window.location.origin}/?ref=${username}`;
            const referralField = document.getElementById('referral-link-field');
            if (referralField) referralField.value = link;
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
        // Update ad, check-in, and spin buttons
        if (isNewDay(lastAdClaim)) enableSpecificButton('ad-claim-button');
        else disableSpecificButton('ad-claim-button');
        if (isNewDay(lastCheckInClaim)) enableSpecificButton('check-in-button');
        else disableSpecificButton('check-in-button');
        if (isNewDay(lastSpinClaim)) enableSpecificButton('spin-button');
        else disableSpecificButton('spin-button');

        // Update task buttons
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

        // Update Claim Rewards button
        const claimButton = document.getElementById("claim-rewards-btn");
        if (claimButton) {
            const canClaim = isNewDay(lastRewardsClaim);
            claimButton.disabled = !canClaim || !Object.values(tasksCompleted).every(Boolean);
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
            button.textContent = button.id === 'spin-button' ? 'Spin to Win!' : 'Claim Reward';
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
            currentPoints += 100;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You earned 100 CR7SIU Points from the ad reward.");
            showRewardToast("Reward Claimed! 100 CR7SIU Points have been credited to your account.");
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
            currentPoints += 500;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You earned 500 CR7SIU Points for your daily check-in.");
            showRewardToast("Reward Claimed! 500 CR7SIU Points have been credited to your account.");
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

document.addEventListener('touchstart', function(event) {
    try {
        if (event.target.tagName === 'BUTTON') {
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
        if (document.getElementById("rewards") && !document.getElementById("rewards").classList.contains("hidden")) {
            drawWheel();
        }
    } catch (e) {
        console.error("Error in DOMContentLoaded:", e);
    }
});