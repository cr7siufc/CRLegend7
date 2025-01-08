// Store username and points in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;

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
    showPage('home');
    updateLevel();
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
    let level = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level").textContent = level;
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
            <h3>${improvement} - Rank ${index + 1}</h3>
            <p>Upgrade cost: ${cost} points</p>
            <button onclick="upgrade(${cost}, '${improvement}')">Upgrade</button>
        `;
        container.appendChild(card);
    });
}

// Upgrade function
function upgrade(cost, attribute) {
    if (currentPoints >= cost) {
        currentPoints -= cost;
        localStorage.setItem("points", currentPoints);
        alert(`Successfully upgraded ${attribute}! You have received a 10% refund of ${cost * 0.1} points.`);
        currentPoints += Math.floor(cost * 0.1);
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    } else {
        alert("You don't have enough points to upgrade this attribute.");
    }
}

document.addEventListener('DOMContentLoaded', displayImprovements);
