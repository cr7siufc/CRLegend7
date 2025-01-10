const attributes = {
    stamina: 500,
    strength: 500,
    heading: 500,
    shooting: 500,
    dribbling: 500,
    passing: 500,
    agility: 500,
    speed: 500,
    control: 500,
    fitness: 500
};

// Load stored attributes from localStorage
function loadAttributes() {
    for (let attribute in attributes) {
        let savedValue = localStorage.getItem(attribute);
        if (savedValue) {
            attributes[attribute] = parseInt(savedValue);
        }
        displayAttribute(attribute);
    }
}

// Display each attribute and its level on the improvements page
function displayAttribute(attribute) {
    let container = document.getElementById('attributes-container');
    let card = document.createElement('div');
    card.classList.add('attribute-card');
    card.innerHTML = `
        <h3>${attribute.charAt(0).toUpperCase() + attribute.slice(1)}</h3>
        <p id="${attribute}-level">Level: ${Math.floor(attributes[attribute] / 200) + 1}</p>
        <button id="upgrade-${attribute}" onclick="upgradeAttribute('${attribute}')">Upgrade</button>
    `;
    container.appendChild(card);
}

// Upgrade an attribute when the button is clicked
function upgradeAttribute(attribute) {
    const upgradeCost = attributes[attribute] + 200;
    let userPoints = parseInt(localStorage.getItem('userPoints') || 0); // Get current points from storage
    if (userPoints >= upgradeCost) {
        attributes[attribute] += 200;
        localStorage.setItem(attribute, attributes[attribute]); // Save updated attribute value
        userPoints -= upgradeCost;
        localStorage.setItem('userPoints', userPoints);
        loadAttributes();
        updatePointsDisplay();

        // Reward with 5000 CR7SIU points every time an attribute is upgraded to the next level
        if (attributes[attribute] % 200 === 0) {
            userPoints += 5000;
            localStorage.setItem('userPoints', userPoints);
            updatePointsDisplay();
            alert('You have received a bonus of 5000 CR7SIU Points!');
        }
    } else {
        alert("Insufficient CR7SIU Points for this upgrade.");
    }
}

// Update points display
function updatePointsDisplay() {
    let userPoints = localStorage.getItem('userPoints');
    document.getElementById('score-display').innerText = `${userPoints} CR7SIU Points`;
    document.getElementById('score-display-airdrop').innerText = `${userPoints} CR7SIU Points`;
    document.getElementById('cr7siu-coins').innerText = `${userPoints}`;
}

function earnPoints() {
    let userPoints = localStorage.getItem('userPoints') || 0;
    userPoints = parseInt(userPoints) + 10; // Example increment
    localStorage.setItem('userPoints', userPoints);
    updatePointsDisplay();
}

function showPage(pageId) {
    let pages = document.querySelectorAll('main');
    pages.forEach(page => page.classList.add('hidden')); // Hide all pages
    document.getElementById(pageId).classList.remove('hidden'); // Show the selected page
}

window.onload = function() {
    loadAttributes();
    if (!localStorage.getItem('playerUsername')) {
        let username = prompt("Please enter your username");
        localStorage.setItem('playerUsername', username);
        document.getElementById("player-username").textContent = username;
    } else {
        document.getElementById("player-username").textContent = localStorage.getItem('playerUsername');
    }

    // Set the last updated score
    updatePointsDisplay();
};
