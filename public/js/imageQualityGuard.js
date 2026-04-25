/**
 * Image Quality Guardrail
 * Provides basic brightness and "sharpness" evaluation for evidence photos.
 */
const ImageQualityGuard = {
    /**
     * Analyzes a canvas for brightness and contrast (sharpness heuristic).
     * @param {HTMLCanvasElement} canvas 
     * @returns {Object} result { isGood: boolean, reason: string|null }
     */
    analyze(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let totalBrightness = 0;
        let brightnessSamples = 0;

        // Brightness analysis
        for (let i = 0; i < data.length; i += 20) { // Sample every 5th pixel (skip Alpha)
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Standard luminosity formula
            totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b);
            brightnessSamples++;
        }

        const avgBrightness = totalBrightness / brightnessSamples;

        if (avgBrightness < 40) {
            return { isGood: false, reason: 'Image is too dark. Please use more light.' };
        }
        if (avgBrightness > 230) {
            return { isGood: false, reason: 'Image is too bright/washed out.' };
        }

        // Contrast/Sharpness heuristic (Edge density via average difference)
        let edgeValue = 0;
        for (let i = 0; i < data.length - 4; i += 40) {
            const current = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const next = (data[i + 4] + data[i + 5] + data[i + 6]) / 3;
            edgeValue += Math.abs(current - next);
        }

        const sharpnessMetric = edgeValue / (data.length / 40);
        if (sharpnessMetric < 5) {
            return { isGood: false, reason: 'Image appears blurry. Please hold the camera steady.' };
        }

        return { isGood: true, reason: null };
    }
};

if (typeof module !== 'undefined') {
    module.exports = ImageQualityGuard;
}
