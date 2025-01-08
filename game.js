// Track player score and attributes data
let playerScore = 0; // Assume loaded from local storage
let attributeData = [
    { name: "Stamina", rank: 1, cost: 500 },
    { name: "Strength", rank: 1, cost: 500 },
    { name: "Header Attributes", rank: 1, cost: 500 },
    { name: "Shooting Power", rank: 1, cost: 500 },
    { name: "Dribbling", rank: 1, cost: 500 },
    { name: "Passing", rank: 1, cost: 500 },
    { name: "Defense", rank: 1, cost: 500 },
    { name: "Speed", rank: 1, cost: 500 },
    { name: "Agility", rank: 1, cost: 500 },
    { name: "Balance", rank: 1, cost: 500 },
    { name: "Tackling", rank: 1, cost: 500 },
    { name: "Vision", rank: 1, cost: 500 },
    { name: "Reaction Time", rank: 1, cost: 500 },
    { name: "Positioning", rank: 1, cost: 500 },
    { name: "Teamwork", rank: 1, cost: 500 },
    { name: "Crossing", rank: 1, cost: 500 },
    { name: "Finishing", rank: 1, cost: 500 },
    { name: "Heading Accuracy", rank: 1, cost: 500 },
    { name: "Curve", rank: 1, cost: 500 },
    { name: "Penalties", rank: 1, cost: 500 }
];

// Show the specified page
function showPage(page) {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("improvements").classList.add("hidden");
    document.getElementById("airdrop").classList.add("hidden");
    document.getElementById("rewards").classList.add("hidden");
    document.getElementById(page).classList.remove("hidden");
}

// Load improvements page with 20 attributes
function loadImprovementsPage() {
    const container = document.getElementById("attributes-container");
    container.innerHTML = ""; // Clear previous content

    attributeData.forEach((attr, index) => {
        const card = document.createElement("div");
        card.classList.add("attribute-card");

        card.innerHTML = `
            <h2>${attr.name}</h2>
            <p>Rank: ${attr.rank}</p>
            <p>Upgrade Cost: ${attr.cost} Points</p>
            <button onclick="upgradeAttribute(${index})">Upgrade</button>
        `;
        container.appendChild(card);
    });
}

// Upgrade Attribute Logic
function upgradeAttribute(index) {
    const attr = attributeData[index];
    if (playerScore >= attr.cost) {
        playerScore -= attr.cost; // Deduct points
        attr.rank++; // Increment rank
        const refund = Math.floor(attr.cost * 0.1); // 10% refund
        playerScore += refund; // Add refund
        attr.cost += 200; // Increase cost for the next upgrade

        // Update Improvements Page
        loadImprovementsPage();

        // Update Score Display
        document.getElementById("score-display").innerText = `Score: ${playerScore} CR7SIU Points`;
    } else {
        alert("Error: Insufficient CR7SIU points for upgrade.");
    }
}

// Earn Points
function earnPoints() {
    playerScore += 5; // Add 5 points per tap
    document.getElementById("score-display").innerText = `Score: ${playerScore} CR7SIU Points`;
}

// Convert Points to CR7SIU Tokens
function convertToTokens() {
    if (playerScore >= 2500) {
        const tokens = Math.floor(playerScore / 2500);
        playerScore -= tokens * 2500;
        alert(`You have converted ${tokens} tokens!`);
        document.getElementById("score-display").innerText = `Score: ${playerScore} CR7SIU Points`;
    } else {
        alert("Error: Insufficient CR7SIU points to convert to tokens.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    showPage("home");
    loadImprovementsPage();
});
