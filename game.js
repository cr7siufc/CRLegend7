// Store user data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];
let lastRewardClaimTime = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0;

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
    document.getElementById("cr7siu-points").textContent = currentPoints;
    displayImprovements();
    displayTasks();
    displayReferrals();
    updateSpinButton();
    showPage('home');
}

function showPage(page) {
    document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

function earnPoints() {
    currentPoints += 5;
    updatePointsAndLevel();
}

function updatePointsAndLevel() {
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("cr7siu-points").textContent = currentPoints;
    updateLevel();
}

function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level").textContent = playerLevel;
    localStorage.setItem("level", playerLevel);
}

function buyPoints() {
    currentPoints += 1000;
    updatePointsAndLevel();
}

function convertToTokens() {
    const tokens = Math.floor(currentPoints / 5000);
    if (tokens > 0) {
        currentPoints -= tokens * 5000;
        currentTokens += tokens;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
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
            updatePointsAndLevel();
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
    let html = '';
    for (let i = 0; i < improvements.length; i += 2) {
        html += `<div class="attribute-row">`;
        for (let j = 0; j < 2 && i + j < improvements.length; j++) {
            const attr = improvements[i + j];
            const level = attributes[attr] || 1;
            const cost = 500 + 250 * (level - 1);
            html += `
                <div class="attribute-card">
                    <h3>${attr}</h3>
                    <p>Upgrade Cost: ${cost} points</p>
                    <p>Level: <span id="attribute-level-${i + j}">${level}</span></p>
                    <button onclick="upgradeSkill('${attr}', ${i + j}, ${cost})">Upgrade</button>
                </div>
            `;
        }
        html += `</div>`;
    }
    container.innerHTML = html;
}

function upgradeSkill(attribute, index, cost) {
    const level = attributes[attribute] || 1;
    if (currentPoints >= cost) {
        currentPoints -= cost;
        attributes[attribute] = level + 1;
        updatePointsAndLevel();
        localStorage.setItem("attributes", JSON.stringify(attributes));
        document.getElementById(`attribute-level-${index}`).textContent = attributes[attribute];
        if (attributes[attribute] % 10 === 0) {
            currentPoints += 2500;
            updatePointsAndLevel();
            alert("Level milestone achieved! Cashback of 2500 points awarded.");
        }
        alert("Upgrade successful!");
    } else {
        alert("Not enough points!");
    }
}

// ... (Other functions like getISTTime, startTimer, etc., remain as they were)

// Referrals and reward system simplification
function checkForReferral() {
    // Implement referral link generation and checking here
    // Example:
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ref')) {
        const referrer = urlParams.get('ref');
        if (!referralUsers.includes(referrer)) {
            referralUsers.push(referrer);
            localStorage.setItem("referralUsers", JSON.stringify(referralUsers));
            currentPoints += 100; // Example bonus for referred user
            updatePointsAndLevel();
            alert("Welcome! You've earned 100 points for using a referral link!");
        }
    }
}

function displayReferrals() {
    const referralCount = document.getElementById("referral-count");
    referralCount.textContent = referralUsers.length;
}

// Mobile optimization - Consider using touch events for buttons if needed
document.addEventListener('touchstart', function(event) {
    if (event.target.tagName === 'BUTTON') {
        event.target.click();
    }
});

// Ensure all functions for animations, timers, etc., are optimized for mobile performance

document.addEventListener('DOMContentLoaded', () => {
    startTimer('spin-timer');
    updateSpinButton();
    // Add any initial setup for animations or other visual elements here
});