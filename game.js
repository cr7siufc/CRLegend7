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
        localStorage.setItem(input, true);  // Store the username key to prevent duplicates
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
    document.getElementById("username-display").textContent = `Username: ${username}`;
    document.getElementById("username-display-container").textContent = `Hello, ${username}`;
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
    document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
    updateLevel();
}

// Update player level based on points
function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level-display").textContent = `Level: ${playerLevel}`;
    localStorage.setItem("level", playerLevel);
}

// Buy more points logic (for the button, now on the airdrop page)
function buyPoints() {
    currentPoints += 1000;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
}

// Function to convert points to CR7SIU tokens
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

// Set up 20 improvements and upgrade functionality
function displayImprovements() {
    const improvements = [
        'Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing', 
        'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity', 
        'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power', 
        'Ball Handling', 'Acceleration'
    ];

    const container = document.getElementById("attributes-container");
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

// Handle skill upgrades and cashback
function upgradeSkill(cost, index) {
    if (currentPoints >= cost) {
        currentPoints -= cost;
        const cashback = cost * 0.10;  // 10% cashback
        currentPoints += cashback;    // Add cashback to current points
        document.getElementById(`attribute-level-${index}`).textContent = parseInt(document.getElementById(`attribute-level-${index}`).textContent) + 1;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
        alert(`Upgrade successful! You received ${cashback} points as cashback.`);
    } else {
        alert("Not enough points!");
    }
}

// Initialize improvements page
displayImprovements();

// Open respective URL for tasks
function openUrl(platform) {
    let url = '';
    if (platform === 'youtube') url = 'https://www.youtube.com/@CR7SIUnextbigthing';
    if (platform === 'x') url = 'https://x.com/cr7siucoin';
    if (platform === 'facebook') url = 'https://www.facebook.com/profile.php?id=61571519741834&mibextid=ZbWKwL';
    
    window.open(url, '_blank');
    
    // Track task completion after user clicks URL
    taskCompleted(platform);
}

// Show tasks interface
function showTasks() {
    document.getElementById('tasks-container').classList.remove('hidden');
    document.getElementById('tasks-button').style.display = 'none'; // Hide tasks button
}

// Validate if tasks are completed and reward user
function validateTasks() {
    if (tasksCompleted.youtube && tasksCompleted.x && tasksCompleted.facebook) {
        currentPoints += 1000;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `CR7SIU Points: ${currentPoints}`;
        alert("Task completed. You have earned 1000 CR7SIU points!");
    } else {
        document.getElementById('task-validation-message').textContent = "Task not completed. Retry.";
    }
}

// Set task completion as true once user opens the URL
function taskCompleted(platform) {
    tasksCompleted[platform] = true;
}
