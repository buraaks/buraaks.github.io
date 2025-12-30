function openWindow(windowName, triggeringElement) {
    const mainInterface = document.getElementById('mainInterface');
    const targetWindow = document.getElementById(`window-${windowName}`);
    const targetBox = targetWindow.querySelector('.window-box');

    // Calculate Origin
    if (triggeringElement) {
        const rect = triggeringElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Window is centered by absolute positioning in overlayflex
        // The overlay is 100vw/100vh. Center is window.innerWidth/2, window.innerHeight/2
        const deltaX = centerX - window.innerWidth / 2;
        const deltaY = centerY - window.innerHeight / 2;

        targetBox.style.setProperty('--start-x', `${deltaX}px`);
        targetBox.style.setProperty('--start-y', `${deltaY}px`);
        targetBox.style.setProperty('--start-scale', '0.1'); // Start very small
    }

    // Animate Main Interface Out
    mainInterface.classList.add('hidden');

    // Animate Window In (Immediate start for overlap effect)
    targetWindow.classList.add('active');
}

function closeWindow(windowName) {
    const mainInterface = document.getElementById('mainInterface');
    const targetWindow = document.getElementById(`window-${windowName}`);

    // Animate Window Out
    targetWindow.classList.remove('active');

    // Animate Main Interface In
    setTimeout(() => {
        mainInterface.classList.remove('hidden');
    }, 300);
}

// Interactive Title Animation
document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('hero-title');
    const text = title.textContent;
    title.innerHTML = ''; // Clear text

    // Split text into spans
    text.split('').forEach(char => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.classList.add('space');
            span.innerHTML = '&nbsp;';
        } else {
            span.classList.add('char');
            span.innerText = char;
        }
        title.appendChild(span);
    });




    // Typewriter Effect for Subtitle
    const subtitle = document.querySelector('.subtitle');
    const subtitleText = subtitle.textContent;
    subtitle.textContent = '';

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < subtitleText.length) {
            subtitle.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50); // Typing speed
        }
    }

    // Start typing after title animation slightly
    setTimeout(typeWriter, 1000);

    const chars = document.querySelectorAll('.hero-section h1 .char');
    const bgEffects = document.querySelector('.background-effects');
    const mouseLight = document.getElementById('mouse-light');

    // Create Background Particles
    const particlesContainer = document.getElementById('particles');
    // PERFORMANCE: Reduced particle count from 80 to 30
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 2;

        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particlesContainer.appendChild(particle);
    }

    // Create Shooting Stars
    for (let i = 0; i < 4; i++) {
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        star.style.top = `${Math.random() * 50}%`;
        star.style.left = `${Math.random() * 80}%`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 7}s`);
        star.style.animationDelay = `${Math.random() * 10}s`;
        particlesContainer.appendChild(star);
    }

    let isAnimationFrameScheduled = false;

    document.addEventListener('mousemove', (e) => {
        if (isAnimationFrameScheduled) return;

        isAnimationFrameScheduled = true;
        requestAnimationFrame(() => {
            handleMouseMove(e);
            isAnimationFrameScheduled = false;
        });
    });

    function handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Mouse light follow
        mouseLight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        // Removed separate left/top updates to rely on transform for better performance

        // Subtle Background Parallax
        const moveX = (mouseX - window.innerWidth / 2) * -0.01; // Reduced intensity
        const moveY = (mouseY - window.innerHeight / 2) * -0.01;
        bgEffects.style.transform = `translate(${moveX}px, ${moveY}px)`;

        // Prevent animation if a window is open
        if (document.querySelector('.window-overlay.active')) {
            // Reset characters if window opens
            chars.forEach(char => {
                if (char.style.transform !== '') {
                    char.style.transform = '';
                    char.style.zIndex = '';
                }
            });
            return;
        }

        chars.forEach(char => {
            const rect = char.getBoundingClientRect();
            // Optimization: Skip calculation if mouse is too far (simple box check first)
            if (Math.abs(rect.left - mouseX) > 200 || Math.abs(rect.top - mouseY) > 200) {
                if (char.style.transform !== '') {
                    char.style.transform = '';
                    char.style.zIndex = '';
                }
                return;
            }

            const charX = rect.left + rect.width / 2;
            const charY = rect.top + rect.height / 2;

            const diffX = charX - mouseX;
            const diffY = charY - mouseY;
            const dist = Math.sqrt(diffX * diffX + diffY * diffY);
            const maxDist = 150; // Reduced radius

            if (dist < maxDist) {
                const intensity = Math.sin((1 - dist / maxDist) * Math.PI / 2);
                const scale = 1 + (intensity * 0.2);
                const translateX = diffX * intensity * 0.15;
                const translateY = diffY * intensity * 0.15;

                char.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                char.style.zIndex = 100;
            } else {
                if (char.style.transform !== '') {
                    char.style.transform = '';
                    char.style.zIndex = '';
                }
            }
        });
    }

    // Handle Clock
    function updateClock() {
        const clockElement = document.getElementById('clock');
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Handle Dynamic Greeting
    function updateGreeting() {
        const greetingElement = document.getElementById('greeting');
        const hour = new Date().getHours();
        let greeting = "Merhaba";

        if (hour >= 5 && hour < 12) greeting = "Günaydın";
        else if (hour >= 12 && hour < 18) greeting = "İyi Günler";
        else if (hour >= 18 && hour < 22) greeting = "İyi Akşamlar";
        else greeting = "İyi Geceler";

        greetingElement.textContent = greeting;
    }

    updateClock();
    updateGreeting();
    setInterval(updateClock, 1000);



});

