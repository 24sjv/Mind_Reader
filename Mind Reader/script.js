// ========== Background Animation ==========
const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
let particles = [];

class Particle {
    constructor(x, y, explode = false) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = explode ? (Math.random() - 0.5) * 10 : 0;
        this.speedY = explode ? (Math.random() - 0.5) * 10 : 0;
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;
        this.size *= 0.97;
    }

    draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create initial particles
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(25, 25, 60, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.opacity <= 0) particles.splice(index, 1);
    });

    requestAnimationFrame(animate);
}

// Initialize background
initParticles();
animate();
window.addEventListener('resize', initParticles);

// ========== Start Button Animation ==========
document.getElementById('startButton').addEventListener('click', function() {
    // Create explosion particles
    const rect = this.getBoundingClientRect();
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
            rect.left + rect.width/2,
            rect.top + rect.height/2,
            true
        ));
    }
    
    this.style.transform = 'scale(0)';
    setTimeout(() => {
        document.getElementById('startButtonContainer').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
    }, 500);
});

// ========== Read My Mind Button ==========
document.getElementById('readMindButton').addEventListener('click', function() {
    const number = document.getElementById('numberInput').value;
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const backToStartButton = document.getElementById('backToStartButton');
    const messages = [
        "Analyzing thoughts...",
        "Decoding memories...",
        "Scanning brainwaves..."
    ];

    // Check if input is a valid number
    if (!number || isNaN(number) || number < 1 || number > 15) {
        showPopup("Please enter a valid numerical value between 1 and 15");
        return;
    }

    // Hide the result and back button initially
    result.style.display = 'none';
    backToStartButton.style.display = 'none';

    // Show loading messages
    loading.style.display = 'block';
    let counter = 0;
    
    const interval = setInterval(() => {
        loading.textContent = messages[counter % messages.length];
        counter++;
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        loading.style.display = 'none';
        result.textContent = `You're thinking of this number: ${number}`;
        result.style.display = 'block'; // Show the result
        backToStartButton.style.display = 'block'; // Show the back button
    }, 4000);
});

// ========== Back to Start Button ==========
document.getElementById('backToStartButton').addEventListener('click', function() {
    // Create explosion particles
    const rect = this.getBoundingClientRect();
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
            rect.left + rect.width/2,
            rect.top + rect.height/2,
            true
        ));
    }
    
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('startButtonContainer').style.display = 'block';
    document.getElementById('startButton').style.transform = 'scale(1)';
    document.getElementById('numberInput').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('loading').style.display = 'none';
});

// ========== Popup for Invalid Input ==========
function showPopup(message) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.innerHTML = `
        <div id="popupContent">
            <p>${message}</p>
            <button id="closePopup">OK</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Blur the background
    document.getElementById('content').style.filter = 'blur(5px)';

    // Close popup on button click
    document.getElementById('closePopup').addEventListener('click', function() {
        document.body.removeChild(popup);
        document.getElementById('content').style.filter = 'none';
    });
}