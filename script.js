function openWindow(windowName, triggeringElement) {
    const mainInterface = document.getElementById('mainInterface');
    const targetWindow = document.getElementById(`window-${windowName}`);
    const targetBox = targetWindow.querySelector('.window-box');

    // Calculate Origin
    if (triggeringElement) {
        const rect = triggeringElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = centerX - window.innerWidth / 2;
        const deltaY = centerY - window.innerHeight / 2;

        targetBox.style.setProperty('--start-x', `${deltaX}px`);
        targetBox.style.setProperty('--start-y', `${deltaY}px`);
        targetBox.style.setProperty('--start-scale', '0.1');
    }

    mainInterface.classList.add('hidden');
    targetWindow.classList.add('active');
}

function closeWindow(windowName) {
    const mainInterface = document.getElementById('mainInterface');
    const targetWindow = document.getElementById(`window-${windowName}`);

    targetWindow.classList.remove('active');

    setTimeout(() => {
        mainInterface.classList.remove('hidden');
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('hero-title');
    const text = title.textContent;
    title.innerHTML = '';

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

    const subtitle = document.querySelector('.subtitle');
    const subtitleText = subtitle.textContent;
    subtitle.textContent = '';

    let charIndex = 0;
    function typeWriter() {
        if (charIndex < subtitleText.length) {
            subtitle.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }

    setTimeout(typeWriter, 1000);

    const chars = document.querySelectorAll('.hero-section h1 .char');
    const bgEffects = document.querySelector('.background-effects');
    const mouseLight = document.getElementById('mouse-light');
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
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

    for (let i = 0; i < 4; i++) {
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        star.style.top = `${Math.random() * 50}%`;
        star.style.left = `${Math.random() * 80}%`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 7}s`);
        star.style.animationDelay = `${Math.random() * 10}s`;
        particlesContainer.appendChild(star);
    }

    // Hero Title Shatter Effect (Glass Break Style)
    chars.forEach(char => {
        if (char.classList.contains('space')) return;

        char.style.cursor = 'pointer';

        char.addEventListener('click', (e) => {
            if (char.classList.contains('shattering')) return;

            // Start Shatter
            char.classList.add('shattering');

            // INSTANT disappearance to simulate breaking
            char.style.opacity = '0';
            char.style.transform = 'scale(0.9)'; // Minor shrink just in case

            const rect = char.getBoundingClientRect();
            // More shards for glass effect
            const shardCount = 15;
            const shards = [];

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            for (let i = 0; i < shardCount; i++) {
                const shard = document.createElement('div');
                shard.classList.add('letter-shard');
                document.body.appendChild(shard);

                // Irregular jagged shapes using clip-path to look like glass
                const size = Math.random() * 8 + 4;
                shard.style.width = `${size}px`;
                shard.style.height = `${size}px`;
                shard.style.background = 'white';
                // Random triangle/polygon clip
                const p1 = Math.floor(Math.random() * 100);
                const p2 = Math.floor(Math.random() * 100);
                const p3 = Math.floor(Math.random() * 100);
                shard.style.clipPath = `polygon(${p1}% 0%, 100% ${p2}%, ${p3}% 100%, 0% ${Math.random() * 100}%)`;

                // Start AT the letter position
                // Spread starting pos slightly to cover the letter area
                const spreadX = (Math.random() - 0.5) * rect.width;
                const spreadY = (Math.random() - 0.5) * rect.height;

                shard.style.left = `${centerX + spreadX}px`;
                shard.style.top = `${centerY + spreadY}px`;

                // Glass explosion physics
                const angle = Math.random() * Math.PI * 2;
                // Variable distance - some fly far, some stay close
                const distance = Math.random() * 150 + 50;
                const destX = Math.cos(angle) * distance;
                const destY = Math.sin(angle) * distance;
                const rot = (Math.random() - 0.5) * 1000; // High rotation

                // Animate Out (Explode & Fade)
                shard.animate([
                    { transform: `translate(-50%, -50%) rotate(0deg) scale(1)`, opacity: 1 },
                    { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${rot}deg) scale(0.5)`, opacity: 0 }
                ], {
                    duration: 800 + Math.random() * 400, // Varying duration
                    easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)', // Explosive pop then slow
                    fill: 'forwards'
                }).onfinish = () => shard.remove();
            }

            // Restore Character logic
            // Wait for shards to disappear
            setTimeout(() => {
                // Smoothly fade original character back in
                char.style.transition = 'opacity 0.5s ease-in, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                char.style.opacity = '1';
                char.style.transform = 'scale(1)';

                setTimeout(() => {
                    char.classList.remove('shattering');
                    char.style.transition = '';
                }, 500);

            }, 1000); // 1s delay
        });
    });

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

        mouseLight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

        const moveX = (mouseX - window.innerWidth / 2) * -0.01;
        const moveY = (mouseY - window.innerHeight / 2) * -0.01;
        bgEffects.style.transform = `translate(${moveX}px, ${moveY}px)`;

        if (document.querySelector('.window-overlay.active')) {
            chars.forEach(char => {
                if (char.style.transform !== '') {
                    char.style.transform = '';
                    char.style.zIndex = '';
                }
            });
            return;
        }

        chars.forEach(char => {
            if (char.classList.contains('shattering')) return;

            const rect = char.getBoundingClientRect();
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
            const maxDist = 150;

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

    function updateClock() {
        const clockElement = document.getElementById('clock');
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

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

    const menuTiles = document.querySelectorAll('.menu-tile');

    menuTiles.forEach(tile => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        tile.addEventListener('mouseleave', () => {
            tile.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

});
