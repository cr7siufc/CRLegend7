// Store username, points and tokens in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;

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
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("tokens-display").textContent = currentTokens;
    document.getElementById("player-level").textContent = playerLevel;
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
    const tokens = Math.floor(currentPoints / 2500);
    if (tokens > 0) {
        currentPoints -= tokens * 2500; // Deduct points from the balance after conversion
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

// Set up 20 improvements and upgrade functionality
function displayImprovements() {
    const improvements = [
        'Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing',
        'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity',
        'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power',
        'Ball Handling', 'Acceleration'
    ];

    const container = document.getElementById("attributes-container");
    container.innerHTML = ""; // Clear previous contents to refresh the attributes
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

// Handle skill upgrades
function upgradeSkill(cost, index) {
    if (currentPoints >= cost) {
        currentPoints -= cost;
        document.getElementById(`attribute-level-${index}`).textContent = parseInt(document.getElementById(`attribute-level-${index}`).textContent) + 1;
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        alert("Upgrade successful!");
    } else {
        alert("Not enough points!");
    }
}

// Initialize improvements page
displayImprovements();
