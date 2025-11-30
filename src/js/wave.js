(function() {
    const waveInner = document.getElementById('wave_top_inner');
    if (!waveInner) return;
    const svg = waveInner.querySelector('svg');
    if (!svg) return;

    let offset = 0;
    const speedFractionPerSecond = 0.3; // fraction of svg width moved per second (adjust to taste)
    let lastTs = null;

    function getSvgWidth() {
        return svg.clientWidth / 2; // preserve original half-width behaviour
    }

    function animate(ts) {
        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000; // seconds
        lastTs = ts;

        const svgWidth = getSvgWidth();
        const movement = speedFractionPerSecond * svgWidth * dt;
        offset -= movement;

        // wrap offset to keep it within one svg width for smooth looping
        while (Math.abs(offset) >= svgWidth) {
            offset += (offset < 0 ? svgWidth : -svgWidth);
        }

        waveInner.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();

(function() {
    console.log('bottom wave');
    const waveInner = document.getElementById('wave_bottom_inner');
    if (!waveInner) return;
    const svg = waveInner.querySelector('svg');
    if (!svg) return;

    let offset = 0;
    const speedFractionPerSecond = 0.3; // same fraction as top wave
    let lastTs = null;

    function getSvgWidth() {
        return svg.clientWidth / 2; // preserve original full-width behaviour
    }

    function animate(ts) {
        if (!lastTs) lastTs = ts;
        const dt = (ts - lastTs) / 1000;
        lastTs = ts;

        const svgWidth = getSvgWidth();
        const movement = speedFractionPerSecond * svgWidth * dt;
        offset -= movement;

        while (Math.abs(offset) >= svgWidth) {
            offset += (offset < 0 ? svgWidth : -svgWidth);
        }

        waveInner.style.transform = `translateX(${offset}px)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();