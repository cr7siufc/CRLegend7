// Store user data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];

// Show username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
    checkForReferral(); // Check if user came from a referral link
}
// Add last claim times to track daily resets
let lastAdClaim = parseInt(localStorage.getItem("lastAdClaim")) || 0;
let lastCheckInClaim = parseInt(localStorage.getItem("lastCheckInClaim")) || 0;
let lastSpinClaim = parseInt(localStorage.getItem("lastSpinClaim")) || 0;

function isNewDay(lastClaimTime) {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    return now - lastClaimTime >= oneDay;
}

function updateButtonStates() {
    const now = Date.now();
    if (isNewDay(lastAdClaim)) enableSpecificButton('ad-claim-button');
    else disableSpecificButton('ad-claim-button');
    if (isNewDay(lastCheckInClaim)) enableSpecificButton('check-in-button');
    else disableSpecificButton('check-in-button');
    if (isNewDay(lastSpinClaim)) enableSpecificButton('spin-button');
    else disableSpecificButton('spin-button');
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
    resetTasks();  // Reset tasks at the start of the session if they're all completed
    displayTasks();  // This will reflect the reset tasks
    displayReferrals();
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
        updateRewardStatus(`You converted ${tokens} CR7SIU tokens!`);
    } else {
        updateRewardStatus("Not enough points.");
    }
}

function displayTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = Object.keys(tasksCompleted).map(task => `
        <div class="task">
            <h3>Complete ${task.charAt(0).toUpperCase() + task.slice(1)} Task</h3>
            <p>${task === 'youtube' ? 'Watch and like our latest video' : 
                task === 'xAccount' ? 'Tweet with our hashtag' : 
                'Share our post on your timeline'}</p>
            <button onclick="completeTask('${task}')" ${tasksCompleted[task] ? 'disabled' : ''}>
                ${tasksCompleted[task] ? 'Completed' : 'Complete'}
            </button>
        </div>
    `).join('');
    updateTaskButtons();
}

function completeTask(task) {
    if (!tasksCompleted[task]) {
        tasksCompleted[task] = true;
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        updateTaskButtons();
        checkAllTasksCompleted();
        // Reward for completing each task
        currentPoints += 5000;
        updatePointsAndLevel();
        updateRewardStatus(`Congratulations! You earned 5000 CR7SIU Points for completing the ${task} task.`);
    }
}

function updateTaskButtons() {
    Object.keys(tasksCompleted).forEach(task => {
        const button = document.querySelector(`#tasks-container .task button[onclick="completeTask('${task}')"]`);
        if (button) { 
            button.disabled = tasksCompleted[task];
            button.textContent = tasksCompleted[task] ? "Completed" : "Complete";
        }
    });
}

function checkAllTasksCompleted() {
    if (Object.values(tasksCompleted).every(Boolean)) {
        document.getElementById("claim-rewards-btn").disabled = false;
        updateRewardStatus("All tasks completed! You can now claim additional rewards.");
    }
}

function claimRewards() {
    if (Object.values(tasksCompleted).every(Boolean)) {
        // Additional reward for completing all tasks
        currentPoints += 5000;
        updatePointsAndLevel();
        updateRewardStatus("Congratulations! You earned an extra 5000 CR7SIU Points for completing all tasks.");
        resetTasks(); // Reset tasks after claiming all rewards
        document.getElementById("claim-rewards-btn").disabled = true; // Disable claim button after claiming
    } else {
        updateRewardStatus("Complete all tasks before claiming rewards.");
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
            updateRewardStatus("Level milestone achieved! Cashback of 2500 points awarded.");
        }
    } else {
        updateRewardStatus("Not enough points!");
    }
}

// Function to generate referral link
function generateReferralLink() {
    if (username) {
        let link = `${window.location.origin}/?ref=${username}`;
        document.getElementById('referral-link-field').value = link;
        updateRewardStatus("Referral link generated. Share this to earn points!");
    } else {
        updateRewardStatus("Please set a username first!");
    }
}

// Check if user joined from a referral link
function checkForReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref && ref !== username && !referralUsers.includes(ref)) {
        referralUsers.push(ref);
        localStorage.setItem("referralUsers", JSON.stringify(referralUsers));
        currentPoints += 5000; // Reward for referring
        updatePointsAndLevel();
        updateRewardStatus("Congratulations! You've earned 5000 CR7SIU Points for a successful referral!");
    }
}

function shareLink(platform) {
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
            // Fallback for browsers without Web Share API
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
}

function toggleShareOptions() {
    var shareOptions = document.getElementById('social-share');
    if (shareOptions) shareOptions.classList.toggle('hidden');
}

function displayReferrals() {
    const referralList = document.getElementById("referrals-list");
    if (referralList) {
        referralList.innerHTML = referralUsers.map(user => `<div>${user}</div>`).join('');
        document.getElementById("referral-count").textContent = referralUsers.length;
    }
}

// Reset tasks function
function resetTasks() {
    tasksCompleted = { youtube: false, xAccount: false, facebook: false };
    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
    document.getElementById("claim-rewards-btn").disabled = true;
    updateTaskButtons();
}

function enableSpecificButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = false;
        button.textContent = button.id === 'spin-button' ? 'Spin to Win!' : 'Claim Reward';
    }
}

function disableSpecificButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = true;
        button.textContent = 'Claimed';
    }
}

function completeAdTask() {
    if (isNewDay(lastAdClaim)) {
        currentPoints += 100;
        updatePointsAndLevel();
        updateRewardStatus("Congratulations! You earned 100 CR7SIU Points from the ad reward.");
        lastAdClaim = Date.now();
        localStorage.setItem("lastAdClaim", lastAdClaim);
        disableSpecificButton('ad-claim-button');
    } else {
        updateRewardStatus("You can only claim this reward once per day!");
    }
}

function completeCheckInTask() {
    if (isNewDay(lastCheckInClaim)) {
        currentPoints += 500;
        updatePointsAndLevel();
        updateRewardStatus("Congratulations! You earned 500 CR7SIU Points for your daily check-in.");
        lastCheckInClaim = Date.now();
        localStorage.setItem("lastCheckInClaim", lastCheckInClaim);
        disableSpecificButton('check-in-button');
    } else {
        updateRewardStatus("You can only claim this reward once per day!");
    }
}

function spinWheel() {
    if (isNewDay(lastSpinClaim)) {
        const rewards = [100, 250, 500, 1000];
        let reward = rewards[Math.floor(Math.random() * rewards.length)];
        currentPoints += reward;
        updatePointsAndLevel();
        updateRewardStatus(`Congratulations! You won ${reward} CR7SIU Points from the wheel!`);
        lastSpinClaim = Date.now();
        localStorage.setItem("lastSpinClaim", lastSpinClaim);
        disableSpecificButton('spin-button');
    } else {
        updateRewardStatus("You can only spin the wheel once per day!");
    }
}
// Update reward status function
function updateRewardStatus(message) {
    document.getElementById("reward-status").innerText = message;
}

// Mobile optimization
document.addEventListener('touchstart', function(event) {
    if (event.target.tagName === 'BUTTON') {
        event.target.click();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    updateRewardStatus("Welcome back! Complete your daily tasks to claim rewards.");
    updateButtonStates(); // Check button states on load
});