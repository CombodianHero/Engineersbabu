const video = document.getElementById("video");
const yt = document.getElementById("yt-player");
const params = new URLSearchParams(location.search);
const url = params.get("url");

let hls, rotation = 0;

// Load source
if (url.includes("youtube.com")) {
  video.style.display = "none";
  yt.src = `https://www.youtube.com/embed/${url.split("v=")[1]}?controls=0`;
} else {
  yt.style.display = "none";

  if (url.endsWith(".m3u8")) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else {
    video.src = url;
  }
}

// SETTINGS
document.getElementById("settings").onclick = () => {
  const m = document.getElementById("settings-menu");
  m.style.display = m.style.display === "block" ? "none" : "block";
};

// SPEED
document.getElementById("speed").onchange = e =>
  video.playbackRate = parseFloat(e.target.value);

// QUALITY (HLS)
document.getElementById("quality").onchange = e => {
  if (!hls) return;
  const q = e.target.value;
  if (q === "auto") hls.currentLevel = -1;
  else {
    hls.levels.forEach((l, i) => {
      if (l.height == q) hls.currentLevel = i;
    });
  }
};

// FULLSCREEN ROTATION HANDLING
document.getElementById("fullscreen").onclick = () => {
  if (!document.fullscreenElement) {
    document.getElementById("player-container").requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// DOUBLE TAP ROTATE ONLY IN FULLSCREEN
let lastTap = 0;
video.addEventListener("touchend", e => {
  const now = Date.now();
  if (now - lastTap < 300 && document.fullscreenElement) {
    rotation = (rotation + 90) % 360;
    video.style.transform = `rotate(${rotation}deg)`;
  }
  lastTap = now;
});

// RESET ON EXIT FULLSCREEN
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    rotation = 0;
    video.style.transform = "rotate(0deg)";
  }
});
