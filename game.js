let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;

if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
}

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

function loadSession() {
    document.getElementById("username-setup").classList.add("hidden");
    document.getElementById("username-display").textContent = `Username: ${username}`;
    updateGlobalInfo();
    showPage('home');
}

function updateGlobalInfo() {
    document.getElementById("global-points-display").textContent = currentPoints;
    document.getElementById("global-tokens-display").textContent = currentTokens;
}

function showPage(page) {
    const pages = document.querySelectorAll("main");
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
    updateGlobalInfo();
}

function earnPoints() {
    currentPoints += 5;
    localStorage.setItem("points", currentPoints);
    updateGlobalInfo();
}

function convertToTokens() {
    const tokens = Math.floor(currentPoints / 2500);
    if (tokens > 0) {
        currentPoints -= tokens * 2500;
        currentTokens += tokens;
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
        alert(`You converted ${tokens} CR7SIU tokens!`);
        updateGlobalInfo();
    } else {
        alert("You don't have enough points to convert.");
    }
}

function buyPoints() {
    currentPoints += 1000;
    localStorage.setItem("points", currentPoints);
    updateGlobalInfo();
}

function validateTask() {
    const completed = confirm(
        "Please confirm you've completed the following:\n" +
        "- Subscribed to our YouTube channel\n" +
        "- Followed our X account\n" +
        "- Liked our Facebook page"
    );

    if (completed) {
        currentPoints += 1000;
        localStorage.setItem("points", currentPoints);
        alert("Task completed! You earned 1000 CR7SIU points.");
        updateGlobalInfo();
    } else {
        alert("Task not completed. Retry.");
    }
}
