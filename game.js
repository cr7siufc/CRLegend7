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

// Wheel data
const wheelRewards = [500, 1000, 1500, 2000, 2500, 300];
const wheelColors = ["#FF4500", "#32CD32", "#1E90FF", "#FFD700", "#FF00FF", "#00CED1"];
let isSpinning = false;

// Show username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
    checkForReferral();
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
    resetTasks();
    displayTasks();
    displayReferrals();
    showPage('home');
}

function showPage(page) {
    document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
    const targetPage = document.getElementById(page);
    if (targetPage) {
        targetPage.classList.remove("hidden");
    } else {
        console.error(`Page with id "${page}" not found.`);
    }
    // Redraw wheel if navigating to Rewards
    if (page === "rewards") {
        drawWheel();
    }
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
    try {
        const tasksContainer = document.getElementById("tasks-container");
        if (!tasksContainer) return;
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
    } catch (e) {
        console.error("Error in displayTasks:", e);
    }
}

function completeTask(task) {
    if (!tasksCompleted[task]) {
        tasksCompleted[task] = true;
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        updateTaskButtons();
        checkAllTasksCompleted();
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
        currentPoints += 5000;
        updatePointsAndLevel();
        updateRewardStatus("Congratulations! You earned an extra 5000 CR7SIU Points for completing all tasks.");
        resetTasks();
        document.getElementById("claim-rewards-btn").disabled = true;
    } else {
        updateRewardStatus("Complete all tasks before claiming rewards.");
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

function generateReferralLink() {
    if (username) {
        let link = `${window.location.origin}/?ref=${username}`;
        document.getElementById('referral-link-field').value = link;
        updateRewardStatus("Referral link generated. Share this to earn points!");
    } else {
        updateRewardStatus("Please set a username first!");
    }
}

function checkForReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref && ref !== username && !referralUsers.includes(ref)) {
        referralUsers.push(ref);
        localStorage.setItem("referralUsers", JSON.stringify(referralUsers));
        currentPoints += 5000;
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
    try {
        const referralList = document.getElementById("referrals-list");
        if (referralList) {
            referralList.innerHTML = referralUsers.map(user => `<div>${user}</div>`).join('');
            document.getElementById("referral-count").textContent = referralUsers.length;
        }
    } catch (e) {
        console.error("Error in displayReferrals:", e);
    }
}

function resetTasks() {
    tasksCompleted = { youtube: false, xAccount: false, facebook: false };
    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
    document.getElementById("claim-rewards-btn").disabled = true;
    updateTaskButtons();
}

function isNewDay(lastClaimTime) {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    return now - lastClaimTime >= oneDay;
}

function updateButtonStates() {
    if (isNewDay(lastAdClaim)) enableSpecificButton('ad-claim-button');
    else disableSpecificButton('ad-claim-button');
    if (isNewDay(lastCheckInClaim)) enableSpecificButton('check-in-button');
    else disableSpecificButton('check-in-button');
    if (isNewDay(lastSpinClaim)) enableSpecificButton('spin-button');
    else disableSpecificButton('spin-button');
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

function drawWheel(angle = 0) {
    const canvas = document.getElementById("wheelCanvas");
    if (!canvas) return; // Prevent errors if canvas isn't available
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
}

function spinWheel() {
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
            updateRewardStatus(`Congratulations! You won ${reward} CR7SIU Points!`);
            lastSpinClaim = Date.now();
            localStorage.setItem("lastSpinClaim", lastSpinClaim);
        }
    }

    requestAnimationFrame(animateWheel);
}

function updateRewardStatus(message) {
    const statusElement = document.getElementById("reward-status");
    if (statusElement) {
        statusElement.innerText = message;
    }
}

document.addEventListener('touchstart', function(event) {
    if (event.target.tagName === 'BUTTON') {
        event.target.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateRewardStatus("Welcome back! Complete your daily tasks to claim rewards.");
    updateButtonStates();
    // Only draw the wheel if on the Rewards page
    if (document.getElementById("rewards") && !document.getElementById("rewards").classList.contains("hidden")) {
        drawWheel();
    }
});