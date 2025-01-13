<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CR7SIU</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Logo before Header -->
    <div id="cr7-logo"></div>

    <header>
        <h1>CR7SIU</h1>
        <div id="cr7siu-note">
            The ultimate platform for Cristiano Ronaldo fans! Earn CR7 tokens by tapping to earn or playing exciting games, access live football scores, get exclusive Ronaldo interviews, updates, and highlights, explore CR7-themed NFTs, and redeem rewards.
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0 15px;">
            <div>
                <p>Player Level: <span id="player-level">1</span></p>
                <p>Total Score: <span id="score-display">0 CR7SIU Points</span> <!-- Updated --></p>
            </div>
            <div>
                <p>Total CR7SIU Points: <span id="total-cr7siu-points">0</span> <!-- Updated --></p>
                <p>Total CR7SIU Tokens: <span id="tokens-display">0</span></p>
            </div>
        </div>
    </header>

    <nav>
        <ul>
            <li><button onclick="showPage('home')">Home</button></li>
            <li><button onclick="showPage('improvements')">Improvements</button></li>
            <li><button onclick="showPage('airdrop')">Airdrop</button></li>
            <li><button onclick="showPage('rewards')">Rewards</button></li>
        </ul>
    </nav>

    <main id="home">
        <h2>Player Dashboard</h2>
        <p>Username: <span id="username-display">Not Set</span></p>
        <div style="text-align: center;">
            <div id="tap-to-earn" onclick="earnPoints()"></div>
            <div>Tap to Earn</div>
        </div>
    </main>

    <main id="improvements" class="hidden">
        <h1>Improvements</h1>
        <p>Upgrade your football skills to earn more points!</p>
        <div id="attributes-container"></div>
    </main>

    <main id="airdrop" class="hidden">
        <h1>Airdrop</h1>
        <p>Convert CR7SIU points to CR7SIU Tokens (5000 CR7SIU Points = 1 CR7SIU Token).</p>
        <button onclick="convertToTokens()">Convert CR7SIU Points</button>
        <div id="referral-earning">
            <h2>Referral Earning</h2>
            <p>Earn 10,000 CR7SIU Points for each successful referral!</p>
            <input type="text" id="referral-link" readonly value="Generating referral link..." />
            <button onclick="copyReferralLink()">Copy Link</button>
            <p>Referrals Earned: <span id="referral-count">0</span></p>
            <button onclick="toggleShareOptions()">Share Referral Link</button>
            <div id="social-share" class="hidden">
                <button onclick="shareLink('facebook')">Facebook</button>
                <button onclick="shareLink('twitter')">X (formerly Twitter)</button>
                <button onclick="shareLink('whatsapp')">WhatsApp</button>
                <button onclick="shareLink('telegram')">Telegram</button>
                <button onclick="shareLink('instagram')">Instagram</button>
            </div>
        </div>
    </main>

    <main id="rewards" class="hidden">
        <h1>Rewards</h1>
        <div id="ads-section">
            <h2>Earn from Ads</h2>
            <a href="https://youtu.be/byZi0lcy-jw?si=mgizMFfa7SjYugq7" target="_blank">Click to Watch Ad</a>
            <button onclick="completeAdTask()" id="ad-claim-button" disabled>Claim Ad Reward</button>
        </div>
        <div id="daily-checkin">
            <h2>Daily Check-In</h2>
            <button onclick="completeCheckInTask()" id="check-in-button" disabled>Claim Daily Check-In Reward</button>
        </div>
        <div id="spin-the-wheel">
            <h2>Spin the Wheel</h2>
            <button onclick="spinWheel()" id="spin-button">Spin to Win!</button>
            <p>Click to spin the wheel for a chance to win CR7SIU Points!</p>
            <p id="spin-claim-time"></p>
        </div>
        <div id="validate-all-offers">
            <button onclick="validateAllTasks()">Validate All Tasks</button>
        </div>
        <div style="text-align: left; margin-top: 20px;">
            <h3>Subscribe and Join:</h3>
            <ul>
                <li><a href="https://www.youtube.com/@CR7SIUnextbigthing" target="_blank">Subscribe to our Youtube Channel</a></li>
                <li><a href="https://x.com/cr7siucoin" target="_blank">Join our X Account</a></li>
                <li><a href="https://www.facebook.com/profile.php?id=61571519741834&mibextid=ZbWKwL" target="_blank">Like and join our Facebook Page</a></li>
                <li><a href="https://youtu.be/byZi0lcy-jw?si=7yxJZdC_6y42Pqs1" target="_blank">Watch Ad</a></li>
            </ul>
        </div>
    </main>

    <div id="username-setup" class="hidden">
        <h2>Welcome! Please enter your username to start:</h2>
        <input type="text" id="username-input" placeholder="Enter Username">
        <button onclick="setUsername()">Set Username</button>
    </div>

    <div id="footer" style="background-color: black; height: 50px;"></div> <!-- Updated footer background -->

    <script src="game.js"></script>
    <script>
        // Store username, points, tokens, and other data in localStorage
        let username = localStorage.getItem("username") || '';
        let currentPoints = parseInt(localStorage.getItem("points")) || 0;
        let playerLevel = parseInt(localStorage.getItem("level")) || 1;
        let currentTokens = parseInt(localStorage.getItem("tokens")) || 0;
        let attributes = JSON.parse(localStorage.getItem("attributes")) || {};
        let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };
        let referralUsers = JSON.parse(localStorage.getItem("referralUsers")) || [];
        let lastSpinTime = parseInt(localStorage.getItem("lastSpinTime")) || 0;
        let spinClaimed = localStorage.getItem("spinClaimed") === "true";
        let lastRewardClaimTime = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0; // To store last reward claim time

        // Show username setup if it's the user's first session
        if (!username) {
            document.getElementById("username-setup").classList.remove("hidden");
            document.getElementById("username-input").focus();
        } else {
            loadSession();
        }

        // Set up username
        function setUsername() {
            const input = document.getElementById("username-input").value.trim();
            if (input) {
                localStorage.setItem("username", input);
                username = input;
                loadSession();
            } else {
                alert("Please enter a valid username.");
            }
        }

        // Load user session data
        function loadSession() {
            document.getElementById("username-setup").classList.add("hidden");
            document.getElementById("username-display").textContent = username;
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;  // Updated Total Score
            document.getElementById("tokens-display").textContent = currentTokens;
            document.getElementById("player-level").textContent = playerLevel;
            displayImprovements();
            displayTasks();
            updateSpinButton();
            updateRewardsLink();
            showPage('home');
        }

        // Show a specific page
        function showPage(page) {
            document.querySelectorAll("main").forEach(p => p.classList.add("hidden"));
            document.getElementById(page).classList.remove("hidden");
        }

        // Points and level management
        function earnPoints() {
            currentPoints += 5;
            localStorage.setItem("points", currentPoints);
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`; // Updated Total Score
            updateLevel();
        }

        function updateLevel() {
            playerLevel = Math.floor(currentPoints / 100000) + 1;
            document.getElementById("player-level").textContent = playerLevel;
            localStorage.setItem("level", playerLevel);
        }

        function buyPoints() {
            currentPoints += 1000;
            localStorage.setItem("points", currentPoints);
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`; // Updated Total Score
        }

        function convertToTokens() {
            const tokens = Math.floor(currentPoints / 5000);
            if (tokens > 0) {
                currentPoints -= tokens * 5000;
                currentTokens += tokens;
                localStorage.setItem("points", currentPoints);
                localStorage.setItem("tokens", currentTokens);
                document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;  // Updated Total Score
                document.getElementById("tokens-display").textContent = currentTokens;
                alert(`You converted ${tokens} CR7SIU tokens!`);
            } else {
                alert("Not enough points.");
            }
        }

        // Display and upgrade player attributes
        function displayImprovements() {
            const improvements = [
                'Stamina', 'Strength', 'Dribbling', 'Shooting Power', 'Speed', 'Passing', 'Defending', 
                'Crossing', 'Finishing', 'Heading', 'Control', 'Creativity', 'Leadership', 
                'Tackling', 'Positioning', 'Composure', 'Vision', 'Shot Power', 'Ball Handling', 'Acceleration'
            ];
            const container = document.getElementById("attributes-container");
            container.innerHTML = improvements.map((improvement, index) => {
                const level = attributes[improvement] || 1;
                const cost = 500 + 250 * (level - 1);
                return `
                    <div class="attribute-card">
                        <h3>${improvement}</h3>
                        <p>Upgrade Cost: ${cost} points</p>
                        <p>Level: <span id="attribute-level-${index}">${level}</span></p>
                        <button onclick="upgradeSkill('${improvement}', ${index}, ${cost})">Upgrade</button>
                    </div>
                `;
            }).join('');
        }

        function upgradeSkill(attribute, index, cost) {
            const level = attributes[attribute] || 1;
            if (currentPoints >= cost) {
                currentPoints -= cost;
                attributes[attribute] = level + 1;
                localStorage.setItem("points", currentPoints);
                localStorage.setItem("attributes", JSON.stringify(attributes));
                document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;  // Updated Total Score
                document.getElementById(`attribute-level-${index}`).textContent = attributes[attribute];
                if (attributes[attribute] % 10 === 0) {
                    currentPoints += 2500;
                    localStorage.setItem("points", currentPoints);
                    alert("Level milestone achieved! Cashback of 2500 points awarded.");
                }
                alert("Upgrade successful!");
            } else {
                alert("Not enough points!");
            }
        }

        // Tasks and rewards
        function displayTasks() {
            const tasks = [
                { name: "Subscribe to the Youtube Channel", url: "https://www.youtube.com/@CR7SIUnextbigthing", key: "youtube" },
                { name: "Join the X Account", url: "https://x.com/cr7siucoin", key: "xAccount" },
                { name: "Like and join the Facebook Page", url: "https://www.facebook.com/profile.php?id=61571519741834&mibextid=ZbWKwL", key: "facebook" }
            ];
            const tasksContainer = document.getElementById("task-section");
            tasksContainer.innerHTML = tasks.map(task => `
                <div class="task">
                    <a href="${task.url}" target="_blank" onclick="enableTaskButton('${task.key}')">${task.name}</a>
                    <button id="validate-${task.key}" onclick="completeTask('${task.key}')" ${tasksCompleted[task.key] ? 'disabled' : ''}>Mark as Done</button>
                    ${tasksCompleted[task.key] ? '<span class="completed-task">Completed</span>' : ''}
                </div>
            `).join('');
            updateTaskButtons();
        }

        function completeTask(task) {
            tasksCompleted[task] = true;
            localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
            alert(`Task "${task}" marked as completed!`);
            updateTaskButtons();
        }

        function updateTaskButtons() {
            Object.keys(tasksCompleted).forEach(task => {
                const button = document.getElementById(`validate-${task}`);
                if (tasksCompleted[task]) {
                    button.disabled = true;
                    button.textContent = "Completed";
                }
            });
            document.getElementById("claim-rewards-btn").disabled = !Object.values(tasksCompleted).every(Boolean);
        }

        function claimRewards() {
            if (Object.values(tasksCompleted).every(Boolean)) {
                if (!localStorage.getItem("rewardsClaimed")) {
                    currentPoints += 5000;
                    localStorage.setItem("points", currentPoints);
                    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;  // Updated Total Score
                    alert("Congratulations! You earned 5000 CR7SIU Points.");
                    localStorage.setItem("rewardsClaimed", true);
                } else {
                    alert("Rewards already claimed.");
                }
            } else {
                alert("Complete all tasks before claiming rewards.");
            }
        }

        // Spin wheel functionality
        function spinWheel() {
            const rewards = [2500, 3500, 5500, 6500, 7500];
            const spinButton = document.getElementById("spin-button");
            spinButton.disabled = true;
            document.getElementById("wheel").style.transform = `rotate(${Math.random() * 360}deg)`;
            setTimeout(() => {
                const reward = rewards[Math.floor(Math.random() * rewards.length)];
                currentPoints += reward;
                localStorage.setItem("points", currentPoints);
                document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;  // Updated Total Score
                alert(`You earned ${reward} CR7SIU Points!`);
                spinClaimed = true;
                localStorage.setItem("spinClaimed", "true");
                localStorage.setItem("lastSpinTime", Date.now());
                updateSpinButton();
            }, 3000);
        }

        function updateSpinButton() {
            const spinButton = document.getElementById("spin-button");
            const currentTime = Date.now();
            if (spinClaimed || currentTime - lastSpinTime < 86400000) {
                spinButton.disabled = true;
                document.getElementById("spin-claim-time").textContent = `Next spin available on ${new Date(lastSpinTime + 86400000).toLocaleString()}`;
            } else {
                spinButton.disabled = false;
            }
        }

        // Quarterly reward link
        function claimRewardLink() {
            const currentTime = Date.now();
            if (currentTime - lastRewardClaimTime > 7776000000) { // 3 months in milliseconds
                currentPoints += 2500;
                localStorage.setItem("points", currentPoints);
                document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;  // Updated Total Score
                alert("You claimed 2500 CR7SIU Points!");
                lastRewardClaimTime = currentTime;
                localStorage.setItem("lastRewardClaimTime", lastRewardClaimTime);
            } else {
                alert("You can claim this reward only once every 3 months.");
            }
        }

        function updateRewardsLink() {
            const currentTime = Date.now();
            document.getElementById("rewards-link").disabled = currentTime - lastRewardClaimTime <= 7776000000;
        }
    </script>
</body>
</html>
