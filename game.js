// Store user data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, x: false, facebook: false };
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
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = Object.keys(tasksCompleted).map(task => `
        <div class="task">
            <h3>Complete ${task.charAt(0).toUpperCase() + task.slice(1)} Task</h3>
            <p>${task === 'youtube' ? 'Watch and like our latest video' : 
                task === 'x' ? 'Tweet with our hashtag' : 
                'Share our post on your timeline'}</p>
            <button onclick="completeTask('${task}')" ${tasksCompleted[task] ? 'disabled class="completed"' : ''}>Complete</button>
            ${tasksCompleted[task] ? '<span class="completed">Completed</span>' : ''}
        </div>
    `).join('');
    updateTaskButtons();
}

function completeTask(task) {
    if (!tasksCompleted[task]) {
        tasksCompleted[task] = true;
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        alert(`Task "${task}" marked as completed!`);
        displayTasks();  // Refresh the tasks display
        updateTaskButtons();
    }
}

function updateTaskButtons() {
    const claimButton = document.getElementById("claim-rewards-btn");
    claimButton.disabled = !Object.values(tasksCompleted).every(Boolean);
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
    // ... (keep existing code)
}

function upgradeSkill(attribute, index, cost) {
    // ... (keep existing code)
}

// Function to generate referral link
function generateReferralLink() {
    // ... (keep existing code)
}

// Check if user joined from a referral link
function checkForReferral() {
    // ... (keep existing code)
}

function shareLink(platform) {
    // ... (keep existing code)
}

function toggleShareOptions() {
    // ... (keep existing code)
}

function displayReferrals() {
    // ... (keep existing code)
}

// Time functions for rewards
function getISTTime() {
    // ... (keep existing code)
}

function startTimer(elementId, resetTime = 86400000) {
    // ... (keep existing code)
}

function enableRewardButtons() {
    // ... (keep existing code)
}

function disableRewardButtons() {
    // ... (keep existing code)
}

function updateSpinButton() {
    // ... (keep existing code)
}

// Mobile optimization
document.addEventListener('touchstart', function(event) {
    if (event.target.tagName === 'BUTTON') {
        event.target.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    startTimer('spin-timer');
    updateSpinButton();
});