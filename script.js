const dino = document.getElementById("dino");
const obstacle = document.getElementById("obstacle");
const reward = document.getElementById("reward");
const scoreElement = document.getElementById("score");
const rewardMessage = document.getElementById("reward-message");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const musicToggle = document.getElementById("music-toggle");
const backgroundMusic = document.getElementById("background-music");
const jumpSound = document.getElementById("jump-sound");
const rewardSound = document.getElementById("reward-sound");
const gameOverSound = document.getElementById("game-over-sound");

let isJumping = false;
let score = 0;
let isInvincible = false; // حالة المكافأة (عدم الموت)
let isMusicPlaying = true;
let isGameOver = false;

// تشغيل الموسيقى الخلفية
backgroundMusic.play();

// وظيفة القفز (تم تحسين السرعة)
function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    jumpSound.play();
    let position = 0;
    const upInterval = setInterval(() => {
        if (position >= 100) { // تقليل ارتفاع القفز
            clearInterval(upInterval);
            // الهبوط
            const downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    position -= 4; // زيادة سرعة الهبوط
                    dino.style.bottom = position + "px";
                }
            }, 10); // تقليل الفاصل الزمني للهبوط
        } else {
            position += 3; // زيادة سرعة الصعود
            dino.style.bottom = position + "px";
        }
    }, 10); // تقليل الفاصل الزمني للصعود
}

// التحكم بالقفز بالمسافة (Space)
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});

// التحكم بالقفز بالنقر على الشاشة أو اللمس
document.addEventListener("click", jump); // النقر بالماوس
document.addEventListener("touchstart", jump); // اللمس على الأجهزة المحمولة

// زيادة النقاط مع الوقت
function updateScore() {
    if (isGameOver) return;
    score++;
    scoreElement.textContent = `النقاط: ${score}`;
}
setInterval(updateScore, 100);

// ظهور المكافأة كل دقيقة
function spawnReward() {
    if (isGameOver) return;
    reward.style.display = "block";
    reward.style.right = "-40px";
    reward.style.animation = "moveObstacle 2s linear infinite";

    setTimeout(() => {
        reward.style.display = "none";
    }, 5000); // اختفاء المكافأة بعد 5 ثواني
}

setInterval(spawnReward, 60000); // ظهور المكافأة كل 60 ثانية

// تفعيل المكافأة عند لمسها
function checkRewardCollision() {
    if (isGameOver) return;
    const dinoRect = dino.getBoundingClientRect();
    const rewardRect = reward.getBoundingClientRect();

    if (
        dinoRect.left < rewardRect.right &&
        dinoRect.right > rewardRect.left &&
        dinoRect.bottom > rewardRect.top
    ) {
        reward.style.display = "none";
        isInvincible = true;
        rewardMessage.textContent = "بصحتك خو! تقدر لمس السمينة بلا موت!";
        rewardMessage.style.display = "block";
        rewardSound.play();

        setTimeout(() => {
            isInvincible = false;
            rewardMessage.style.display = "none";
        }, 10000); // المكافأة تستمر لمدة 10 ثواني
    }
}

setInterval(checkRewardCollision, 10);

// اكتشاف الاصطدام بالعوائق
function checkCollision() {
    if (isGameOver || isInvincible) return; // لا يموت إذا كانت المكافأة مفعلة أو اللعبة متوقفة

    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        dinoRect.left < obstacleRect.right &&
        dinoRect.right > obstacleRect.left &&
        dinoRect.bottom > obstacleRect.top
    ) {
        isGameOver = true;
        gameOverSound.play();
        backgroundMusic.pause();
        gameOverScreen.classList.remove("hidden");
        gameOverScreen.classList.add("visible");
        finalScore.textContent = score;

        // إيقاف حركة العوائق والمكافآت
        obstacle.style.animation = "none";
        reward.style.animation = "none";
    }
}

setInterval(checkCollision, 10);

// إعادة تشغيل اللعبة
restartButton.addEventListener("click", () => {
    isGameOver = false;
    gameOverScreen.classList.remove("visible");
    gameOverScreen.classList.add("hidden");
    backgroundMusic.play();
    score = 0;
    scoreElement.textContent = `النقاط: ${score}`;

    // إعادة تشغيل حركة العوائق والمكافآت
    obstacle.style.animation = "moveObstacle 2s linear infinite";
    reward.style.animation = "moveObstacle 2s linear infinite";
});

// التحكم بالموسيقى
musicToggle.addEventListener("click", () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        jumpSound.pause();
        rewardSound.pause();
        gameOverSound.pause();
        musicToggle.textContent = "🔇";
    } else {
        backgroundMusic.play();
        musicToggle.textContent = "🔊";
    }
    isMusicPlaying = !isMusicPlaying;
});