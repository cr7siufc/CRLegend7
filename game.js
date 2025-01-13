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
let lastRewardClaimTime = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0; // To store last reward claim time

// Show username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
}

// Set up username
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

// Load user session data
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

// Show a specific page
function showPage(page) {
    document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

// Points and level management
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

function buyPoints() {
    currentPoints += 1000;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
}

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

// Display and upgrade player attributes
function displayImprovements() {
    const improvements = [
        'Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing', 'Defending', 
        'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity', 'Leadership', 
        'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power', 'Ball Handling', 'Acceleration'
    ];
    const container = document.getElementById("attributes-container");
    container.innerHTML = improvements.map((improvement, index) => {
        const level = attributes[improvement] || 1;
        const cost = 500 + 250 * (level - 1);
        return `
            <div class="attribute-card">
                <h3>${improvement}</h3>
                <p>Upgrade Cost: ${cost} points</p>
                <p>Level: <span id="attribute-level-${index}">${level}</span></p>
                <button onclick="upgradeSkill('${improvement}', ${index}, ${cost})">Upgrade</button>
            </div>
        `;
    }).join('');
}

function upgradeSkill(attribute, index, cost) {
    const level = attributes[attribute] || 1;
    if (currentPoints >= cost) {
        currentPoints -= cost;
        attributes[attribute] = level + 1;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("attributes", JSON.stringify(attributes));
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        document.getElementById(`attribute-level-${index}`).textContent = attributes[attribute];
        if (attributes[attribute] % 10 === 0) {
            currentPoints += 2500;
            localStorage.setItem("points", currentPoints);
            alert("Level milestone achieved! Cashback of 2500 points awarded.");
        }
        alert("Upgrade successful!");
    } else {
        alert("Not enough points!");
    }
}

// Tasks and rewards
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
