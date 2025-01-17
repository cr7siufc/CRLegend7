let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];
let lastRewardClaimTime = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0;

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

// ... (other functions like convertToTokens, displayTasks, etc. remain largely unchanged)

function getISTTime() {
    let now = new Date();
    now.setHours(now.getHours() + 5, now.getMinutes() + 30);
    return now;
}

function startTimer(elementId, resetTime = 86400000) {
    let now = getISTTime();
    let reset = new Date(now);
    reset.setHours(0, 0, 0, 0);
    if (now > reset) reset.setDate(reset.getDate() + 1);

    let timeLeft = reset - now;
    let el = document.getElementById(elementId);
    let timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft -= 1000;
            el.textContent = `${Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0')}:${Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')}:${Math.floor((timeLeft % (1000 * 60)) / 1000).toString().padStart(2, '0')}`;
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
    currentPoints += 1000;
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
    currentPoints += 500;
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
    let reward = Math.floor(Math.random() * 4000) + 1000; // Random between 1000 and 5000 points
    currentPoints += reward;
    updatePointsDisplay();
    animateWheel();
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
    startTimer('spin-timer');
}

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');

    const colors = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 255, 0, 0.7)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 0, 255, 0.7)', 'rgba(255, 0, 255, 0.7)', 'rgba(128, 0, 128, 0.7)'];
    const segments = 6;

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

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 2