let Tesseract;

async function loadTesseract() {
    if (typeof window.Tesseract === 'undefined') {
        console.log('Loading Tesseract...');
        await
        import ('https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js');
        Tesseract = window.Tesseract;
        console.log('Tesseract loaded successfully');
    }
}

let worker = null;

async function initializeTesseract() {
    if (!Tesseract) {
        await loadTesseract();
    }

    if (!worker) {
        console.log('Initializing Tesseract worker...');
        worker = await Tesseract.createWorker({
            logger: m => console.log('Tesseract:', m)
        });
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?',
        });
        console.log('Tesseract worker initialized');
    }
}

async function terminateTesseract() {
    if (worker) {
        await worker.terminate();
        worker = null;
        console.log('Tesseract worker terminated');
    }
}

function preprocessImage(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const newValue = avg > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = newValue;
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

async function performOCR(videoElement) {
    if (!worker) {
        await initializeTesseract();
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const processedCanvas = preprocessImage(canvas);

    try {
        const {
            data: {
                text
            }
        } = await worker.recognize(processedCanvas);
        return text;
    } catch (error) {
        console.error('OCR Error:', error);
        return '';
    }
}

function filterText(text) {
    const words = text.split(/\s+/);
    const filteredWords = words.filter(word => word.length > 1 && /[a-zA-Z0-9]/.test(word));
    return filteredWords.join(' ');
}

function checkForBannedWords(text) {
    const bannedWords = ['omegle', 'www', 'fm', '3193IMOWaINYAT', '3193MOW3INYAT'];
    const lowerCaseText = text.toLowerCase();
    const words = lowerCaseText.split(/\s+/);

    return bannedWords.some(bannedWord => words.includes(bannedWord));
}

async function integrateOCRChecks(videoElement, ws) {
    try {
        await initializeTesseract();

        let ocrInterval;
        let violationCount = 0;

        ocrInterval = setInterval(async () => {
            if (videoElement.readyState === 4) {
                const ocrText = await performOCR(videoElement);
                const filteredText = filterText(ocrText);
                console.log('Detected text:', filteredText);
                const hasBannedWords = checkForBannedWords(filteredText);

                if (hasBannedWords) {
                    violationCount++;
                    console.log(`Violation detected. Count: ${violationCount}`);

                    if (violationCount >= 3) {
                        clearInterval(ocrInterval);
                        await terminateTesseract();
                        ws.emit('ban', {
                            reason: 'Detected banned content in video.'
                        });
                        alert('You have been banned for using banned content.');
                    }
                } else {
                    violationCount = Math.max(0, violationCount - 1);
                }
            }
        }, 3000);

        return async () => {
            clearInterval(ocrInterval);
            await terminateTesseract();
        };
    } catch (error) {
        console.error('Failed to initialize OCR checks:', error);
        return () => {};
    }
}

export {
    integrateOCRChecks
};