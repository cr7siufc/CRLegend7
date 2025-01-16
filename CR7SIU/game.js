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
    checkForReferral(); // Check if user came from a referral link
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
    displayReferrals(); // Display the referral users
    updateSpinButton();
    updateRewardsLink();
    showPage('home');
}

function showPage(page) {
    document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

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

function displayTasks() {
    const tasksContainer = document.getElementById("task-section");
    tasksContainer.innerHTML = Object.keys(tasksCompleted).map(task => `
        <div class="task">
            <a href="https://www.${task}.com" target="_blank" onclick="enableTaskButton('${task}')">Complete ${task} task</a>
            <button id="validate-${task}" onclick="completeTask('${task}')" ${tasksCompleted[task] ? 'disabled' : ''}>Mark as Done</button>
            ${tasksCompleted[task] ? '<span class="completed-task">Completed</span>' : ''}
        </div>
    `).join('');
    updateTaskButtons();
}

function enableTaskButton(task) {
    document.getElementById(`validate-${task}`).disabled = false;
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
            button.classList.add("completed");
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

function displayImprovements() {
    const improvements = ['Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing', 'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity', 'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power', 'Ball Handling', 'Acceleration'];
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

// Generate and display referral link
function generateReferralLink() {
    if (!username) {
        alert("Please set your username first!");
        return;
    }

    const referralLink = `https://t.me/CRLegend7_Bot?referral=${username}`;
    document.getElementById("referral-link-field").value = referralLink;
    document.getElementById("referral-link-field").select();
    document.execCommand("copy");
    alert("Referral link copied to clipboard!");
}

// Display Referrals (users who used your referral link)
function displayReferrals() {
    const container = document.getElementById("referral-container");
    container.innerHTML = referralUsers.map(user => `
        <div class="referral-card">
            <h3>${user}</h3>
            <button onclick="pokeUser('${user}')">Poke</button>
        </div>
    `).join('');
}

// Add referrer to referral users list
function checkForReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerUsername = urlParams.get('referral');
    if (referrerUsername && !referralUsers.includes(referrerUsername)) {
        referralUsers.push(referrerUsername);
        localStorage.setItem('referralUsers', JSON.stringify(referralUsers));
        updateReferralDisplay();
    }
}

function updateReferralDisplay() {
    const referralCount = referralUsers.length;
    document.getElementById("referral-count").textContent = referralCount;
    displayReferrals();
}

function pokeUser(user) {
    alert(`Poking ${user}...`);
}

// Spin Button Management
function updateSpinButton() {
    const currentTime = new Date().getTime();
    if (currentTime - lastSpinTime > 86400000) {
        spinClaimed = false;
        localStorage.setItem('spinClaimed', spinClaimed);
        document.getElementById("spin-btn").disabled = false;
    } else {
        document.getElementById("spin-btn").disabled = spinClaimed;
    }
}

function claimSpinReward() {
    if (spinClaimed) {
        alert("You have already claimed your spin today.");
        return;
    }

    if (currentPoints >= 5000) {
        currentPoints += 10000; // Reward after spin
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        alert("You earned 10000 points from the spin!");
        lastSpinTime = new Date().getTime();
        spinClaimed = true;
        localStorage.setItem("spinClaimed", true);
        updateSpinButton();
    } else {
        alert("You need at least 5000 points to spin.");
    }
}

// Handling reward claim link (display on homepage)
function updateRewardsLink() {
    const timeDifference = new Date().getTime() - lastRewardClaimTime;
    const nextRewardTime = timeDifference > 86400000; // One day in milliseconds
    document.getElementById("reward-link").style.display = nextRewardTime ? "block" : "none";
}
