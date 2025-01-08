// Initialize global variables
let score = localStorage.getItem("score") ? parseInt(localStorage.getItem("score")) : 0;
let playerLevel = localStorage.getItem("playerLevel") ? parseInt(localStorage.getItem("playerLevel")) : 1;
let tokens = localStorage.getItem("tokens") ? parseInt(localStorage.getItem("tokens")) : 0;
let username = localStorage.getItem("username") || "";

// Function to update displayed data
function updateDisplay() {
    document.getElementById("score-display").textContent = score;
    document.getElementById("player-level-display").textContent = playerLevel;
    document.getElementById("token-display").textContent = tokens;
    document.getElementById("username-display").textContent = username || "New Player";
}

// Prompt for username if not already set
if (!username) {
    username = prompt("Enter your username:");
    localStorage.setItem("username", username);
}

// Update the display with initial values
updateDisplay();

// Handle tap-to-earn button click
document.getElementById("tap-to-earn").addEventListener("click", () => {
    score += 5; // Add points per tap
    checkPlayerLevel();
    localStorage.setItem("score", score);
    updateDisplay();
});

// Function to check and update player level
function checkPlayerLevel() {
    const newLevel = Math.floor(score / 100000) + 1;
    if (newLevel > playerLevel) {
        playerLevel = newLevel;
        localStorage.setItem("playerLevel", playerLevel);
    }
}

// Handle conversion of points to tokens
document.getElementById("convert-tokens").addEventListener("click", () => {
    const conversionRate = 2500;
    if (score >= conversionRate) {
        const convertedTokens = Math.floor(score / conversionRate);
        tokens += convertedTokens;
        score -= convertedTokens * conversionRate;
        localStorage.setItem("tokens", tokens);
        localStorage.setItem("score", score);
        alert(`You converted ${convertedTokens} tokens!`);
    } else {
        alert("Insufficient CR7SIU points to convert!");
    }
    updateDisplay();
});

// Navigation functionality
function navigateTo(section) {
    document.querySelectorAll("main > section").forEach((sec) => sec.classList.add("hidden"));
    document.getElementById(section).classList.remove("hidden");
}
