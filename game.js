// Store username, points, tokens, and other data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];
let lastSpinTime = parseInt(localStorage.getItem("lastSpinTime")) || 0;
let spinClaimed = localStorage.getItem("spinClaimed") === "true";
let lastRewardClaimTime = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0;

// Show username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
}

function setUsername() {
    const input = document.getElementById("username-input").value.trim();
    if (input) {
        localStorage.setItem("username", input);
        username = input;
        loadSession();
    } else {
        alert("Please enter a valid username.");
    }
}

function loadSession() {
    document.getElementById("username-setup").classList.add("hidden");
    document.getElementById("username-display").textContent = username;
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("tokens-display").textContent = currentTokens;
    document.getElementById("player-level").textContent = playerLevel;
    displayImprovements();
    displayTasks();
    updateSpinButton();
    updateRewardsLink();
    showPage('home');
}

function showPage(page) {
    document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

// Points management
function earnPoints() {
    currentPoints += 5;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    updateLevel();
}

function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level").textContent = playerLevel;
    localStorage.setItem("level", playerLevel);
}

// Token conversion
function convertToTokens() {
    const tokens = Math.floor(currentPoints / 5000);
    if (tokens > 0) {
        currentPoints -= tokens * 5000;
        currentTokens += tokens;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        document.getElementById("tokens-display").textContent = currentTokens;
        alert(`You converted ${tokens} CR7SIU tokens!`);
    } else {
        alert("Not enough points.");
    }
}

// Display and manage tasks
function displayTasks() {
    const tasks = [
        { name: "Subscribe to the Youtube Channel", url: "https://www.youtube.com/@CR7SIUnextbigthing", key: "youtube" },
        { name: "Join the X Account", url: "https://x.com/cr7siucoin", key: "xAccount" },
        { name: "Like and join the Facebook Page", url: "https://www.facebook.com/profile.php?id=61571519741834&mibextid=ZbWKwL", key: "facebook" }
    ];
    const tasksContainer = document.getElementById("task-section");
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task">
            <a href="${task.url}" target="_blank" onclick="enableTaskButton('${task.key}')">${task.name}</a>
            <button id="validate-${task.key}" onclick="completeTask('${task.key}')" ${tasksCompleted[task.key] ? 'disabled' : ''}>Mark as Done</button>
            ${tasksCompleted[task.key] ? '<span class="completed-task">Completed</span>' : ''}
        </div>
    `).join('');
    updateTaskButtons();
}

function completeTask(task) {
    tasksCompleted[task] = true;
    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
    alert(`Task "${task}" marked as completed!`);
    updateTaskButtons();
}

function updateTaskButtons() {
    Object.keys(tasksCompleted).forEach(task => {
        const button = document.getElementById(`validate-${task}`);
        if (tasksCompleted[task]) {
            button.disabled = true;
            button.textContent = "Completed";
        }
    });
    document.getElementById("claim-rewards-btn").disabled = !Object.values(tasksCompleted).every(Boolean);
}

// Claim rewards
function claimRewards() {
    if (Object.values(tasksCompleted).every(Boolean)) {
        if (!localStorage.getItem("rewardsClaimed")) {
            currentPoints += 5000;
            localStorage.setItem("points", currentPoints);
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
            alert("Congratulations! You earned 5000 CR7SIU Points.");
            localStorage.setItem("rewardsClaimed", true);
        } else {
            alert("Rewards already claimed.");
        }
    } else {
        alert("Complete all tasks before claiming rewards.");
    }
}

// Spin wheel functionality
function spinWheel() {
    const rewards = [2500, 3500, 5500, 6500, 7500];
    const spinButton = document.getElementById("spin-button");
    spinButton.disabled = true;
    document.getElementById("wheel").style.transform = `rotate(${Math.random() * 360}deg)`;
    setTimeout(() => {
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        currentPoints += reward;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        alert(`You earned ${reward} CR7SIU Points!`);
        spinClaimed = true;
        localStorage.setItem("spinClaimed", "true");
        localStorage.setItem("lastSpinTime", Date.now());
        updateSpinButton();
    }, 3000);
}

function updateSpinButton() {
    const spinButton = document.getElementById("spin-button");
    const currentTime = Date.now();
    if (spinClaimed || currentTime - lastSpinTime < 86400000) {
        spinButton.disabled = true;
        document.getElementById("spin-claim-time").textContent = `Next spin available on ${new Date(lastSpinTime + 86400000).toLocaleString()}`;
    } else {
        spinButton.disabled = false;
    }
}

// Quarterly reward link
function claimRewardLink() {
    const currentTime = Date.now();
    if (currentTime - lastRewardClaimTime > 7776000000) { // 3 months in milliseconds
        currentPoints += 2500;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        alert("You claimed 2500 CR7SIU Points!");
        lastRewardClaimTime = currentTime;
        localStorage.setItem("lastRewardClaimTime", lastRewardClaimTime);
    } else {
        alert("You can claim this reward only once every 3 months.");
    }
}

function updateRewardsLink() {
    const currentTime = Date.now();
    document.getElementById("rewards-link").disabled = currentTime - lastRewardClaimTime <= 7776000000;
}

// Additional functions for improvements, referrals, and UI updates remain unchanged.
