// Store username, points, tokens, attribute progress, and task completion in localStorage
let username = localStorage.getItem("username");
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let lastClaimedRewards = JSON.parse(localStorage.getItem("lastClaimedRewards")) || {};

// Initialize reward statuses and timestamps
const rewardTypes = ["dailyCheckIn", "upgradeAttributes", "pokeReferral", "spinWheel", "watchVideo", "youtubeSubscribe", "joinX", "likeFacebook"];
const rewardResetHourIST = 0; // Reset rewards daily at 00:00 IST

// Utility to check if rewards are reset
function isRewardReset() {
    const now = new Date();
    const istNow = new Date(now.getTime() + (330 - now.getTimezoneOffset()) * 60000); // IST time
    const lastReset = new Date(localStorage.getItem("lastResetTime") || 0);
    const istReset = new Date(lastReset.getTime() + (330 - lastReset.getTimezoneOffset()) * 60000);

    return istReset.getDate() !== istNow.getDate() || istReset.getHours() < rewardResetHourIST;
}

// Reset rewards daily
function resetRewards() {
    if (isRewardReset()) {
        rewardTypes.forEach(reward => lastClaimedRewards[reward] = false);
        localStorage.setItem("lastClaimedRewards", JSON.stringify(lastClaimedRewards));
        localStorage.setItem("lastResetTime", new Date().toISOString());
        alert("Rewards have been reset for the day!");
    }
}

// Show the username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    resetRewards();
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
    document.getElementById("username-display").textContent = username;
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    document.getElementById("tokens-display").textContent = currentTokens;
    document.getElementById("player-level").textContent = playerLevel;
    displayImprovements();
    showPage("home");
}

// Show page based on button click
function showPage(page) {
    const pages = document.querySelectorAll("main");
    pages.forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

// Reward claiming functions
function claimReward(rewardType, points, validationCallback) {
    resetRewards();
    if (lastClaimedRewards[rewardType]) {
        alert("Reward already claimed for today. Come back tomorrow!");
        return;
    }
    if (validationCallback && !validationCallback()) {
        alert("Validation failed! Please complete the required action to claim this reward.");
        return;
    }
    currentPoints += points;
    localStorage.setItem("points", currentPoints);
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    lastClaimedRewards[rewardType] = true;
    localStorage.setItem("lastClaimedRewards", JSON.stringify(lastClaimedRewards));
    alert(`You earned ${points} CR7SIU points!`);
}

// Validation callbacks for each reward
const validationCallbacks = {
    watchVideo: () => confirm("Did you watch the video?"),
    youtubeSubscribe: () => confirm("Did you subscribe to the YouTube channel?"),
    joinX: () => confirm("Did you join the X account?"),
    likeFacebook: () => confirm("Did you like the Facebook page?"),
    pokeReferral: () => parseInt(localStorage.getItem("referralCount")) > 0, // Ensure user has referrals
    upgradeAttributes: () => {
        const upgradedAttributes = Object.values(attributes).filter(level => level > 1);
        return upgradedAttributes.length >= 3;
    },
    spinWheel: () => true, // Always valid
    dailyCheckIn: () => true // Always valid
};

// Reward-specific functions
function claimDailyCheckIn() {
    claimReward("dailyCheckIn", 5000);
}

function claimUpgradeAttributes() {
    claimReward("upgradeAttributes", 15000, validationCallbacks.upgradeAttributes);
}

function claimPokeReferral() {
    claimReward("pokeReferral", 10000, validationCallbacks.pokeReferral);
}

function spinWheel() {
    if (lastClaimedRewards.spinWheel) {
        alert("Spin the wheel is available only once a day.");
        return;
    }
    const rewards = [1000, 2000, 3000, 4000, 5000, 10000];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    claimReward("spinWheel", reward);
}

function watchVideoReward() {
    claimReward("watchVideo", 5000, validationCallbacks.watchVideo);
}

function subscribeYoutube() {
    claimReward("youtubeSubscribe", 5000, validationCallbacks.youtubeSubscribe);
}

function joinXAccount() {
    claimReward("joinX", 5000, validationCallbacks.joinX);
}

function likeFacebookPage() {
    claimReward("likeFacebook", 5000, validationCallbacks.likeFacebook);
}

// Initialize session on load
window.onload = resetRewards;
