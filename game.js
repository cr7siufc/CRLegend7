// Store user data in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;

// Track completed tasks
const tasksCompleted = {
    youtube: localStorage.getItem("task_youtube") === "true" || false,
    x: localStorage.getItem("task_x") === "true" || false,
    facebook: localStorage.getItem("task_facebook") === "true" || false,
};

// Show the username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
}

// Set the username
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
    showPage("home");
}

// Show the appropriate page when a button is clicked
function showPage(page) {
    const pages = document.querySelectorAll("main");
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

// Earn points when tapping the "Tap-to-Earn" button
function earnPoints() {
    currentPoints += 5;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    updateLevel();
}

// Update player level based on total points
function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level").textContent = playerLevel;
    localStorage.setItem("level", playerLevel);
}

// Buy additional points
function buyPoints() {
    currentPoints += 1000;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
}

// Convert points to tokens
function convertToTokens() {
    const tokens = Math.floor(currentPoints / 2500);
    if (tokens > 0) {
        currentPoints -= tokens * 2500; // Deduct the points
        currentTokens += tokens;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        document.getElementById("tokens-display").textContent = currentTokens;
        alert(`You converted ${tokens} CR7SIU tokens!`);
    } else {
        alert("Not enough points to convert!");
    }
}

// Display skill attributes on the "Improvements" page
function displayImprovements() {
    const improvements = [
        "Stamina", "Strength", "Dribbling", "Shooting Power", "Speed", "Passing",
        "Defending", "Crossing", "Finishing", "Heading", "Control", "Creativity",
        "Leadership", "Tackling", "Positioning", "Composure", "Vision", "Shot Power",
        "Ball Handling", "Acceleration"
    ];

    const container = document.getElementById("attributes-container");
    container.innerHTML = ""; // Clear previous contents
    improvements.forEach((skill, index) => {
        const cost = 500 + 200 * index;
        const card = document.createElement("div");
        card.classList.add("attribute-card");
        card.innerHTML = `
            <h3>${skill}</h3>
            <p>Upgrade Cost: ${cost} points</p>
            <p>Level: <span id="attribute-level-${index}">1</span></p>
            <button onclick="upgradeSkill(${cost}, ${index})">Upgrade</button>
        `;
        container.appendChild(card);
    });
}

// Upgrade a specific skill
function upgradeSkill(cost, index) {
    if (currentPoints >= cost) {
        currentPoints -= cost;
        localStorage.setItem("points", currentPoints);
        document.getElementById(`attribute-level-${index}`).textContent =
            parseInt(document.getElementById(`attribute-level-${index}`).textContent) + 1;
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;

        // Grant cashback
        const cashback = Math.floor(cost * 0.1);
        currentPoints += cashback;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;

        alert(`Upgrade successful! You earned ${cashback} points as cashback.`);
    } else {
        alert("Not enough points to upgrade!");
    }
}

// Validate tasks
function validateTask(task) {
    if (!tasksCompleted[task]) {
        tasksCompleted[task] = true;
        localStorage.setItem(`task_${task}`, "true");

        currentPoints += 1000;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;

        document.getElementById("task-feedback").textContent = "Task completed successfully!";
        document.getElementById("task-feedback").style.color = "green";
    } else {
        document.getElementById("task-feedback").textContent = "Task already completed!";
        document.getElementById("task-feedback").style.color = "orange";
    }
}

// Initialize the "Improvements" page
displayImprovements();
