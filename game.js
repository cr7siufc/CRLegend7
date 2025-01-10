// Store username, points, player level, completed tasks, and referral information in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || {};
let referralLink = localStorage.getItem("referralLink") || generateReferralLink(); // Referral link generator
let improvementsData = JSON.parse(localStorage.getItem("improvements")) || Array(20).fill(1); // Ensure all skills are initialized to level 1

// Initialize Improvements for users without data
function initializeImprovementsData() {
    if (!localStorage.getItem("improvements") || improvementsData.length === 0) {
        const defaultImprovementsData = Array(20).fill(1); // Default: all attributes start at level 1
        localStorage.setItem("improvements", JSON.stringify(defaultImprovementsData));
        improvementsData = defaultImprovementsData; // update local copy
    }
}

if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
}

// Set username and referral link
function setUsername() {
    const input = document.getElementById("username-input").value.trim();
    if (input !== "") {
        localStorage.setItem("username", input);
        username = input;
        localStorage.setItem("referralLink", generateReferralLink());
        loadSession();
    } else {
        alert("Please enter a valid username.");
    }
}

// Generate unique referral link
function generateReferralLink() {
    return `https://yourgame.com/referral?user=${username}`;
}

// Load session data (user's details, points, tokens, etc.)
function loadSession() {
    initializeImprovementsData();
    document.getElementById("username-setup").classList.add("hidden");

    // Fetch and update user details
    document.getElementById("player-username").textContent = username;
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("player-level").textContent = playerLevel;
    document.getElementById("cr7siu-coins").textContent = Math.floor(currentPoints / 10);
    document.getElementById("cr7siu-tokens").textContent = Math.floor(currentPoints / 2500);
    
    document.getElementById("referral-link").textContent = referralLink;  // Show referral link
    document.getElementById("convert-note").textContent = "(1 CR7SIU Token = 2500 CR7SIU Points)";

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
    currentPoints += 5;
    localStorage.setItem("points", currentPoints);
    updateSession();
    updateLevel();
}

// Update player level based on points
function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level").textContent = playerLevel;
    localStorage.setItem("level", playerLevel);
}

// Convert points to CR7SIU tokens
function convertToTokens() {
    const tokens = Math.floor(currentPoints / 2500);
    if (tokens > 0) {
        alert(`You converted ${tokens} CR7SIU tokens!`);
    } else {
        alert("You don't have enough points to convert.");
    }
}

// Task Completion Tracker and Validation Function
function markTaskCompleted(task) {
    if (!completedTasks[task]) {
        completedTasks[task] = false;
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        alert(`Complete the task for ${task} to earn 1000 CR7SIU points!`);
    } else {
        document.getElementById("task-message").textContent = "Task already completed. No additional reward.";
    }
}

// Validate completed tasks before giving points (Task conditions)
function validateTask(task) {
    if (completedTasks[task] === false) {
        completedTasks[task] = true;  // Mark as completed
        currentPoints += 1000;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
        document.getElementById("task-message").textContent = `You have completed the task for ${task}. You earned 1000 CR7SIU Points!`;
        updateSession();
    } else {
        document.getElementById("task-message").textContent = "Task not completed. Retry.";
    }
}

// Update the session details on screen
function updateSession() {
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("cr7siu-coins").textContent = Math.floor(currentPoints / 10);
    document.getElementById("cr7siu-tokens").textContent = Math.floor(currentPoints / 2500);
}

// Initialize Improvements Page with 20 skills for upgrading
function displayImprovements() {
    const improvements = [
        'Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing', 
        'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity', 
        'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power', 
        'Ball Handling', 'Acceleration'
    ];

    const container = document.getElementById("attributes-container");
    container.innerHTML = "";  // Clear container before displaying

    improvements.forEach((improvement, index) => {
        const cost = 500 + 200 * index;
        const currentLevel = improvementsData[index] || 1;
        const card = document.createElement("div");
        card.classList.add("attribute-card");
        card.innerHTML = `
            <h3>${improvement}</h3>
            <p>Upgrade Cost: ${cost} points</p>
            <p>Level: <span id="attribute-level-${index}" class="attribute-level">${currentLevel}</span></p>
            <button onclick="upgradeSkill(${cost}, ${index}, '${improvement}')">Upgrade</button>
        `;
        container.appendChild(card);
    });
}

// Handle skill upgrades
function upgradeSkill(cost, index, improvement) {
    if (currentPoints >= cost) {
        currentPoints -= cost;
        improvementsData[index] = (improvementsData[index] || 0) + 1;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("improvements", JSON.stringify(improvementsData));
        document.getElementById(`attribute-level-${index}`).textContent = improvementsData[index];
        updateSession();
        alert("Upgrade successful!");

        // Cashback every 10th upgrade
        if (improvementsData[index] % 10 === 0) {
            currentPoints += 2500;
            localStorage.setItem("points", currentPoints);
            updateSession();
            alert("You have received cashback of 2500 CR7SIU Points!");
        }

        // Bonus after every 5 levels upgrade
        if (improvementsData[index] % 5 === 0) {
            currentPoints += 5000;
            localStorage.setItem("points", currentPoints);
            updateSession();
            alert("You have earned a bonus of 5000 CR7SIU Points!");
        }
    } else {
        alert("Not enough points!");
    }
}

// Handle referral link clicks and reward points to referrers
function handleReferral(referrerUsername) {
    if (referrerUsername) {
        alert(`${referrerUsername} successfully referred you!`);
        let referrerPoints = parseInt(localStorage.getItem("points")) || 0;
        referrerPoints += 10000;
        localStorage.setItem("points", referrerPoints);
        alert(`${referrerUsername} has earned 10000 CR7SIU Points!`);
    }
}

// Initialize improvements page
displayImprovements();
