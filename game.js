let points = 0;
const pointsElement = document.getElementById('points');

// Start the game with a user's name
function startGame() {
    const username = document.getElementById('username').value;
    if (username.trim() !== "") {
        document.getElementById('username-setup').style.display = "none";
        document.getElementById('home').style.display = "block";
        alert("Welcome " + username + "!");
    } else {
        alert("Please enter a username.");
    }
}

// Function to earn points by tapping on the CR7 image
function earnPoints() {
    points += 10;
    pointsElement.innerText = points;
}
