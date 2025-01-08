// Constants and setup for initial user session
const MAX_POINTS = 5000;
const REFILL_COST = 2500;
let currentPoints = parseInt(localStorage.getItem('points')) || 0;
let username = localStorage.getItem('username') || null;

// Initialize the page
function initializePage() {
    if (!username) {
        const name = prompt("Please enter a unique username to continue:");
        if (name) {
            username = name;
            localStorage.setItem('username', username);
        } else {
            alert("Username is required!");
            return;
        }
    }

    updateScoreDisplay();
    displayImprovements();
    displayAttributesLevels();
}

// Display the score on the home page
function updateScoreDisplay() {
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
}

// Handle the tap to earn button
document.getElementById("tap-button").addEventListener("click", function() {
    if (currentPoints >= MAX_POINTS) {
        alert("Maximum points reached for the day!");
        return;
    }

    currentPoints += 5; // Add points for each tap
    if (currentPoints > MAX_POINTS) {
        currentPoints = MAX_POINTS;
    }

    localStorage.setItem('points', currentPoints);
    updateScoreDisplay();
});

// Improvements page: Display skill upgrades
const skills = [
    "Stamina", "Strength", "Header", "Shooting Power", "Dribbling", 
    "Passing", "Accuracy", "Speed", "Tackling", "Balance", 
    "Agility", "Endurance", "Mental Strength", "Recovery", "Teamwork", 
    "Positioning", "Vision", "Composure", "Finishing", "Control"
];

// Logic to display the improvements and upgrade them
function displayImprovements() {
    let container = document.getElementById('attributes-container');
    container.innerHTML = ''; // Clear the container

    skills.forEach((skill, index) => {
        let level = parseInt(localStorage.getItem(`${username}_${skill}_level`)) || 1;
        let cost = 500 + (index * 200);

        let div = document.createElement('div');
        div.classList.add('attribute');
        div.innerHTML = `
            <h3>${skill}</h3>
            <p>Level: ${level}</p>
            <p>Upgrade Cost: ${cost} Points</p>
            <button onclick="upgradeSkill('${skill}', ${cost}, ${level})">Upgrade</button>
        `;
        container.appendChild(div);
    });
}

// Upgrade logic for a skill
function upgradeSkill(skill, cost, level) {
    if (currentPoints >= cost) {
        currentPoints -= cost; // Deduct points for the upgrade
        localStorage.setItem('points', currentPoints);

        // Update the skill level
        level++;
        localStorage.setItem(`${username}_${skill}_level`, level);

        updateScoreDisplay();
        displayImprovements();
        alert("Upgrade successful!");
    } else {
        alert("Not enough points!");
    }
}

// Airdrop: Convert points to tokens
document.getElementById("convert-button").addEventListener("click", function() {
    if (currentPoints >= REFILL_COST) {
        currentPoints -= REFILL_COST; // Convert points to tokens
        localStorage.setItem('points', currentPoints);
        alert("Converted to CR7SIU Tokens!");
        updateScoreDisplay();
    } else {
        alert("Not enough points to convert.");
    }
});

// Run the initialization function on load
initializePage();
