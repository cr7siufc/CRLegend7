// Store username and points in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let cr7siuTokenConversionRate = 2500; // 1 CR7SIU Token = 2500 CR7SIU Points

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
    document.getElementById("player-level").textContent = playerLevel;
    document.getElementById("cr7siu-tokens").textContent = calculateTokens() + " CR7SIU Tokens"; // Display tokens
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
    currentPoints += 5; // Each tap earns 5 points
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("cr7siu-tokens").textContent = calculateTokens() + " CR7SIU Tokens"; // Update tokens display
    updateLevel();
}

// Update player level based on points
function updateLevel() {
    playerLevel = Math.floor(currentPoints / 100000) + 1;
    document.getElementById("player-level").textContent = playerLevel;
    localStorage.setItem("level", playerLevel);
}

// Convert CR7SIU points to CR7SIU Tokens
function convertToTokens() {
    const tokensToConvert = Math.floor(currentPoints / cr7siuTokenConversionRate);
    if (tokensToConvert > 0) {
        currentPoints -= tokensToConvert * cr7siuTokenConversionRate; // Deduct points used in the conversion
        localStorage.setItem("points", currentPoints);
        document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
        document.getElementById("cr7siu-tokens").textContent = calculateTokens() + " CR7SIU Tokens"; // Update tokens
        alert(`You converted ${tokensToConvert} CR7SIU tokens!`);
    } else {
        alert("You don't have enough points to convert.");
    }
}

// Calculate total CR7SIU tokens based on current points
function calculateTokens() {
    return Math.floor(currentPoints / cr7siuTokenConversionRate);
}

// Show conversion ratio on the Airdrop page
function showConversionRatio() {
    document.getElementById("conversion-ratio").textContent = `1 CR7SIU Token = ${cr7siuTokenConversionRate} CR7SIU Points`;
}

// Display conversion rate on the airdrop page when it is loaded
showConversionRatio();
