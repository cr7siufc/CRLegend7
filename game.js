// Store username and points in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;

// Task completion tracking
let tasksCompleted = {
    youtube: false,
    x: false,
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
    if (input !== "" && input.length > 2 && !localStorage.getItem(input)) {
        localStorage.setItem("username", input);
        localStorage.setItem(input, true); // Prevent duplicate usernames
        username = input;
        loadSession();
    } else {
        alert("Please enter a valid username.");
    }
}

// Load session data
function loadSession() {
    document.getElementById("username-setup").classList.add("hidden");
    document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
    document.getElementById("player-level-display").textContent = `Level: ${playerLevel}`;
    document.getElementById("tokens-display").textContent = `CR7SIU Tokens: ${currentTokens}`;
    document.getElementById("username-display-container").textContent = `Hello, ${username}`;
    showPage('home');
}

// Show a specific page
function showPage(page) {
    const pages = document.querySelectorAll("main");
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

// Handle earning points by tapping
function earnPoints() {
    currentPoints += 5;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
    updateLevel();
}

// Update level based on points
function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level-display").textContent = `Level: ${playerLevel}`;
    localStorage.setItem("level", playerLevel);
}

// Buy points button logic (in Airdrop)
function buyPoints() {
    currentPoints += 1000;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
}

// Convert points to CR7SIU tokens
function convertToTokens() {
    const tokens = Math.floor(currentPoints / 2500);
    if (tokens > 0) {
        currentTokens += tokens;
        currentPoints -= tokens * 2500;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
        document.getElementById("tokens-display").textContent = `CR7SIU Tokens: ${currentTokens}`;
        document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
        alert(`You converted ${tokens} CR7SIU tokens!`);
    } else {
        alert("You don't have enough points to convert.");
    }
}

// Display football skill improvements with adjusted costs and levels
function displayImprovements() {
    const improvements = [
        'Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing',
        'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity',
        'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power',
        'Ball Handling', 'Acceleration'
    ];

    const container = document.getElementById("attributes-container");
    container.innerHTML = ''; // Clear existing content
    improvements.forEach((improvement, index) => {
        const cost = 500 + 200 * index;
        const card = document.createElement("div");
        card.classList.add("attribute-card");
        card.innerHTML = `
            <h3>${improvement}</h3>
            <p>Upgrade Cost: ${cost} points</p>
            <p>Level: <span id="attribute-level-${index}" class="attribute-level">1</span></p>
            <button onclick="upgradeSkill(${cost}, ${index})">Upgrade</button>
        `;
        container.appendChild(card);
    });
}

// Upgrade skill with cashback
function upgradeSkill(cost, index) {
    if (currentPoints >= cost) {
        currentPoints -= cost;
        const cashback = Math.floor(cost * 0.10); // 10% cashback
        currentPoints += cashback; // Apply cashback
        const levelSpan = document.getElementById(`attribute-level-${index}`);
        levelSpan.textContent = parseInt(levelSpan.textContent) + 1;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
        alert(`Upgrade successful! You received ${cashback} points as cashback.`);
        
        // Cashback applied at every 10th upgrade level
        if (parseInt(levelSpan.textContent) % 10 === 0) {
            alert(`You have reached a 10th level for ${improvement}, enjoy a cashback of 2500 points!`);
            currentPoints += 2500; // Additional cashback on every 10th level upgrade
            localStorage.setItem("points", currentPoints);
        }
    } else {
        alert("Not enough points!");
    }
}

// Show tasks for completion
function showTasks() {
    document.getElementById('tasks-container').classList.remove('hidden');
    document.getElementById('tasks-button').style.display = 'none';
}

// Open respective URLs for tasks
function openUrl(platform) {
    const urls = {
        youtube: 'https://www.youtube.com/@CR7SIUnextbigthing',
        x: 'https://x.com/cr7siucoin',
        facebook: 'https://www.facebook.com/profile.php?id=61571519741834&mibextid=ZbWKwL'
    };
    window.open(urls[platform], '_blank');
    taskCompleted(platform);
}

// Mark a task as complete
function taskCompleted(platform) {
    tasksCompleted[platform] = true;
}

// Validate completed tasks
function validateTasks() {
    const allTasksDone = tasksCompleted.youtube && tasksCompleted.x && tasksCompleted.facebook;
    if (allTasksDone) {
        currentPoints += 1000;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
        alert("Tasks completed successfully! You've earned 1000 CR7SIU points.");
    } else {
        alert("Task not completed. Please complete all tasks before validating.");
    }
}

// Reset tasks (optional)
function resetTasks() {
    tasksCompleted = { youtube: false, x: false, facebook: false };
    alert("All tasks have been reset.");
}

// Initialize improvements and tasks
displayImprovements();
