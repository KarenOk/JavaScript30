// Select elements 
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const toggle = player.querySelector(".toggle");
const ranges = player.querySelectorAll(".player__slider");
const skipButtons = player.querySelectorAll("[data-skip]");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const fullScreenBtn = player.querySelector(".fullscreen");

// Functions
function togglePause(e) {
    if (e.type === "keyup" && e.keyCode !== 32) return;
    video[video.paused ? "play" : "pause"]();
}

function changeButton(e) {
    toggle.textContent = video.paused ? "►" : "❚ ❚";
}

function handleRange(e) {
    video[this.name] = this.value;
}

function handleSkip(e) {
    video.currentTime += parseFloat(this.dataset.skip);
    handleProgressBar();
}

function handleProgress(e) {
    video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
    handleProgressBar();
}

function handleProgressBar() {
    let flexBasis = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = flexBasis + "%";
}

function handleFullscreen(){
    if (video.requestFullscreen){
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
}

// Add event listeners
document.addEventListener("keyup", togglePause);
toggle.addEventListener("click", togglePause);
video.addEventListener("click", togglePause);
video.addEventListener("play", changeButton);
video.addEventListener("pause", changeButton);

let progressDrag = false;
progress.addEventListener("mouseleave", () => progressDrag = false);
progress.addEventListener("mouseup", () => progressDrag = false);
progress.addEventListener("mousedown", () => progressDrag = true);
progress.addEventListener("mousemove", (e) => progressDrag && handleProgress(e));
progress.addEventListener("click", handleProgress);
video.addEventListener("timeupdate", handleProgressBar);

ranges.forEach(range => {
    range.addEventListener("change", handleRange);
    range.addEventListener("mousemove", handleRange);
});


skipButtons.forEach(button => {
    button.addEventListener("click", handleSkip);
});

// TO-DO: fullscreen
fullScreenBtn.addEventListener("click", handleFullscreen );
