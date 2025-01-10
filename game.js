// Example of handling taps and actions for the tap-to-earn game

let totalPoints = 2300;
let cr7siuPoints = 200;
let cr7siuTokens = 2;

function earnPoints() {
    totalPoints += 10;
    cr7siuPoints += 1;
    cr7siuTokens = Math.floor(cr7siuPoints / 100);
    updateScoreDisplay();
}

function updateScoreDisplay() {
    // Updating on-screen values for points and tokens
    document.querySelector('#left-info').innerHTML = `
        <p><strong>Player Level:</strong> 5</p>
        <p><strong>Total Score:</strong> ${totalPoints}</p>
    `;
    document.querySelector('#right-info').innerHTML = `
        <p><strong>CR7SIU Points:</strong> ${cr7siuPoints}</p>
        <p><strong>CR7SIU Tokens:</strong> ${cr7siuTokens}</p>
    `;
}

function goHome() {
    alert("Navigating to Home.");
}

function goToImprovements() {
    alert("Navigating to Improvements.");
}

function goToAirdrop() {
    alert("Navigating to Airdrop.");
}

function goToRewards() {
    alert("Navigating to Rewards.");
}
