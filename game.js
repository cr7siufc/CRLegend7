let referralLink = "";

// Generate a random referral link for the user
function generateReferralLink() {
    let userId = Math.random().toString(36).substr(2, 9);
    referralLink = `https://t.me/CRLegend7_Bot?ref=${userId}`;
    document.getElementById('referral-link').value = referralLink;
}

// Copy the referral link to the clipboard
function copyReferralLink() {
    let referralInput = document.getElementById('referral-link');
    referralInput.select();
    document.execCommand('copy');
}

// Retrieve the referral link
function getReferralLink() {
    return referralLink;
}

// Toggle the visibility of the social share options
function toggleShareOptions() {
    document.getElementById('social-share').classList.toggle('hidden');
}

// Share the referral link on different platforms
function shareLink(platform) {
    let referralText = `🚨 CR7SIU Referral Program! 🚨
Earn 10,000 CR7SIU Points for each successful referral!
👉 ${getReferralLink()}
#CR7SIU #ReferralProgram #Crypto #FanToken`;

    let shareUrls = {
        facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralText)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(referralText)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(referralText)}`,
        telegram: `https://telegram.me/share/url?url=${encodeURIComponent(referralText)}`,
        instagram: `https://www.instagram.com/?url=${encodeURIComponent(referralText)}`
    };

    window.open(shareUrls[platform] || `https://t.me/share/url?url=${encodeURIComponent(referralText)}`, '_blank');
}

// Spin the wheel for a chance to win CR7SIU points
function spinWheel() {
    let wheelRewards = [2500, 3500, 5500, 6500, 7500];
    let randomReward = wheelRewards[Math.floor(Math.random() * wheelRewards.length)];
    alert("You won " + randomReward + " CR7SIU points!");
    updateTotalScore(randomReward);
}

// Update the total score with the earned points
function updateTotalScore(points) {
    let currentScore = parseInt(document.getElementById('score-display').innerText) + points;
    document.getElementById('score-display').innerText = currentScore + " CR7SIU Points";
}

// Validate all tasks and hide the "Validate All Tasks" button
function validateAllTasks() {
    alert("All tasks validated successfully!");
    document.getElementById('validate-all-offers').style.display = 'none';
}

// Complete the ad task and enable the "Claim Ad Reward" button
function completeAdTask() {
    document.getElementById('ad-claim-button').disabled = false;
    alert("You can now claim your ad reward!");
}

// Complete the daily check-in task and enable the "Claim Daily Check-In Reward" button
function completeCheckInTask() {
    document.getElementById('check-in-button').disabled = false;
    alert("You can now claim your daily check-in reward!");
}

// Set the username and update the display
function setUsername() {
    let username = document.getElementById('username-input').value;
    if (username) {
        document.getElementById('username-display').innerText = username;
        document.getElementById('username-setup').classList.add('hidden');
        document.getElementById('home').classList.remove('hidden');
    } else {
        alert("Please enter a username!");
    }
}

// Function to handle tasks like referral, watching ads, daily check-ins, etc.
function handleTask(task) {
    switch (task) {
        case 'watch-ad':
            completeAdTask();
            break;
        case 'daily-checkin':
            completeCheckInTask();
            break;
        case 'spin-wheel':
            spinWheel();
            break;
        case 'validate-tasks':
            validateAllTasks();
            break;
        default:
            console.log("Unknown task");
    }
}

// Load initial data and setup the referral link
window.onload = function() {
    generateReferralLink();
};
