// Store username, points, tokens, and other data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];
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
    document.getElementById("cr7siu-points").textContent = currentPoints; // Added this line for consistency
    displayImprovements();
    displayTasks();
    displayReferrals(); // Display the referral users
    updateSpinButton(); // Moved this here to enable buttons if conditions are met
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
    document.getElementById("cr7siu-points").textContent = currentPoints; // Updated this line
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
    document.getElementById("cr7siu-points").textContent = currentPoints; // Updated this line
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
        document.getElementById("cr7siu-points").textContent = currentPoints; // Updated this line
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
            document.getElementById("cr7siu-points").textContent = currentPoints; // Updated this line
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
        document.getElementById("cr7siu-points").textContent = currentPoints; // Updated this line
        document.getElementById(`attribute-level-${index}`).textContent = attributes[attribute];
        if (attributes[attribute] % 10 === 0) {
            currentPoints += 2500;
            localStorage.setItem("points", currentPoints);
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
            document.getElementById("cr7siu-points").textContent = currentPoints; // Updated this line
            alert("Level milestone achieved! Cashback of 2500 points awarded.");
        }
        alert("Upgrade successful!");
    } else {
        alert("Not enough points!");
    }
}

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
            enableRewardButtons();
        }
    }, 1000);
}

function enableRewardButtons() {
    document.getElementById('ad-claim-button').disabled = false;
    document.getElementById('check-in-button').disabled = false;
    document.getElementById('spin-button').disabled = false;
}

function disableRewardButtons() {
    document.getElementById('ad-claim-button').disabled = true;
    document.getElementById('check-in-button').disabled = true;
    document.getElementById('spin-button').disabled = true;
}

function completeAdTask() {
    if (document.getElementById('ad-claim-button').disabled) {
        alert("Rewards only offered once every 24 hours per user.");
        return;
    }
    // Your reward logic here
    currentPoints += 1000; // Example reward
    updatePointsDisplay();
    alert("You've earned 1000 points from watching the ad!");
    disableRewardButtons();
    localStorage.setItem("lastRewardClaimTime", new Date().getTime());
    startTimer('spin-timer');
}

function completeCheckInTask() {
    if (document.getElementById('check-in-button').disabled) {
        alert("Rewards only offered once every 24 hours per user.");
        return;
    }
    // Your reward logic here
    currentPoints += 500; // Example daily check-in reward
    updatePointsDisplay();
    alert("Daily check-in reward claimed: 500 points!");
    disableRewardButtons();
    localStorage.setItem("lastRewardClaimTime", new Date().getTime());
    startTimer('spin-timer');
}

function spinWheel() {
    if (document.getElementById('spin-button').disabled) {
        alert("Rewards only offered once every 24 hours per user.");
        return;
    }
    // Your reward logic here, e.g., random amount of points
    let reward = Math.floor(Math.random() * 5000) + 500; // Random between 500 and 5500 points
    currentPoints += reward;
    updatePointsDisplay();
    animateWheel(); // Animate the wheel
    alert(`You won ${reward} points from the wheel!`);
    disableRewardButtons();
    localStorage.setItem("lastRewardClaimTime", new Date().getTime());
    startTimer('spin-timer');
}

function updatePointsDisplay() {
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("cr7siu-points").textContent = currentPoints;
}

function updateSpinButton() {
    const now = getISTTime().getTime();
    const lastClaim = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0;
    const buttons = [document.getElementById('ad-claim-button'), document.getElementById('check-in-button'), document.getElementById('spin-button')];

    if (now - lastClaim >= 86400000) { // 24 hours in milliseconds
        buttons.forEach(button => button.disabled = false);
    } else {
        buttons.forEach(button => button.disabled = true);
    }
    // Start or update the timer
    startTimer('spin-timer');
}

// New function for drawing the wheel
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');

    const colors = ['#FF0000', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#800080'];
    const segments = 6; // Number of segments for the wheel

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < segments; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 
                (i * Math.PI * 2 / segments) - Math.PI / 2, 
                ((i + 1) * Math.PI * 2 / segments) - Math.PI / 2, false);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
    }

    // Draw a central circle for the wheel's center
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
}

function animateWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');

    let rotation = 0;
    const endRotation = Math.PI * 10 + Math.random() * Math.PI * 2; // 5 full rotations + random segment stop

    function rotateWheel() {
        rotation += 0.1;
        if (rotation <= endRotation) {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel();
            ctx.restore();
            requestAnimationFrame(rotateWheel);
        }
    }
    rotateWheel();
}

document.addEventListener('DOMContentLoaded', () => {
    startTimer('spin-timer');
    drawWheel(); // Draw the wheel on page load
    updateSpinButton();
});

// ... Other functions like generateReferralLink, displayReferrals, etc. remain unchanged ...