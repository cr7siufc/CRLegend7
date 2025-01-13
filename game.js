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

function shareReferralLink() {
    // Ensure the username is available before generating the link
    if (!username) {
        alert("Please set your username first!");
        return;
    }

    const referralLink = `https://t.me/CRLegend7_Bot?referral=${username}`;
    const socialMedia = prompt("Which platform to share on? Facebook, X, WhatsApp, Telegram, Instagram").toLowerCase();
    const platforms = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
        x: `https://x.com/intent/tweet?url=${encodeURIComponent(referralLink)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(referralLink)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`,
        instagram: `https://www.instagram.com/?url=${encodeURIComponent(referralLink)}`
    };
    
    if (platforms[socialMedia]) window.open(platforms[socialMedia], "_blank");
    else alert("Invalid platform.");
}

function displayReferrals() {
    const container = document.getElementById("referral-container");
    container.innerHTML = referralUsers.map(user => `
        <div class="referral-card">
            <h3>${user}</h3>
            <button onclick="pokeUser('${user}')">Poke</button>
        </div>
    `).join('');
}

function pokeUser(user) {
    alert(`You poked ${user}!`);
    currentPoints += 100;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
}

function spinWheel() {
    const rewards = [2500, 3500, 5500, 6500, 7500];
    const spinButton = document.getElementById("spin-button");
    spinButton.disabled = true;
    document.getElementById("wheel").style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
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
    if (currentTime - lastRewardClaimTime > 7776000000) { // 3 months in milliseconds
        document.getElementById("rewards-link").disabled = false;
    } else {
        document.getElementById("rewards-link").disabled = true;
    }
}
