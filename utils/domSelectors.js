export const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
export const sidebar = document.querySelector(".sidebar");
export const overlay = document.querySelector(".sidebar-overlay");
export const closeBtn = document.querySelector(".close-sidebar-btn");
export const volumeSlider = document.querySelector(".volume-slider");
export const themeToggle = document.querySelector(".theme-toggle");
export const body = document.body;
export const progressBar = document.querySelector(".progress-bar");
export const playPauseBtn = document.querySelector(".control-btn.play");
export const prevBtn = document.querySelector(".prev");
export const nextBtn = document.querySelector(".next");
export const searchInput = document.querySelector(".search-bar input");
export const playlistList = document.querySelector(".playlist-list");
export const createPlaylistBtn = document.querySelector(".create-playlist");
export const navLinks = document.querySelectorAll(".nav-menu a");

// overlays
export const loadingOverlay = (() => {
  const el = document.createElement("div");
  el.className = "loading-overlay";
  el.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  document.body.appendChild(el);
  return el;
})();
export const errorMessage = (() => {
  const el = document.createElement("div");
  el.className = "error-message";
  document.body.appendChild(el);
  return el;
})();
