
(function() {
    const waveInner = document.getElementById('wave_top_inner');
    if (!waveInner) return;
    const svg = waveInner.querySelector('svg');
    if (!svg) return;

    let offset = 0;
    const speedFractionPerSecond = 0.2; // fraction of container width moved per second
    let lastTs = null;

    function getContainerWidth() {
        // Use the actual rendered width of the container for wrapping
        return waveInner.offsetWidth / 2; // two SVGs side by side
    }

    function animate(ts) {
        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000; // seconds
        lastTs = ts;

        const containerWidth = getContainerWidth();
        const movement = speedFractionPerSecond * containerWidth * dt;
        offset += movement;

        // Modular arithmetic for perfect wrapping
        offset = ((offset % containerWidth) + containerWidth) % containerWidth;
        waveInner.style.transform = `translateX(${-offset}px)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();


(function() {
    const waveInner = document.getElementById('wave_bottom_inner');
    if (!waveInner) return;
    const svg = waveInner.querySelector('svg');
    if (!svg) return;

    let offset = 0;
    const speedFractionPerSecond = 0.2; // same fraction as top wave
    let lastTs = null;

    function getContainerWidth() {
        return waveInner.offsetWidth / 2; // two SVGs side by side
    }

    function animate(ts) {
        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;

        const containerWidth = getContainerWidth();
        const movement = speedFractionPerSecond * containerWidth * dt;
        offset += movement;

        offset = ((offset % containerWidth) + containerWidth) % containerWidth;
        waveInner.style.transform = `translateX(${-offset}px)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();