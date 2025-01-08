
let score = 0;
let playerLevel = 1;
const dailyLimit = 5000;
let pointsToday = 0;

document.getElementById("tap-to-earn").addEventListener("click", () => {
    if (pointsToday < dailyLimit) {
        score += 5;
        pointsToday += 5;
        updateScoreDisplay();
        checkPlayerLevel();
    } else {
        alert("Daily limit reached! Refill required.");
    }
});

function updateScoreDisplay() {
    document.getElementById("score").textContent = score;
}

function checkPlayerLevel() {
    const level = Math.floor(score / 100000) + 1;
    if (level > playerLevel) {
        playerLevel = level;
        document.getElementById("player-level-value").textContent = playerLevel;
    }
}

function navigateTo(section) {
    document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(section).classList.remove("hidden");
}

const skills = [
    "Stamina", "Strength", "Header", "Shooting Power", "Dribbling", "Passing", "Vision",
    "Tackling", "Speed", "Ball Control", "Agility", "Balance", "Composure", "Crossing",
    "Finishing", "Free Kicks", "Interceptions", "Marking", "Positioning", "Leadership"
];

const skillsList = document.getElementById("skills-list");

skills.forEach((skill, index) => {
    const li = document.createElement("li");
    li.textContent = `${skill} - Upgrade Cost: ${500 + 200 * index} Points`;
    li.addEventListener("click", () => upgradeSkill(index, skill));
    skillsList.appendChild(li);
});

function upgradeSkill(index, skill) {
    const cost = 500 + 200 * index;
    if (score >= cost) {
        score -= cost;
        updateScoreDisplay();
        alert(`${skill} upgraded!`);
    } else {
        alert("Error: Insufficient CR7SIU points for upgrade.");
    }
}
