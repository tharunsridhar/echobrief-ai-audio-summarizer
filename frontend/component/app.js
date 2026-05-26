const API_ORIGIN = "http://127.0.0.1:8000";
const API_URL = `${API_ORIGIN}/upload`;

const form = document.querySelector("#uploadForm");
const fileInput = document.querySelector("#audioFile");
const fileLabel = document.querySelector("#fileLabel");
const dropZone = document.querySelector("#dropZone");
const submitButton = document.querySelector("#submitButton");
const clearButton = document.querySelector("#clearButton");
const statusBox = document.querySelector("#status");
const results = document.querySelector("#results");
const summaryText = document.querySelector("#summaryText");
const transcriptText = document.querySelector("#transcriptText");
const summaryDownload = document.querySelector("#summaryDownload");
const transcriptDownload = document.querySelector("#transcriptDownload");
const progressPanel = document.querySelector("#progressPanel");
const progressFill = document.querySelector("#progressFill");
const progressLabel = document.querySelector("#progressLabel");
const progressPercent = document.querySelector("#progressPercent");
const elapsedTime = document.querySelector("#elapsedTime");
const progressSteps = document.querySelectorAll(".progress-step");

let progressTimer = null;
let progressStartedAt = 0;
let currentProgress = 0;

const progressStages = [
    { percent: 12, label: "Uploading audio...", step: "upload", afterMs: 0 },
    { percent: 32, label: "Transcribing speech with Whisper...", step: "transcribe", afterMs: 1200 },
    { percent: 68, label: "Generating summary with Gemini...", step: "summarize", afterMs: 7000 },
    { percent: 88, label: "Saving transcript and summary files...", step: "save", afterMs: 13000 }
];

function setStatus(message, type = "") {
    statusBox.textContent = message;
    statusBox.className = `status ${type}`.trim();
}

function setBusy(isBusy) {
    submitButton.disabled = isBusy;
    submitButton.textContent = isBusy ? "Processing..." : "Generate Brief";
    clearButton.disabled = isBusy;
}

function resetResults() {
    results.hidden = true;
    summaryText.textContent = "";
    transcriptText.textContent = "";
    summaryDownload.removeAttribute("href");
    transcriptDownload.removeAttribute("href");
}

function setProgress(percent, label, activeStep) {
    currentProgress = Math.max(currentProgress, percent);
    progressFill.style.width = `${currentProgress}%`;
    progressPercent.textContent = `${Math.round(currentProgress)}%`;
    progressLabel.textContent = label;

    progressSteps.forEach((step) => {
        step.classList.toggle("is-active", step.dataset.step === activeStep);
        step.classList.toggle("is-complete", progressStages.findIndex((stage) => stage.step === step.dataset.step) < progressStages.findIndex((stage) => stage.step === activeStep));
    });
}

function startProgress() {
    stopProgress();
    progressPanel.hidden = false;
    progressStartedAt = Date.now();
    currentProgress = 0;
    setProgress(8, "Preparing upload...", "upload");
    elapsedTime.textContent = "Elapsed: 0s";

    progressTimer = setInterval(() => {
        const elapsedMs = Date.now() - progressStartedAt;
        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        elapsedTime.textContent = `Elapsed: ${elapsedSeconds}s`;

        const stage = [...progressStages].reverse().find((item) => elapsedMs >= item.afterMs);
        if (stage) {
            setProgress(stage.percent, stage.label, stage.step);
        }

        if (currentProgress < 92) {
            setProgress(currentProgress + 1, progressLabel.textContent, stage?.step || "upload");
        }
    }, 1000);
}

function finishProgress() {
    stopProgress();
    progressPanel.hidden = false;
    setProgress(100, "Completed successfully.", "save");
}

function stopProgress() {
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
}

function hideProgress() {
    stopProgress();
    progressPanel.hidden = true;
    currentProgress = 0;
    progressFill.style.width = "0%";
    progressPercent.textContent = "0%";
    progressSteps.forEach((step) => {
        step.classList.remove("is-active", "is-complete");
    });
}

function updateSelectedFile(file) {
    if (!file) {
        fileLabel.textContent = "Choose audio file";
        return;
    }

    fileLabel.textContent = file.name;
}

function validateFile(file) {
    if (!file) {
        return "Select an audio file first.";
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(".mp3") && !name.endsWith(".m4a")) {
        return "Only MP3 and M4A files are supported.";
    }

    return "";
}

fileInput.addEventListener("change", () => {
    resetResults();
    updateSelectedFile(fileInput.files[0]);
    setStatus("");
    hideProgress();
});

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-dragging");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");

    const file = event.dataTransfer.files[0];
    if (!file) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    resetResults();
    updateSelectedFile(file);
    setStatus("");
    hideProgress();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    const validationMessage = validateFile(file);
    if (validationMessage) {
        setStatus(validationMessage, "error");
        return;
    }

    const data = new FormData();
    data.append("file", file);

    setBusy(true);
    resetResults();
    startProgress();
    setStatus("Uploading and processing audio...");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: data
        });

        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.detail || "Upload failed.");
        }

        summaryText.textContent = payload.summary || "No summary returned.";
        transcriptText.textContent = payload.transcription || "No transcript returned.";
        summaryDownload.href = new URL(payload.summary_download_url, API_ORIGIN).href;
        transcriptDownload.href = new URL(payload.transcript_download_url, API_ORIGIN).href;
        summaryDownload.download = `echobrief-${payload.filename}-summary.txt`;
        transcriptDownload.download = `echobrief-${payload.filename}-transcript.txt`;
        results.hidden = false;
        finishProgress();
        setStatus(`EchoBrief finished: ${payload.filename}`, "success");
    } catch (error) {
        stopProgress();
        setStatus(error.message, "error");
    } finally {
        setBusy(false);
    }
});

clearButton.addEventListener("click", () => {
    form.reset();
    updateSelectedFile(null);
    resetResults();
    hideProgress();
    setStatus("");
});

document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
        const target = document.querySelector(`#${button.dataset.copy}`);
        await navigator.clipboard.writeText(target.textContent);
        button.textContent = "Copied";
        setTimeout(() => {
            button.textContent = "Copy";
        }, 1200);
    });
});
