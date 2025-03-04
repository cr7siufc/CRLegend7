// Log localStorage values for debugging
console.log("Initial localStorage values:", {
    username: localStorage.getItem("username"),
    points: localStorage.getItem("points"),
    level: localStorage.getItem("level"),
    tokens: localStorage.getItem("tokens")
});

// Store user data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let playerLevel = parseInt(localStorage.getItem("level")) || 1;
let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];

// Daily reset tracking
let lastAdClaim = parseInt(localStorage.getItem("lastAdClaim")) || 0;
let lastCheckInClaim = parseInt(localStorage.getItem("lastCheckInClaim")) || 0;
let lastSpinClaim = parseInt(localStorage.getItem("lastSpinClaim")) || 0;
let lastTaskClaims = JSON.parse(localStorage.getItem("lastTaskClaims")) || { youtube: 0, xAccount: 0, facebook: 0 };
let lastRewardsClaim = parseInt(localStorage.getItem("lastRewardsClaim")) || 0;

// Wheel data
const wheelRewards = [500, 1000, 1500, 2000, 2500, 300];
const wheelColors = ["#FF4500", "#32CD32", "#1E90FF", "#FFD700", "#FF00FF", "#00CED1"];
let isSpinning = false;

// Track if a reward was just claimed to trigger the popup
let justClaimedReward = false;

// Show username setup if it's the user's first session
if (!username) {
    const setupElement = document.getElementById("username-setup");
    if (setupElement) {
        setupElement.classList.remove("hidden");
        const inputElement = document.getElementById("username-input");
        if (inputElement) inputElement.focus();
    }
} else {
    loadSession();
    checkForReferral();
}

function setUsername() {
    try {
        const input = document.getElementById("username-input").value.trim();
        if (input) {
            localStorage.setItem("username", input);
            username = input;
            console.log("Username set to:", input);
            loadSession();
        } else {
            alert("Please enter a valid username.");
        }
    } catch (e) {
        console.error("Error in setUsername:", e);
    }
}

function loadSession() {
    try {
        const setupElement = document.getElementById("username-setup");
        if (setupElement) setupElement.classList.add("hidden");

        const usernameDisplay = document.getElementById("username-display");
        if (usernameDisplay) usernameDisplay.textContent = username;

        const scoreDisplay = document.getElementById("score-display");
        if (scoreDisplay) scoreDisplay.textContent = `${currentPoints} CR7SIU Points`;

        const tokensDisplay = document.getElementById("tokens-display");
        if (tokensDisplay) tokensDisplay.textContent = currentTokens;

        const playerLevelDisplay = document.getElementById("player-level");
        if (playerLevelDisplay) playerLevelDisplay.textContent = playerLevel;

        const pointsDisplay = document.getElementById("cr7siu-points");
        if (pointsDisplay) pointsDisplay.textContent = currentPoints;

        displayImprovements();
        resetTasks();
        displayTasks();
        displayReferrals();
        showPage('home');
    } catch (e) {
        console.error("Error in loadSession:", e);
    }
}

function showPage(page) {
    try {
        // Reset justClaimedReward flag and ensure popup is hidden when navigating
        justClaimedReward = false;
        ensurePopupHidden();

        document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
        const targetPage = document.getElementById(page);
        if (targetPage) {
            targetPage.classList.remove("hidden");
            console.log(`Navigated to page: ${page}`);
        } else {
            console.error(`Page with id "${page}" not found.`);
        }
        if (page === "rewards") {
            drawWheel();
        }
    } catch (e) {
        console.error("Error in showPage:", e);
    }
}

// Helper function to ensure the popup is hidden
function ensurePopupHidden() {
    try {
        const popup = document.getElementById("reward-popup");
        if (popup) {
            popup.classList.add("hidden");
            const messageElement = document.getElementById("reward-message");
            if (messageElement) messageElement.textContent = "";
            console.log("Popup hidden and message cleared during ensurePopupHidden");
        }
    } catch (e) {
        console.error("Error in ensurePopupHidden:", e);
    }
}

function earnPoints() {
    try {
        currentPoints += 5;
        updatePointsAndLevel();
    } catch (e) {
        console.error("Error in earnPoints:", e);
    }
}

function updatePointsAndLevel() {
    try {
        localStorage.setItem("points", currentPoints);
        localStorage.setItem("tokens", currentTokens);
        localStorage.setItem("level", playerLevel);
        console.log("Updated localStorage:", { points: currentPoints, tokens: currentTokens, level: playerLevel });
        const scoreDisplay = document.getElementById("score-display");
        if (scoreDisplay) scoreDisplay.textContent = `${currentPoints} CR7SIU Points`;
        const pointsDisplay = document.getElementById("cr7siu-points");
        if (pointsDisplay) pointsDisplay.textContent = currentPoints;
        const tokensDisplay = document.getElementById("tokens-display");
        if (tokensDisplay) tokensDisplay.textContent = currentTokens;
        updateLevel();
    } catch (e) {
        console.error("Error in updatePointsAndLevel:", e);
    }
}

function updateLevel() {
    try {
        playerLevel = Math.floor(currentPoints / 100000) + 1;
        const playerLevelDisplay = document.getElementById("player-level");
        if (playerLevelDisplay) playerLevelDisplay.textContent = playerLevel;
        localStorage.setItem("level", playerLevel);
    } catch (e) {
        console.error("Error in updateLevel:", e);
    }
}

function buyPoints() {
    try {
        currentPoints += 1000;
        updatePointsAndLevel();
    } catch (e) {
        console.error("Error in buyPoints:", e);
    }
}

function convertToTokens() {
    try {
        const tokens = Math.floor(currentPoints / 5000);
        if (tokens > 0) {
            currentPoints -= tokens * 5000;
            currentTokens += tokens;
            localStorage.setItem("points", currentPoints);
            localStorage.setItem("tokens", currentTokens);
            const tokensDisplay = document.getElementById("tokens-display");
            if (tokensDisplay) tokensDisplay.textContent = currentTokens;
            updateRewardStatus(`You converted ${tokens} CR7SIU tokens!`);
            updatePointsAndLevel();
        } else {
            updateRewardStatus("Not enough points.");
        }
    } catch (e) {
        console.error("Error in convertToTokens:", e);
    }
}

function displayTasks() {
    try {
        const tasksContainer = document.getElementById("tasks-container");
        if (!tasksContainer) return;
        tasksContainer.innerHTML = Object.keys(tasksCompleted).map(task => `
            <div class="task">
                <h3>Complete ${task.charAt(0).toUpperCase() + task.slice(1)} Task</h3>
                <p>${task === 'youtube' ? 'Watch and like our latest video' : 
                    task === 'xAccount' ? 'Tweet with our hashtag' : 
                    'Share our post on your timeline'}</p>
                <button id="task-${task}" onclick="completeTask('${task}')" ${lastTaskClaims[task] && !isNewDay(lastTaskClaims[task]) ? 'disabled' : ''}>
                    ${lastTaskClaims[task] && !isNewDay(lastTaskClaims[task]) ? 'Claimed' : 'Complete'}
                </button>
            </div>
        `).join('');
        updateTaskButtons();
    } catch (e) {
        console.error("Error in displayTasks:", e);
    }
}

function completeTask(task) {
    try {
        console.log(`Attempting to complete task: ${task}`);
        if (lastTaskClaims[task] && !isNewDay(lastTaskClaims[task])) {
            updateRewardStatus("You can only claim this task once per day!");
            return;
        }

        tasksCompleted[task] = true;
        lastTaskClaims[task] = Date.now();
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        localStorage.setItem("lastTaskClaims", JSON.stringify(lastTaskClaims));
        updateTaskButtons();
        checkAllTasksCompleted();
        currentPoints += 5000;
        updatePointsAndLevel();
        justClaimedReward = true;
        showRewardPopup(`Reward Claimed! 5000 CR7SIU Points have been credited to your account.`);
        const button = document.getElementById(`task-${task}`);
        if (button) {
            button.disabled = true;
            button.textContent = "Claimed";
        }
    } catch (e) {
        console.error("Error in completeTask:", e);
    }
}

function updateTaskButtons() {
    try {
        Object.keys(tasksCompleted).forEach(task => {
            const button = document.getElementById(`task-${task}`);
            if (button) {
                const canClaim = isNewDay(lastTaskClaims[task]);
                if (canClaim) {
                    tasksCompleted[task] = false;
                    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
                }
                button.disabled = !canClaim;
                button.textContent = canClaim ? "Complete" : "Claimed";
            }
        });
    } catch (e) {
        console.error("Error in updateTaskButtons:", e);
    }
}

function checkAllTasksCompleted() {
    try {
        if (Object.values(tasksCompleted).every(Boolean)) {
            const claimButton = document.getElementById("claim-rewards-btn");
            if (claimButton) {
                const canClaim = isNewDay(lastRewardsClaim);
                claimButton.disabled = !canClaim;
                updateRewardStatus(canClaim ? "All tasks completed! You can now claim additional rewards." : "You can only claim rewards once per day!");
            }
        }
    } catch (e) {
        console.error("Error in checkAllTasksCompleted:", e);
    }
}

function claimRewards() {
    try {
        console.log("Attempting to claim rewards");
        if (!isNewDay(lastRewardsClaim)) {
            updateRewardStatus("You can only claim rewards once per day!");
            return;
        }

        if (Object.values(tasksCompleted).every(Boolean)) {
            currentPoints += 5000;
            updatePointsAndLevel();
            justClaimedReward = true;
            showRewardPopup("Reward Claimed! 5000 CR7SIU Points have been credited to your account.");
            resetTasks();
            lastRewardsClaim = Date.now();
            localStorage.setItem("lastRewardsClaim", lastRewardsClaim);
            const claimButton = document.getElementById("claim-rewards-btn");
            if (claimButton) {
                claimButton.disabled = true;
                claimButton.textContent = "Claimed";
            }
        } else {
            updateRewardStatus("Complete all tasks before claiming rewards.");
        }
    } catch (e) {
        console.error("Error in claimRewards:", e);
    }
}

function showRewardPopup(message) {
    try {
        if (!justClaimedReward) {
            console.log("Reward popup not shown: No recent claim.");
            return;
        }
        // Ensure the popup is only shown on the Rewards page
        const rewardsPage = document.getElementById("rewards");
        if (!rewardsPage || rewardsPage.classList.contains("hidden")) {
            console.log("Reward popup not shown: Not on Rewards page.");
            return;
        }
        console.log("Showing reward popup with message:", message, new Error().stack);
        const popup = document.getElementById("reward-popup");
        const messageElement = document.getElementById("reward-message");
        if (popup && messageElement) {
            messageElement.textContent = message;
            popup.classList.remove("hidden");
        } else {
            console.error("Popup or message element not found.");
        }
        justClaimedReward = false;
    } catch (e) {
        console.error("Error in showRewardPopup:", e);
    }
}

function closeRewardPopup() {
    try {
        const popup = document.getElementById("reward-popup");
        if (popup) {
            popup.classList.add("hidden");
            console.log("Popup closed by user.");
        }
    } catch (e) {
        console.error("Error in closeRewardPopup:", e);
    }
}

function displayImprovements() {
    try {
        const improvements = ['Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing', 'Defending', 'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity', 'Leadership', 'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power', 'Ball Handling', 'Acceleration'];
        const container = document.getElementById("attributes-container");
        if (!container) return;
        let html = '';
        improvements.forEach((attr, index) => {
            const level = attributes[attr] || 1;
            const cost = 500 + 250 * (level - 1);
            html += `
                <div class="attribute-card">
                    <h3>${attr}</h3>
                    <p>Upgrade Cost: ${cost} points</p>
                    <p>Level: <span id="attribute-level-${index}">${level}</span></p>
                    <button onclick="upgradeSkill('${attr}', ${index}, ${cost})">Upgrade</button>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        console.error("Error in displayImprovements:", e);
    }
}

function upgradeSkill(attribute, index, cost) {
    try {
        const level = attributes[attribute] || 1;
        if (currentPoints >= cost) {
            currentPoints -= cost;
            attributes[attribute] = level + 1;
            updatePointsAndLevel();
            localStorage.setItem("attributes", JSON.stringify(attributes));
            const levelDisplay = document.getElementById(`attribute-level-${index}`);
            if (levelDisplay) levelDisplay.textContent = attributes[attribute];
            if (attributes[attribute] % 10 === 0) {
                currentPoints += 2500;
                updatePointsAndLevel();
                updateRewardStatus("Level milestone achieved! Cashback of 2500 points awarded.");
            }
        } else {
            updateRewardStatus("Not enough points!");
        }
    } catch (e) {
        console.error("Error in upgradeSkill:", e);
    }
}

function generateReferralLink() {
    try {
        if (username) {
            let link = `${window.location.origin}/?ref=${username}`;
            const referralField = document.getElementById('referral-link-field');
            if (referralField) referralField.value = link;
            updateRewardStatus("Referral link generated. Share this to earn points!");
        } else {
            updateRewardStatus("Please set a username first!");
        }
    } catch (e) {
        console.error("Error in generateReferralLink:", e);
    }
}

function checkForReferral() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const ref = urlParams.get('ref');
        if (ref && ref !== username && !referralUsers.includes(ref)) {
            referralUsers.push(ref);
            localStorage.setItem("referralUsers", JSON.stringify(referralUsers));
            currentPoints += 5000;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You've earned 5000 CR7SIU Points for a successful referral!");
        }
    } catch (e) {
        console.error("Error in checkForReferral:", e);
    }
}

function shareLink(platform) {
    try {
        const link = document.getElementById('referral-link-field').value;
        if (link) {
            if (navigator.share) {
                navigator.share({
                    title: 'Join CR7SIU!',
                    text: 'Check out this cool app for Ronaldo fans!',
                    url: link
                }).then(() => console.log('Successful share'))
                  .catch((error) => console.log('Error sharing', error));
            } else {
                switch(platform) {
                    case 'facebook':
                        window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(link));
                        break;
                    case 'x':
                        window.open("https://twitter.com/intent/tweet?text=Check out CR7SIU!&url=" + encodeURIComponent(link));
                        break;
                    case 'whatsapp':
                        window.open("whatsapp://send?text=Check out CR7SIU! " + link);
                        break;
                    case 'telegram':
                        window.open("https://telegram.me/share/url?url=" + encodeURIComponent(link) + "&text=Check out CR7SIU!");
                        break;
                    case 'instagram':
                        updateRewardStatus("Instagram sharing not directly supported. Share link manually.");
                        break;
                }
            }
        } else {
            updateRewardStatus("Please generate a referral link first!");
        }
    } catch (e) {
        console.error("Error in shareLink:", e);
    }
}

function toggleShareOptions() {
    try {
        const shareOptions = document.getElementById('social-share');
        if (shareOptions) shareOptions.classList.toggle('hidden');
    } catch (e) {
        console.error("Error in toggleShareOptions:", e);
    }
}

function displayReferrals() {
    try {
        const referralList = document.getElementById("referrals-list");
        if (referralList) {
            referralList.innerHTML = referralUsers.map(user => `<div>${user}</div>`).join('');
            const referralCount = document.getElementById("referral-count");
            if (referralCount) referralCount.textContent = referralUsers.length;
        }
    } catch (e) {
        console.error("Error in displayReferrals:", e);
    }
}

function resetTasks() {
    try {
        tasksCompleted = { youtube: false, xAccount: false, facebook: false };
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        const claimButton = document.getElementById("claim-rewards-btn");
        if (claimButton) claimButton.disabled = true;
        updateTaskButtons();
    } catch (e) {
        console.error("Error in resetTasks:", e);
    }
}

function isNewDay(lastClaimTime) {
    try {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        return now - lastClaimTime >= oneDay;
    } catch (e) {
        console.error("Error in isNewDay:", e);
        return false;
    }
}

function updateButtonStates() {
    try {
        // Update ad, check-in, and spin buttons
        if (isNewDay(lastAdClaim)) enableSpecificButton('ad-claim-button');
        else disableSpecificButton('ad-claim-button');
        if (isNewDay(lastCheckInClaim)) enableSpecificButton('check-in-button');
        else disableSpecificButton('check-in-button');
        if (isNewDay(lastSpinClaim)) enableSpecificButton('spin-button');
        else disableSpecificButton('spin-button');

        // Update task buttons
        Object.keys(tasksCompleted).forEach(task => {
            const button = document.getElementById(`task-${task}`);
            if (button) {
                const canClaim = isNewDay(lastTaskClaims[task]);
                if (canClaim) {
                    tasksCompleted[task] = false;
                    localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
                }
                button.disabled = !canClaim;
                button.textContent = canClaim ? "Complete" : "Claimed";
            }
        });

        // Update Claim Rewards button
        const claimButton = document.getElementById("claim-rewards-btn");
        if (claimButton) {
            const canClaim = isNewDay(lastRewardsClaim);
            claimButton.disabled = !canClaim || !Object.values(tasksCompleted).every(Boolean);
            claimButton.textContent = canClaim ? "Claim Rewards" : "Claimed";
        }
    } catch (e) {
        console.error("Error in updateButtonStates:", e);
    }
}

function enableSpecificButton(buttonId) {
    try {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = button.id === 'spin-button' ? 'Spin to Win!' : 'Claim Reward';
        }
    } catch (e) {
        console.error("Error in enableSpecificButton:", e);
    }
}

function disableSpecificButton(buttonId) {
    try {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.textContent = 'Claimed';
        }
    } catch (e) {
        console.error("Error in disableSpecificButton:", e);
    }
}

function completeAdTask() {
    try {
        console.log("Attempting to complete ad task");
        if (isNewDay(lastAdClaim)) {
            currentPoints += 100;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You earned 100 CR7SIU Points from the ad reward.");
            justClaimedReward = true;
            showRewardPopup("Reward Claimed! 100 CR7SIU Points have been credited to your account.");
            lastAdClaim = Date.now();
            localStorage.setItem("lastAdClaim", lastAdClaim);
            disableSpecificButton('ad-claim-button');
        } else {
            updateRewardStatus("You can only claim this reward once per day!");
        }
    } catch (e) {
        console.error("Error in completeAdTask:", e);
    }
}

function completeCheckInTask() {
    try {
        console.log("Attempting to complete check-in task");
        if (isNewDay(lastCheckInClaim)) {
            currentPoints += 500;
            updatePointsAndLevel();
            updateRewardStatus("Congratulations! You earned 500 CR7SIU Points for your daily check-in.");
            justClaimedReward = true;
            showRewardPopup("Reward Claimed! 500 CR7SIU Points have been credited to your account.");
            lastCheckInClaim = Date.now();
            localStorage.setItem("lastCheckInClaim", lastCheckInClaim);
            disableSpecificButton('check-in-button');
        } else {
            updateRewardStatus("You can only claim this reward once per day!");
        }
    } catch (e) {
        console.error("Error in completeCheckInTask:", e);
    }
}

function drawWheel(angle = 0) {
    try {
        const canvas = document.getElementById("wheelCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const sections = 6;
        const arc = (2 * Math.PI) / sections;
        const radius = canvas.width / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(radius, radius);
        ctx.rotate(angle);

        for (let i = 0; i < sections; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);
            ctx.lineTo(0, 0);
            ctx.fillStyle = wheelColors[i];
            ctx.fill();
            ctx.save();

            ctx.fillStyle = "#FFF";
            ctx.font = "bold 20px Roboto";
            ctx.textAlign = "center";
            ctx.rotate(i * arc + arc / 2);
            ctx.fillText(wheelRewards[i], radius * 0.6, 0);
            ctx.restore();
        }

        ctx.rotate(-angle);
        ctx.translate(-radius, -radius);
    } catch (e) {
        console.error("Error in drawWheel:", e);
    }
}

function spinWheel() {
    try {
        console.log("Attempting to spin the wheel");
        if (isSpinning || !isNewDay(lastSpinClaim)) {
            updateRewardStatus("You can only spin once per day!");
            return;
        }

        isSpinning = true;
        disableSpecificButton("spin-button");

        const spins = 5 + Math.random() * 5;
        const randomSection = Math.floor(Math.random() * 6);
        const targetAngle = (2 * Math.PI * spins) + (randomSection * (2 * Math.PI / 6));
        let currentAngle = 0;
        const duration = 3000;
        const startTime = performance.now();

        function animateWheel(time) {
            try {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                currentAngle = targetAngle * (1 - Math.pow(1 - progress, 2));
                drawWheel(currentAngle);

                if (progress < 1) {
                    requestAnimationFrame(animateWheel);
                } else {
                    isSpinning = false;
                    const reward = wheelRewards[randomSection];
                    currentPoints += reward;
                    updatePointsAndLevel();
                    justClaimedReward = true;
                    showRewardPopup(`Reward Claimed! ${reward} CR7SIU Points have been credited to your account.`);
                    lastSpinClaim = Date.now();
                    localStorage.setItem("lastSpinClaim", lastSpinClaim);
                }
            } catch (e) {
                console.error("Error in animateWheel:", e);
            }
        }

        requestAnimationFrame(animateWheel);
    } catch (e) {
        console.error("Error in spinWheel:", e);
    }
}

function updateRewardStatus(message) {
    try {
        const statusElement = document.getElementById("reward-status");
        if (statusElement) {
            statusElement.innerText = message;
        }
    } catch (e) {
        console.error("Error in updateRewardStatus:", e);
    }
}

document.addEventListener('touchstart', function(event) {
    try {
        if (event.target.tagName === 'BUTTON') {
            event.target.click();
        }
    } catch (e) {
        console.error("Error in touchstart listener:", e);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Ensure popup is hidden on page load
        justClaimedReward = false;
        setTimeout(() => {
            ensurePopupHidden();
        }, 100); // Slight delay to ensure DOM is ready

        updateRewardStatus("Welcome back! Complete your daily tasks to claim rewards.");
        updateButtonStates();
        if (document.getElementById("rewards") && !document.getElementById("rewards").classList.contains("hidden")) {
            drawWheel();
        }
    } catch (e) {
        console.error("Error in DOMContentLoaded:", e);
    }
});