// ============ "DO YOU LOVE ME?" POPUP ============
const popupOverlay = document.getElementById('lovePopup');
const noBtn = document.getElementById('popupNo');
const yesBtn = document.getElementById('popupYes');
const popupEmoji = document.getElementById('popupEmoji');
const popupSub = document.getElementById('popupSub');
const popupCard = document.getElementById('popupCard');
const popupHeartsContainer = document.getElementById('popupFloatingHearts');

let dodgeCount = 0;
let yesScale = 1;

// Emoji progression
const emojis = ['🥺', '😢', '😭', '🥹', '😤', '😿', '💔', '😭'];
// Messages progression  
const messages = [
    'Please choose wisely... 💕',
    'Are you sure?! 😢',
    "You can't escape love! 💗",
    'The answer is always YES! 🥰',
    'Stop running away! 😤',
    'Just click Yes already! 💘',
    "I won't give up! 💪❤️",
    'You KNOW you love me! 😏💕'
];

// Spawn floating hearts in popup background
function spawnPopupHeart() {
    if (popupOverlay.classList.contains('hidden')) return;
    const h = document.createElement('div');
    h.className = 'popup-float-heart';
    const hearts = ['♥', '♡', '💕', '💗', '❤'];
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (Math.random() * 18 + 10) + 'px';
    h.style.color = Math.random() > 0.5 ? '#e8495f' : '#f7a8b8';
    h.style.animationDuration = (Math.random() * 6 + 6) + 's';
    popupHeartsContainer.appendChild(h);
    setTimeout(() => h.remove(), 12000);
}
const popupHeartInterval = setInterval(spawnPopupHeart, 800);
// Spawn a few immediately
for (let i = 0; i < 4; i++) setTimeout(spawnPopupHeart, i * 200);

// ---- NO BUTTON DODGE ----
function dodgeNoButton() {
    dodgeCount++;

    // Calculate safe random position on screen (with margin from edges)
    const margin = 60;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;

    const newX = Math.floor(Math.random() * Math.max(maxX - margin, 100)) + margin;
    const newY = Math.floor(Math.random() * Math.max(maxY - margin, 100)) + margin;

    // Animate the dodge with a smooth transition
    noBtn.classList.add('dodging');
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.bottom = 'auto';
    noBtn.style.right = 'auto';

    // Shrink No button slightly over time
    if (dodgeCount > 3) {
        noBtn.classList.add('shrinking');
    }

    // Grow the Yes button! 🎉
    yesScale += 0.15;
    yesBtn.style.transform = `scale(${yesScale})`;

    // Update emoji with shake animation
    popupEmoji.textContent = emojis[Math.min(dodgeCount - 1, emojis.length - 1)];
    popupEmoji.classList.remove('shake');
    void popupEmoji.offsetWidth; // Force reflow to restart animation
    popupEmoji.classList.add('shake');

    // Update message
    popupSub.textContent = messages[Math.min(dodgeCount, messages.length - 1)];

    // Spawn extra hearts on dodge
    for (let i = 0; i < 3; i++) {
        setTimeout(spawnPopupHeart, i * 100);
    }
}

// Desktop: dodge on hover
noBtn.addEventListener('mouseenter', dodgeNoButton);
// Mobile: dodge on touch
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodgeNoButton();
}, { passive: false });

// ---- YES BUTTON: ACCEPT LOVE ----
yesBtn.addEventListener('click', acceptLove);

function acceptLove() {
    // Stop floating hearts
    clearInterval(popupHeartInterval);

    // Hide No button immediately
    noBtn.style.display = 'none';

    // Success animation
    popupOverlay.classList.add('success');
    popupEmoji.textContent = '🥰';
    popupEmoji.classList.remove('shake');
    popupSub.textContent = 'I knew it! 💕💕💕';

    // Create heart explosion
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const h = document.createElement('div');
            h.className = 'popup-float-heart';
            h.textContent = ['❤️', '💕', '💗', '💖', '💝'][Math.floor(Math.random() * 5)];
            h.style.left = (40 + Math.random() * 20) + '%';
            h.style.bottom = '50%';
            h.style.fontSize = (Math.random() * 24 + 14) + 'px';
            h.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            popupHeartsContainer.appendChild(h);
        }, i * 50);
    }

    // Fade out and reveal website
    setTimeout(() => {
        popupOverlay.classList.add('hidden');
        window.scrollTo(0, 0);
    }, 1200);
}

// ============ PARTICLES CANVAS ============
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#e8495f' : '#d4a853';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
            this.opacity = Math.min(this.opacity + 0.02, 0.8);
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = 'rgba(232,73,95,' + (0.06 * (1 - dist / 100)) + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// ============ SPARKLE TRAIL ============
let sparkleThrottle = 0;
document.addEventListener('mousemove', e => {
    if (Date.now() - sparkleThrottle < 50) return;
    sparkleThrottle = Date.now();
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = (e.clientX - 3) + 'px';
    s.style.top = (e.clientY - 3) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
});

// ============ FLOATING HEARTS ============
function spawnFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'float-heart';
    const hearts = ['♥', '♡', '❤', '💕', '💗'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
    heart.style.color = Math.random() > 0.5 ? '#e8495f' : '#f7a8b8';
    document.getElementById('sideHearts').appendChild(heart);
    setTimeout(() => heart.remove(), 16000);
}
setInterval(spawnFloatingHeart, 1200);

// ============ 3D FLIP CARD ============
let cardFlipped = false;
function flipCard() {
    const card = document.getElementById('card3d');
    cardFlipped = !cardFlipped;
    card.classList.toggle('flipped', cardFlipped);
    if (cardFlipped) {
        document.getElementById('openHint').classList.add('hidden');
        for (let i = 0; i < 8; i++) {
            setTimeout(() => spawnFloatingHeart(), i * 100);
        }
    }
}

// ============ QUOTE CAROUSEL ============
const quoteItems = document.querySelectorAll('.quote-item');
let currentQuote = 0;
setInterval(() => {
    quoteItems[currentQuote].classList.remove('active');
    currentQuote = (currentQuote + 1) % quoteItems.length;
    quoteItems[currentQuote].classList.add('active');
}, 4000);

// ============ SCROLL ANIMATIONS ============
const animElements = document.querySelectorAll('[data-animate]');
const poemLines = document.querySelectorAll('.poem-line');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate poem lines
            if (entry.target.classList.contains('poem-container')) {
                poemLines.forEach(line => line.classList.add('animate'));
            }
        }
    });
}, { threshold: 0.3 });

animElements.forEach(el => observer.observe(el));

// ============ VALENTINE'S DAY! ============
// No countdown needed — today is Valentine's Day! 🎉

// ============ HEART BURST ============
function triggerBurst() {
    const overlay = document.getElementById('burstOverlay');
    overlay.classList.add('active');
    const emojis = ['❤️', '💕', '💗', '💖', '💝', '🌹', '♥', '💘', '💓', '💞'];

    for (let i = 0; i < 40; i++) {
        const h = document.createElement('div');
        h.className = 'burst-heart';
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        h.style.left = Math.random() * 100 + 'vw';
        h.style.top = Math.random() * 100 + 'vh';
        h.style.fontSize = (Math.random() * 30 + 16) + 'px';
        h.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
        h.style.animationDelay = (Math.random() * 0.5) + 's';
        overlay.appendChild(h);
    }

    setTimeout(() => {
        overlay.innerHTML = '';
        overlay.classList.remove('active');
    }, 3000);
}

// ============ PRELOAD INITIAL HEARTS ============
for (let i = 0; i < 5; i++) {
    setTimeout(spawnFloatingHeart, i * 400);
}

