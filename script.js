(function() {
  'use strict';

  // --- LOADING OVERLAY CONTROLS ---
  const loadingOverlay = document.getElementById("loadingOverlay");

  function showLoader() {
    loadingOverlay.classList.remove("hidden");
  }

  function hideLoader() {
    loadingOverlay.classList.add("hidden");
  }

  window.addEventListener("load", hideLoader);

  function initWinampPlayer() {
    const playlist = [
      { id: 1, title: "1. The Darling Riots - Riot Act.mp3", duration: 168 },
      { id: 2, title: "2. The Darling Riots - Cyber Street.mp3", duration: 142 },
      { id: 3, title: "3. The Darling Riots - Distortion 2006.mp3", duration: 195 }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;
    let trackTimerInterval = null;
    let elapsedSeconds = 0;

    // DOM Elements
    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const trackTitleDisplay = document.getElementById("trackTitle");
    const timerDisplay = document.getElementById("audioTimer");
    const playStatusDisplay = document.getElementById("playStatus");
    const progressBar = document.getElementById("progressBar");
    const progressContainer = document.getElementById("progressContainer");
    const bandLogo = document.getElementById("bandLogo");

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }

    function updatePlayerUI() {
      const currentTrack = playlist[currentTrackIndex];
      trackTitleDisplay.textContent = currentTrack.title;

      // Calculate progress percentage
      const percent = (elapsedSeconds / currentTrack.duration) * 100;
      progressBar.style.width = `${percent}%`;
      timerDisplay.textContent = formatTime(elapsedSeconds);
    }

    function startTimer() {
      clearInterval(trackTimerInterval);
      trackTimerInterval = setInterval(() => {
        const currentTrack = playlist[currentTrackIndex];
        if (elapsedSeconds < currentTrack.duration) {
          elapsedSeconds++;
          updatePlayerUI();

          // DYNAMIC BEAT REACTIVITY: Pulse the main chrome headline shadow on intervals
          if (elapsedSeconds % 2 === 0) {
            bandLogo.style.transform = "scale(1.02)";
            bandLogo.style.filter = "drop-shadow(6px 6px 0px #00ff66)";
          } else {
            bandLogo.style.transform = "scale(1)";
            bandLogo.style.filter = "drop-shadow(4px 4px 0px #ff0055)";
          }
        } else {
          handleNextTrack();
        }
      }, 1000);
    }

    function handlePlay() {
      isPlaying = true;
      playStatusDisplay.textContent = "PLAYING";
      playStatusDisplay.style.color = "#00ff66";
      playBtn.classList.add("active-green");
      pauseBtn.classList.remove("active-green");
      startTimer();
    }

    function handlePause() {
      isPlaying = false;
      playStatusDisplay.textContent = "PAUSE";
      playStatusDisplay.style.color = "#ff0055";
      pauseBtn.classList.add("active-green");
      playBtn.classList.remove("active-green");
      clearInterval(trackTimerInterval);
      bandLogo.style.transform = "scale(1)";
    }

    function handleNextTrack() {
      elapsedSeconds = 0;
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      updatePlayerUI();
      if (isPlaying) startTimer();
    }

    function handlePrevTrack() {
      elapsedSeconds = 0;
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      updatePlayerUI();
      if (isPlaying) startTimer();
    }

    // Progress Container Click simulation
    progressContainer.addEventListener("click", function(e) {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const currentTrack = playlist[currentTrackIndex];
      const clickRatio = clickX / width;

      elapsedSeconds = Math.floor(clickRatio * currentTrack.duration);
      updatePlayerUI();
    });

    // Wire Up Control Listeners
    playBtn.addEventListener("click", handlePlay);
    pauseBtn.addEventListener("click", handlePause);
    nextBtn.addEventListener("click", handleNextTrack);
    prevBtn.addEventListener("click", handlePrevTrack);

    // Run Initial Layout State Update
    updatePlayerUI();
  }

  document.addEventListener("DOMContentLoaded", function() {

    // --- LOGO CLICK-TO-REFRESH ---
    const headerLogo = document.getElementById("bandLogo");
    if (headerLogo) {
      headerLogo.addEventListener("click", function() {
        location.reload();
      });
    }

    // --- SQUAD FLYER NEWSLETTER SIGNUP (spinner while "submitting", only on the home page) ---
    const flyerForm = document.getElementById("flyerForm");
    if (flyerForm) {
      flyerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        showLoader();
        setTimeout(function() {
          hideLoader();
          alert("RIOT SQUAD REGISTERED.");
        }, 900);
      });
    }

    // --- WINAMP AUDIO PLAYER CORE ENGINE (only present on the home page) ---
    if (document.getElementById("playBtn")) {
      initWinampPlayer();
    }

    // --- BAND INTRO TICKET MEMO ---
    const ticketTab = document.getElementById("ticketTab");
    const ticketPanel = document.getElementById("ticketPanel");
    const ticketClose = document.getElementById("ticketClose");

    if (ticketTab && ticketPanel) {
      function toggleTicket() {
        const isOpen = ticketPanel.classList.toggle("open");
        ticketTab.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }

      function closeTicket() {
        ticketPanel.classList.remove("open");
        ticketTab.setAttribute("aria-expanded", "false");
      }

      ticketTab.addEventListener("click", toggleTicket);
      if (ticketClose) {
        ticketClose.addEventListener("click", closeTicket);
      }
    }

    // --- PHOTO GALLERY (rendered from the photos/captions in gallery-data.js) ---
    const photoGallery = document.getElementById("photoGallery");
    if (photoGallery && typeof galleryPhotos !== "undefined") {
      galleryPhotos.forEach(photo => {
        const frame = document.createElement("div");
        frame.className = "gallery-frame";

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.caption || "";
        img.className = "gallery-photo";
        frame.appendChild(img);

        if (photo.caption) {
          const caption = document.createElement("p");
          caption.className = "gallery-caption";
          caption.textContent = photo.caption;
          frame.appendChild(caption);
        }

        photoGallery.appendChild(frame);
      });

      const addSlot = document.createElement("div");
      addSlot.className = "gallery-frame gallery-empty";
      addSlot.innerHTML = '<span class="gallery-empty-label">+ ADD PHOTO</span>';
      photoGallery.appendChild(addSlot);
    }

    // --- INTERACTIVE 3D JEWEL CASES MOUSE TRACKING (present on both pages) ---
    const cases = document.querySelectorAll(".jewel-case");

    cases.forEach(item => {
      item.addEventListener("mousemove", function(e) {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize coordinates from -0.5 to 0.5
        const normalizeX = (x / rect.width) - 0.5;
        const normalizeY = (y / rect.height) - 0.5;

        // Calculate tilt angles (Max 10 degrees)
        const rotateY = normalizeX * 12;
        const rotateX = -normalizeY * 12;

        item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

        // Intesify the plastic glare depending on mouse placement
        const shine = item.querySelector(".plastic-shine");
        if (shine) {
          shine.style.background = `linear-gradient(${135 + (normalizeX * 40)}deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.06) 51%, rgba(255,255,255,0) 100%)`;
        }
      });

      item.addEventListener("mouseleave", function() {
        item.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        const shine = item.querySelector(".plastic-shine");
        if (shine) {
          shine.style.background = `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.06) 46%, rgba(255,255,255,0) 100%)`;
        }
      });
    });
  });
})();
