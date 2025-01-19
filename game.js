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
    resetDailyTasks();  // Reset tasks if it's a new day or first visit
    displayTasks();  // This will reflect the reset tasks
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
    let now = getISTTime().getTime();
    if (now - lastRewardClaimTime >= 86400000 || lastRewardClaimTime === 0) { // Allow if first claim or 24 hours have passed
        if (!tasksCompleted[task]) {
            tasksCompleted[task] = true;
            localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
            alert(`Task "${task}" marked as completed!`);
            updateTaskButtons();
        } else {
            alert("This task has already been completed for today.");
        }
    } else {
        alert("You can only complete tasks once every 24 hours.");
    }
}

function updateTaskButtons() {
    Object.keys(tasksCompleted).forEach(task => {
        const button = document.getElementById(`validate-${task}`);
        if (button) { // Check if button exists to avoid errors
            if (tasksCompleted[task]) {
                button.disabled = true;
                button.textContent = "Completed";
                button.classList.add("completed");
            } else {
                button.disabled = false;
                button.textContent = "Mark as Done";
                button.classList.remove("completed");
            }
        }
    });
    document.getElementById("claim-rewards-btn").disabled = !Object.values(tasksCompleted).every(Boolean);
}

function claimRewards() {
    let now = getISTTime().getTime();
    if (now - lastRewardClaimTime >= 86400000 || lastRewardClaimTime === 0) { // Allow if first claim or 24 hours have passed
        if (Object.values(tasksCompleted).every(Boolean)) {
            currentPoints += 5000;
            updatePointsAndLevel();
            alert("Congratulations! You earned 5000 CR7SIU Points.");
            localStorage.setItem("rewardsClaimed", "true"); // Set to string for consistency
            lastRewardClaimTime = now;
            localStorage.setItem("lastRewardClaimTime", lastRewardClaimTime.toString());
            resetDailyTasks(); // Reset tasks after claim
            updateSpinButton(); // Update button availability after claiming
        } else {
            alert("Complete all tasks before claiming rewards.");
        }
    } else {
        alert("You can only claim rewards once every 24 hours.");
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

// Function to generate referral link
function generateReferralLink() {
    if (username) {
        let link = `${window.location.origin}/?ref=${username}`;
        document.getElementById('referral-link-field').value = link;
        alert("Referral link generated. Share this to earn points!");
    } else {
        alert("Please set a username first!");
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
        alert("Congratulations! You've earned 5000 CR7SIU Points for a successful referral!");
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
                    alert("Instagram sharing not directly supported. Share link manually.");
                    break;
            }
        }
    } else {
        alert("Please generate a referral link first!");
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

// Time functions for rewards
function getISTTime() {
    let now = new Date();
    now.setHours(now.getHours() + 5, now.getMinutes() + 30);
    return now;
}

function startTimer(elementId, resetTime = 86400000) { // 24 hours in milliseconds
    let now = getISTTime();
    let reset = new Date(now);
    reset.setHours(0, 0, 0, 0); // Set to midnight IST
    if (now > reset) reset.setDate(reset.getDate() + 1); // If past midnight, set for next day

    let timeLeft = reset - now;
    let el = document.getElementById(elementId);
    if (el) {
        el.textContent = "00:00:00"; // Reset timer display
        let timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1000;
                let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                el.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                clearInterval(timer);
                el.textContent = "00:00:00";
                resetDailyTasks(); // Reset at midnight
                enableRewardButtons();
                updateSpinButton(); // Ensure buttons are updated after reset
            }
        }, 1000);
    }
}

function enableRewardButtons() {
    ['ad-claim-button', 'check-in-button', 'spin-button'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = false;
    });
}

function disableRewardButtons() {
    ['ad-claim-button', 'check-in-button', 'spin-button'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.disabled = true;
    });
}

function resetDailyTasks() {
    let now = getISTTime();
    let resetTime = new Date(now);
    resetTime.setHours(0, 0, 0, 0); // Reset to midnight IST
    
    if (now >= resetTime || lastRewardClaimTime === 0) {
        // Reset only if it's midnight or later (i.e., new day has started) or if it's the first visit
        tasksCompleted = { youtube: false, xAccount: false, facebook: false };
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        localStorage.removeItem("rewardsClaimed");  // Remove flag for rewards claimed
        lastRewardClaimTime = now.getTime();  // Update last claim time
        localStorage.setItem("lastRewardClaimTime", lastRewardClaimTime.toString());
        enableRewardButtons(); // Enable buttons for a new day
    }
}

function updateSpinButton() {
    const now = getISTTime().getTime();
    const lastClaim = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0;

    if (now - lastClaim >= 86400000 || lastClaim === 0) { // Allow if first claim or 24 hours have passed
        enableRewardButtons();
    } else {
        disableRewardButtons();
    }
    startTimer('spin-timer');
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