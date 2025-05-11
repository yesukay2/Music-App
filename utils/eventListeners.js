import {
  mobileMenuBtn,
  closeBtn,
  overlay,
  volumeSlider,
  themeToggle,
  playPauseBtn,
  prevBtn,
  nextBtn,
  progressBar,
  navLinks,
  searchInput,
  createPlaylistBtn,
  playlistList,
} from "./domSelectors.js";
import { toggleSidebar, toggleTheme } from "./ui.js";
import { togglePlayPause, playNext, playPrevious } from "./audioPlayer.js";
import { handleNavigation, handleSearch } from "./navigation.js";
import { createNewPlaylist } from "./playlistService.js";
import { state } from "./state.js";

export const setupEventListeners = () => {
  mobileMenuBtn.addEventListener("click", toggleSidebar);
  closeBtn.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);
  navLinks.forEach((link) => link.addEventListener("click", toggleSidebar));
  playlistList.addEventListener("click", toggleSidebar);

  volumeSlider.addEventListener("input", (e) => {
    console.log(`Volume: ${e.target.value}`, state?.currentAudio);
    if (state?.currentAudio) state.currentAudio.volume = e.target.value / 100;
  });

  themeToggle.addEventListener("click", toggleTheme);

  playPauseBtn.addEventListener("click", togglePlayPause);
  prevBtn.addEventListener("click", playPrevious);
  nextBtn.addEventListener("click", playNext);

  progressBar.addEventListener("input", (e) => {
    const audio = window.state?.currentAudio;
    if (audio) audio.currentTime = (audio.duration * e.target.value) / 100;
  });

  navLinks.forEach((link) => link.addEventListener("click", handleNavigation));
  searchInput.addEventListener("input", handleSearch);
  createPlaylistBtn.addEventListener("click", createNewPlaylist);
};
