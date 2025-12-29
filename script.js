function openWindow(windowName) {
    const mainInterface = document.getElementById('mainInterface');
    const targetWindow = document.getElementById(`window-${windowName}`);

    // Animate Main Interface Out
    mainInterface.classList.add('hidden');

    // Animate Window In
    setTimeout(() => {
        targetWindow.classList.add('active');
    }, 200);
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

    const chars = document.querySelectorAll('.hero-section h1 .char');

    document.addEventListener('mousemove', (e) => {
        // Prevent animation if a window is open
        if (document.querySelector('.window-overlay.active')) {
            chars.forEach(char => {
                char.style.transform = 'translate(0, 0) scale(1)';
                char.style.zIndex = 1;
            });
            return;
        }

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        chars.forEach(char => {
            const rect = char.getBoundingClientRect();
            const charX = rect.left + rect.width / 2;
            const charY = rect.top + rect.height / 2;

            const diffX = charX - mouseX;
            const diffY = charY - mouseY;
            const dist = Math.sqrt(diffX * diffX + diffY * diffY);
            const maxDist = 200;

            if (dist < maxDist) {
                // Spherizing intensity
                const intensity = Math.sin((1 - dist / maxDist) * Math.PI / 2);

                const scale = 1 + (intensity * 0.2); // Set to 1.2x maximum scale
                const translateX = diffX * intensity * 0.15;
                const translateY = diffY * intensity * 0.15;

                char.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                char.style.zIndex = 100;
            } else {
                char.style.transform = 'translate(0, 0) scale(1)';
                char.style.zIndex = 1;
            }
        });
    });
});
