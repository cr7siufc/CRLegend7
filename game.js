// Store user data in localStorage
let username = localStorage.getItem("username") || '';
let currentPoints = parseInt(localStorage.getItem("points")) || 0;
let lastRewardClaimTime = parseInt(localStorage.getItem("lastRewardClaimTime")) || 0;
let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || { youtube: false, xAccount: false, facebook: false };

// Show username setup if it's the user's first session
if (!username) {
    document.getElementById("username-setup").classList.remove("hidden");
    document.getElementById("username-input").focus();
} else {
    loadSession();
}

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

function loadSession() {
    document.getElementById("username-setup").classList.add("hidden");
    document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
    resetDailyTasks();
    displayTasks();
    updateRewardStatus("Welcome back! Complete your daily tasks to claim rewards.");
}

function displayTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = Object.keys(tasksCompleted).map(task => `
        <div class="task">
            <h3>${task.charAt(0).toUpperCase() + task.slice(1)} Task</h3>
            <p>${task === 'youtube' ? 'Watch and like our latest video' : 
                task === 'xAccount' ? 'Tweet with our hashtag' : 
                'Share our post on your timeline'}</p>
            <button onclick="completeTask('${task}')" ${tasksCompleted[task] ? 'disabled' : ''}>
                ${tasksCompleted[task] ? 'Completed' : 'Complete'}
            </button>
        </div>
    `).join('');
}

function completeTask(task) {
    let now = getISTTime().getTime();
    if (now - lastRewardClaimTime >= 86400000 || lastRewardClaimTime === 0) {
        if (!tasksCompleted[task]) {
            tasksCompleted[task] = true;
            localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
            updateTaskButtons();
            checkAllTasksCompleted();
        }
    } else {
        updateRewardStatus("You can only complete tasks once every 24 hours.");
    }
}

function updateTaskButtons() {
    Object.keys(tasksCompleted).forEach(task => {
        let button = document.querySelector(`#tasks-container .task button[onclick="completeTask('${task}')"]`);
        if (button) { 
            button.disabled = tasksCompleted[task];
            button.textContent = tasksCompleted[task] ? "Completed" : "Complete";
        }
    });
}

function checkAllTasksCompleted() {
    if (Object.values(tasksCompleted).every(Boolean)) {
        document.getElementById("claim-rewards-btn").disabled = false;
        updateRewardStatus("All tasks completed! You can now claim your rewards.");
    }
}

function claimRewards() {
    let now = getISTTime().getTime();
    if (now - lastRewardClaimTime >= 86400000 || lastRewardClaimTime === 0) {
        if (Object.values(tasksCompleted).every(Boolean)) {
            currentPoints += 5000;
            localStorage.setItem("points", currentPoints);
            document.getElementById("score-display").textContent = `${currentPoints} CR7SIU Points`;
            updateRewardStatus("Congratulations! You earned 5000 CR7SIU Points.");
            lastRewardClaimTime = now;
            localStorage.setItem("lastRewardClaimTime", lastRewardClaimTime.toString());
            resetDailyTasks(); // Reset tasks after claim
            document.getElementById("claim-rewards-btn").disabled = true; // Disable claim button after claiming
        } else {
            updateRewardStatus("Complete all tasks before claiming rewards.");
        }
    } else {
        updateRewardStatus("You can only claim rewards once every 24 hours.");
    }
}

function getISTTime() {
    let now = new Date();
    now.setHours(now.getHours() + 5, now.getMinutes() + 30); // IST is UTC+5:30
    return now;
}

function resetDailyTasks() {
    let now = getISTTime();
    let resetTime = new Date(now);
    resetTime.setHours(0, 0, 0, 0); // Reset to midnight IST
    
    if (now >= resetTime || lastRewardClaimTime === 0) {
        tasksCompleted = { youtube: false, xAccount: false, facebook: false };
        localStorage.setItem("tasksCompleted", JSON.stringify(tasksCompleted));
        lastRewardClaimTime = now.getTime();
        localStorage.setItem("lastRewardClaimTime", lastRewardClaimTime.toString());
        document.getElementById("claim-rewards-btn").disabled = true;
        updateTaskButtons();
    }
}

function updateRewardStatus(message) {
    document.getElementById("reward-status").innerText = message;
}

document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('spin-timer');
    if (timerElement) {
        setInterval(() => {
            let now = getISTTime().getTime();
            let reset = new Date(now);
            reset.setHours(0, 0, 0, 0); // Set to midnight IST
            if (now > reset.getTime()) reset.setDate(reset.getDate() + 1); // If past midnight, set for next day

            let timeLeft = reset.getTime() - now;
            if (timeLeft > 0) {
                let hours = Math.floor(timeLeft / (1000 * 60 * 60));
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timerElement.textContent = "00:00:00";
                resetDailyTasks();
            }
        }, 1000);
    }
});