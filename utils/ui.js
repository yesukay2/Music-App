import {
  sidebar,
  overlay,
  themeToggle,
  body,
  playlistList,
  mobileMenuBtn,
} from "./domSelectors.js";
import { state } from "./state.js";
import { togglePlayPause, playSong } from "./audioPlayer.js";
import { showPlaylistSelection } from "./playlistService.js";
import { addToPlaylist } from "./playlistService.js";
import { getRandomColor } from "./utils.js";

export const showLoading = () => {
  document.querySelector(".loading-overlay").style.display = "flex";
};

export const hideLoading = () => {
  document.querySelector(".loading-overlay").style.display = "none";
};

export const showError = (msg) => {
  const el = document.querySelector(".error-message");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 5000);
};

export const updatePlayButtons = () => {
  const cards = document.querySelectorAll(".music-card");

  cards.forEach((card) => {
    const icon = card.querySelector(".play-btn i");
    const audioSrc = state.currentAudio?.src;
    const isCurrent = card.innerHTML.includes(audioSrc); // rough check

    icon.classList.remove("fa-play", "fa-pause");

    if (isCurrent && state.isPlaying) {
      icon.classList.add("fa-pause");
    } else {
      icon.classList.add("fa-play");
    }
  });
};

export const updatePlayButton = (playing, index = null) => {
  const cards = document.querySelectorAll(".music-card");

  cards.forEach((card, i) => {
    const icon = card.querySelector(".play-btn i");

    if (index !== null && i === index) {
      icon.classList.toggle("fa-play", !playing);
      icon.classList.toggle("fa-pause", playing);
    } else {
      icon.classList.remove("fa-pause");
      icon.classList.add("fa-play");
    }
  });
};

export const updateCurrentTrackInfo = (song) => {
  const ctr = document.querySelector(".current-track");
  ctr.querySelector("img").src = song.cover || "./assets/default-cover.png";
  ctr.querySelector("h4").textContent = song.title;
  ctr.querySelector("p").textContent = song.artist;
};

export const updateProgress = () => {
  const audio = state.currentAudio;
  if (!audio) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  document.querySelector(".progress-bar").value = percent;
  document.querySelectorAll(".time").forEach((el, i) => {
    el.textContent =
      i === 0 ? formatTime(audio.currentTime) : formatTime(audio.duration);
  });
};

export const updateRecentNavIndicator = () => {
  const link = document.querySelector(".nav-menu a:nth-child(4)");
  link?.classList.toggle("has-recents", state.recents.length > 0);
};

export const renderMusicCards = (songs, context = state.currentContext) => {
  state.currentContext = context;
  const grid = document.querySelector(".grid-container");
  grid.innerHTML = "";

  songs.forEach((song) => {
    //   const isCurrent = state.currentAudio?.src === song.mp3;
    const isCurrent = state.currentAudio?.src.includes(song.mp3);
    const card = document.createElement("div");
    card.className = "music-card";
    card.innerHTML = `
      <div class="album-art">
        <img src="${song.cover}" alt="${song.title} cover" />
        <button class="play-btn">
          <i class="fas ${
            isCurrent ? (state.isPlaying ? "fa-pause" : "fa-play") : "fa-play"
          }"></i>
        </button>
      </div>
      <div class="song-info">
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
        <span class="duration">${song.formattedDuration}</span>
        <button class="add-to-playlist"><i class="fas fa-plus"></i></button>
      </div>
    `;
    card.querySelector(".play-btn").addEventListener("click", () => {
      if (isCurrent) togglePlayPause();
      else playSong(song, context);
    });

    card
      .querySelector(".add-to-playlist")
      .addEventListener("click", async (e) => {
        e.stopPropagation();
        const pl = await showPlaylistSelection();
        if (pl) addToPlaylist(pl.id, song);
      });
    grid.appendChild(card);
  });
};

export const renderPlaylists = () => {
  playlistList.innerHTML = state.playlists
    .map(
      (pl) => `
      <div class="playlist-item ${
        state.currentPlaylist?.id === pl.id ? "active" : ""
      }" data-id="${pl.id}">
        <div class="playlist-color" style="background: ${getRandomColor()}"></div>
        <span>${pl.name} (${pl.songs.length})</span>
        <div class="playlist-actions">
          <button class="play-playlist"><i class="fas fa-play"></i></button>
          <button class="add-song-btn">+</button>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll(".playlist-item").forEach((item) => {
    item.addEventListener("click", () => {
      const pl = state.playlists.find((p) => p.id === +item.dataset.id);
      state.currentPlaylist = pl;
      renderMusicCards(pl.songs, { type: "playlist", data: pl });
      document
        .querySelectorAll(".playlist-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  document.querySelectorAll(".play-playlist").forEach((btn, i) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const pl = state.playlists[i];
      if (pl.songs.length)
        playSong(pl.songs[0], { type: "playlist", data: pl }, pl);
    });
  });
};

export const toggleSidebar = () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  mobileMenuBtn.style.display = sidebar.classList.contains("active")
    ? "none"
    : "block";
};

// export function closeMobileNav() {
//   const nav = document.querySelector(".nav");
//   const hamburger = document.querySelector(".hamburger");
//   nav.classList.remove("nav-open");
//   hamburger.classList.remove("active");
// }

export const toggleTheme = () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem(
    "theme",
    body.classList.contains("dark-mode") ? "dark" : "light"
  );
  themeToggle.querySelector("i").classList.toggle("fa-moon");
  themeToggle.querySelector("i").classList.toggle("fa-sun");
};
