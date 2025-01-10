let playerLevel = 1;
let totalScore = 0;
let cr7siuPoints = 0;
let cr7siuTokens = 0;

// Update elements in the UI
function updateUI() {
    document.getElementById('player-level').textContent = `Player Level: ${playerLevel}`;
    document.getElementById('total-score').textContent = `Total Score: ${totalScore}`;
    document.getElementById('cr7siu-points').textContent = `CR7SIU Points: ${cr7siuPoints}`;
    document.getElementById('cr7siu-tokens').textContent = `CR7SIU Tokens: ${cr7siuTokens}`;
}

// Add points when the "tap" button is clicked
document.getElementById('tap-button').addEventListener('click', function () {
    totalScore++;
    cr7siuPoints++;
    updateUI();

    // Check if it's time to reward tokens
    if (cr7siuPoints >= 1000) {
        let tokensEarned = Math.floor(cr7siuPoints / 1000);
        cr7siuTokens += tokensEarned;
        cr7siuPoints -= tokensEarned * 1000;
        updateUI();
    }

    // Check if player should level up based on score
    if (totalScore % 100 === 0) {
        playerLevel++;
        updateUI();
    }
});

// Handle additional page button clicks (Future implementation)
document.querySelectorAll('.footer-button').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        alert(`${button.textContent} Page coming soon!`);
    });
});
