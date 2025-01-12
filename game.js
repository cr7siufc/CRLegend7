// Store username, points, tokens, attribute progress, and task completion in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || {
    youtube: false,
    xAccount: false,
    facebook: false
};

// Show the username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
}

// Set username
function setUsername() {
    const input = document.getElementById("username-input").value.trim();
    if (input !== "") {
        localStorage.setItem("username", input);
        username = input;
        loadSession();
    } else {
        alert("Please enter a valid username.");
    }
}

// Load session data
function loadSession() {
    document.getElementById("username-setup").classList.add("hidden");
    document.getElementById("username-display").textContent = username;
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("tokens-display").textContent = currentTokens;
    document.getElementById("player-level").textContent = playerLevel;
    displayImprovements();
    displayTasks(); // Display tasks for rewards validation
    showPage('home');
}

// Show page based on button click
function showPage(page) {
    const pages = document.querySelectorAll("main");
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

// Handle points earning when the user taps
function earnPoints() {
    currentPoints += 5; // Points gained per tap
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    updateLevel();
}

// Update player level based on points
function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level").textContent = playerLevel;
    localStorage.setItem("level", playerLevel);
}

// Buy more points logic (for the button)
function buyPoints() {
    currentPoints += 1000;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
}

// Function to convert points to CR7SIU tokens
function convertToTokens() {
    const tokens = Math.floor(currentPoints / 5000); // Adjusted: 5000 CR7SIU points per token
    if (tokens > 0) {
        currentPoints -= tokens * 5000; // Remove the points spent
        currentTokens += tokens;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        document.getElementById("tokens-display").textContent = currentTokens;
        alert(`You converted ${tokens} CR7SIU tokens!`);
    } else {
        alert("You don't have enough points to convert.");
    }
}

// Display tasks for rewards validation
function displayTasks() {
    const tasksContainer = document.getElementById("task-section");
    tasksContainer.innerHTML = `
        <div class="task">
            <a href="https://www.youtube.com/@CR7SIUnextbigthing" target="_blank" onclick="enableTaskButton('youtube')">Subscribe to our YouTube Channel</a>
            <button id="validate-youtube" onclick="completeTask('youtube')" disabled>Mark as Done</button>
        </div>
        <div class="task">
            <a href="https://x.com/cr7siucoin" target="_blank" onclick="enableTaskButton('xAccount')">Join our X Account</a>
            <button id="validate-xAccount" onclick="completeTask('xAccount')" disabled>Mark as Done</button>
        </div>
        <div class="task">
            <a href="https://www.facebook.com/profile.php?id=61571519741834&mibextid=ZbWKwL" target="_blank" onclick="enableTaskButton('facebook')">Like and Join our Facebook Page</a>
            <button id="validate-facebook" onclick="completeTask('facebook')" disabled>Mark as Done</button>
        </div>
    `;
    updateTaskButtons();
}

// Enable task validation button
function enableTaskButton(task) {
    document.getElementById(`validate-${task}`).disabled = false;
}

// Mark a task as completed
function completeTask(task) {
    tasksCompleted[task] = true;
    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
    alert(`Task "${task}" marked as completed!`);
    updateTaskButtons();
}

// Update task buttons based on completion status
function updateTaskButtons() {
    for (const task in tasksCompleted) {
        const button = document.getElementById(`validate-${task}`);
        if (tasksCompleted[task]) {
            button.disabled = true;
            button.textContent = "Completed";
            button.classList.add("completed");
        }
    }
    // Enable claim button if all tasks are complete
    const allTasksCompleted = Object.values(tasksCompleted).every(Boolean);
    document.getElementById("claim-rewards-btn").disabled = !allTasksCompleted;
}

// Claim Rewards
function claimRewards() {
    if (Object.values(tasksCompleted).every(Boolean)) {
        if (!localStorage.getItem("rewardsClaimed")) {
            currentPoints += 5000; // Add reward points
            localStorage.setItem("points", currentPoints);
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
            alert("Congratulations! You earned 5000 CR7SIU Points for completing all tasks.");
            localStorage.setItem("rewardsClaimed", true); // Mark rewards as claimed
        } else {
            alert("You have already claimed your rewards.");
        }
    } else {
        alert("Complete all tasks before claiming rewards.");
    }
}

// Display improvements and handle upgrade progress
function displayImprovements() {
    const improvements = [
        'Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing',
        'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity',
        'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power',
        'Ball Handling', 'Acceleration'
    ];

    const container = document.getElementById("attributes-container");
    container.innerHTML = ""; // Clear previous contents
    improvements.forEach((improvement, index) => {
        const level = attributes[improvement] || 1;
        const cost = 500 + 250 * (level - 1); // Cost formula
        const card = document.createElement("div");
        card.classList.add("attribute-card");
        card.innerHTML = `
            <h3>${improvement}</h3>
            <p>Upgrade Cost: ${cost} points</p>
            <p>Level: <span id="attribute-level-${index}">${level}</span></p>
            <button onclick="upgradeSkill('${improvement}', ${index}, ${cost})">Upgrade</button>
        `;
        container.appendChild(card);
    });
}

// Handle skill upgrades
function upgradeSkill(attribute, index, cost) {
    const level = attributes[attribute] || 1;
    if (currentPoints >= cost) {
        currentPoints -= cost;
        attributes[attribute] = level + 1;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("attributes", JSON.stringify(attributes));
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        document.getElementById(`attribute-level-${index}`).textContent = attributes[attribute];

        // Bonus cashback for every 10th level
        if (attributes[attribute] % 10 === 0) {
            currentPoints += 2500; // Cashback points
            localStorage.setItem("points", currentPoints);
            alert("Level milestone achieved! Cashback of 2500 points awarded.");
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        }

        alert("Upgrade successful!");
    } else {
        alert("Not enough points!");
    }
}

// Generate and share unique referral link
function shareReferralLink() {
    const referralLink = `https://t.me/CRLegend7_Bot?referral=${username}`;
    const socialMedia = prompt("Which social media platform would you like to share your link on?\nOptions: Facebook, X, WhatsApp, Telegram, Instagram");

    if (socialMedia) {
        const encodedLink = encodeURIComponent(referralLink);
        let shareUrl;

        if (socialMedia.toLowerCase() === "facebook") {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        } else if (socialMedia.toLowerCase() === "x") {
            shareUrl = `https://x.com/intent/tweet?url=${encodedLink}`;
        } else if (socialMedia.toLowerCase() === "whatsapp") {
            shareUrl = `https://wa.me/?text=${encodedLink}`;
        } else if (socialMedia.toLowerCase() === "telegram") {
            shareUrl = `https://t.me/share/url?url=${encodedLink}`;
        } else if (socialMedia.toLowerCase() === "instagram") {
            shareUrl = `https://www.instagram.com/?url=${encodedLink}`;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank");
        } else {
            alert("Invalid social media platform.");
        }
    }
}

// Referral earnings text update
document.getElementById("referral-text").textContent = "Share your unique referral link to earn 10,000 CR7SIU Points for every successful joining!";
