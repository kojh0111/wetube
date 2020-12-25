const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const bar = document.getElementById("videoBar");
const progressBar = document.getElementById("progressBar");
const volumeRange = document.getElementById("jsVolume");

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

function update() {
  if (videoPlayer.ended) {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    window.clearInterval(update);
  } else {
    const progressPx = Math.round(
      (videoPlayer.currentTime * bar.offsetWidth) / videoPlayer.duration
    );
    progressBar.style.width = progressPx + "px";
    progressBar.style.height = "100%";
    progressBar.style.backgroundColor = "rgba(14, 73, 181, 0.6)";
  }
}

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    setInterval(update, 500);
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    window.clearInterval(update);
  }
}

function clickedBar(event) {
  if (!videoPlayer.ended) {
    const mouseX = event.pageX - bar.offsetLeft;
    const barSize = bar.offsetWidth;
    const newTime = (mouseX / barSize) * videoPlayer.duration;
    videoPlayer.currentTime = newTime;
    progressBar.style.width = mouseX + "px";
    progressBar.style.height = "100%";
    progressBar.style.backgroundColor = "rgba(14, 73, 181, 0.6)";
  }
}

function keyboardShortcuts(event) {
  const { code } = event;
  if (code === "Space") {
    event.preventDefault();
    handlePlayClick();
  }
}

function hideVolumeRange() {
  volumeRange.style.opacity = 0;
}

function showVolumeRange() {
  volumeRange.style.opacity = 1;
  volumeRange.addEventListener("mouseout", hideVolumeRange);
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    volumeRange.value = videoPlayer.volume;
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function exitFullScrn() {
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScrn);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function goFullScrn() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScrn);
  fullScrnBtn.addEventListener("click", exitFullScrn);
}

function formatDate(totalSeconds) {
  const secondsNumber = parseInt(totalSeconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let seconds = secondsNumber - hours * 3600 - minutes * 60;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

function setCurrentTime() {
  currentTime.innerHTML = formatDate(videoPlayer.currentTime);
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleVolumeRange(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.3) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else if (value >= 0.1) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function init() {
  videoPlayer.volume = 0.5;
  videoPlayer.addEventListener("click", handlePlayClick);
  playBtn.addEventListener("click", handlePlayClick);
  bar.addEventListener("click", clickedBar);
  document.addEventListener("keydown", keyboardShortcuts);
  volumeBtn.addEventListener("click", handleVolumeClick);
  volumeBtn.addEventListener("mouseover", showVolumeRange);
  fullScrnBtn.addEventListener("click", goFullScrn);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("timeupdate", setCurrentTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleVolumeRange);
}

if (videoContainer) {
  init();
}
