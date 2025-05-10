// // DOM Elements
// const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
// const sidebar = document.querySelector(".sidebar");
// const overlay = document.querySelector(".sidebar-overlay");
// const closeBtn = document.querySelector(".close-sidebar-btn");
// const volumeSlider = document.querySelector(".volume-slider");
// const themeToggle = document.querySelector(".theme-toggle");
// const body = document.body;
// const progressBar = document.querySelector(".progress-bar");
// const playPauseBtn = document.querySelector(".control-btn.play");
// const prevBtn = document.querySelector(".prev");
// const nextBtn = document.querySelector(".next");
// const searchInput = document.querySelector(".search-bar input");
// const loadingOverlay = document.createElement("div");
// const errorMessage = document.createElement("div");
// const playlistList = document.querySelector(".playlist-list");
// const createPlaylistBtn = document.querySelector(".create-playlist");
// const navLinks = document.querySelectorAll(".nav-menu a");

// // Application State
// let currentAudio = null;
// let isPlaying = false;
// let songsData = [];
// let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
// let recents = JSON.parse(localStorage.getItem("recents")) || [];
// let currentContext = { type: "library", data: null };
// let currentTrackIndex = -1;
// let currentPlaylist = null;

// // UI Elements
// loadingOverlay.className = "loading-overlay";
// loadingOverlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
// errorMessage.className = "error-message";
// document.body.appendChild(loadingOverlay);
// document.body.appendChild(errorMessage);

// // Initialize Application
// document.addEventListener("DOMContentLoaded", async () => {
//   await initializeApp();
//   setupEventListeners();
// });

// // Core Functions
// async function initializeApp() {
//   showLoading();
//   try {
//     songsData = await fetchData();
//     updateRecentNavIndicator();
//     renderMusicCards(songsData);
//     renderPlaylists();
//   } catch (error) {
//     showError("Failed to initialize application");
//   } finally {
//     hideLoading();
//   }
// }

// function setupEventListeners() {
//   // Mobile Menu
//   mobileMenuBtn.addEventListener("click", toggleSidebar);
//   closeBtn.addEventListener("click", toggleSidebar);
//   overlay.addEventListener("click", toggleSidebar);

//   // Volume Control
//   volumeSlider.addEventListener("input", handleVolumeChange);

//   // Theme Toggle
//   themeToggle.addEventListener("click", toggleTheme);

//   // Player Controls
//   playPauseBtn.addEventListener("click", togglePlayPause);
//   prevBtn.addEventListener("click", playPrevious);
//   nextBtn.addEventListener("click", playNext);
//   progressBar.addEventListener("input", handleSeek);

//   // Navigation
//   navLinks.forEach((link) => {
//     link.addEventListener("click", handleNavigation);
//   });

//   // Search
//   searchInput.addEventListener("input", handleSearch);

//   // Playlist Creation
//   createPlaylistBtn.addEventListener("click", createNewPlaylist);
// }

// // Music Playback Functions
// // function playSong(song, context = "library", playlist = null) {
// //   showLoading();

// //   try {
// //     // Add to recents
// //     addToRecents(song);

// //     if (currentAudio && currentAudio.src === song.mp3) {
// //       togglePlayPause();
// //       hideLoading();
// //       return;
// //     }

// //     if (currentAudio) {
// //       currentAudio.pause();
// //       currentAudio = null;
// //     }

// //     currentAudio = new Audio(song.mp3);
// //     currentAudio.crossOrigin = "anonymous";
// //     currentPlaylist = playlist; // Set current playlist

// //     currentAudio.volume = volumeSlider.value / 100;
// //     updateCurrentTrackInfo(song);
// //     updatePlayButton(true);

// //     currentAudio
// //       .play()
// //       .then(() => {
// //         isPlaying = true;
// //         hideLoading();
// //       })
// //       .catch((error) => {
// //         showError("Failed to play audio");
// //         hideLoading();
// //       });

// //     currentAudio.addEventListener("timeupdate", updateProgress);
// //     currentAudio.addEventListener("ended", () => handleTrackEnd(playlist));
// //     currentAudio.addEventListener("error", handleAudioError);
// //   } catch (error) {
// //     showError("Error initializing audio player");
// //     hideLoading();
// //   }
// // }

// async function playSong(song, context = "library", playlist = null) {
//   showLoading();

//   try {
//     // Add to recents (store the full song object)
//     addToRecents(song);

//     // Check if same song is already playing
//     if (currentAudio && currentAudio.src === (song.preview || song.mp3)) {
//       togglePlayPause();
//       hideLoading();
//       return;
//     }

//     stopCurrentPlayback();

//     // Use preview URL if available, fallback to mp3
//     const audioUrl = song.preview || song.mp3;
//     currentAudio = new Audio(audioUrl);
//     currentAudio.crossOrigin = "anonymous";
//     currentPlaylist = playlist;

//     currentAudio.volume = volumeSlider.value / 100;
//     updateCurrentTrackInfo(song);
//     updatePlayButton(true);

//     // Setup event listeners before playing
//     setupAudioEventListeners(playlist);

//     currentAudio
//       .play()
//       .then(() => {
//         isPlaying = true;
//         hideLoading();
//       })
//       .catch((error) => {
//         console.error("Playback error:", error);
//         showError("Failed to play audio");
//         hideLoading();
//       });
//   } catch (error) {
//     console.error("PlaySong error:", error);
//     showError("Error playing song");
//     hideLoading();
//   }
// }

// function setupAudioEventListeners(playlist) {
//   if (!currentAudio) return;

//   currentAudio.addEventListener("timeupdate", updateProgress);
//   currentAudio.addEventListener("ended", () => handleTrackEnd(playlist));
//   currentAudio.addEventListener("error", handleAudioError);
// }

// async function fetchSongData(songId) {
//   try {
//     const response = await fetch(`https://api.deezer.com/track/${songId}`);
//     const data = await response.json();
//     return {
//       id: data.id,
//       title: data.title,
//       artist: data.artist.name,
//       cover: data.album.cover_medium,
//       duration: data.duration,
//       preview: data.preview,
//       mp3: data.preview,
//     };
//   } catch (error) {
//     console.error("Failed to fetch song:", error);
//     return null;
//   }
// }
// function togglePlayPause() {
//   if (!currentAudio) return;

//   if (isPlaying) {
//     currentAudio.pause();
//     isPlaying = false;
//   } else {
//     currentAudio
//       .play()
//       .catch((error) => showError("Failed to resume playback"));
//     isPlaying = true;
//   }
//   updatePlayButton(isPlaying);
// }

// function stopCurrentPlayback() {
//   if (currentAudio) {
//     currentAudio.pause();
//     currentAudio.removeEventListener("timeupdate", updateProgress);
//     currentAudio.removeEventListener("ended", handleTrackEnd);
//     currentAudio.removeEventListener("error", handleAudioError);
//     currentAudio = null;
//   }
// }

// function setupAudioEventListeners() {
//   currentAudio.addEventListener("timeupdate", updateProgress);
//   currentAudio.addEventListener("ended", handleTrackEnd);
//   currentAudio.addEventListener("error", handleAudioError);
// }

// // Recent Songs Implementation
// function addToRecents(song) {
//   recents = recents.filter((s) => s.mp3 !== song.mp3);
//   recents.unshift(song);
//   recents = recents.slice(0, 10);
//   localStorage.setItem("recents", JSON.stringify(recents));
//   updateRecentNavIndicator();
// }

// function updateRecentNavIndicator() {
//   const recentLink = document.querySelector(".nav-menu a:nth-child(4)");
//   recentLink?.classList.toggle("has-recents", recents.length > 0);
// }

// // UI Update Functions
// function updatePlayButton(playing) {
//   const icons = document.querySelectorAll(".play-btn i, .control-btn.play i");
//   icons.forEach((icon) => {
//     icon.classList.toggle("fa-play", !playing);
//     icon.classList.toggle("fa-pause", playing);
//   });
// }

// function updateCurrentTrackInfo(song) {
//   const currentTrack = document.querySelector(".current-track");
//   currentTrack.querySelector("img").src =
//     song.cover || "./assets/default-cover.png";
//   currentTrack.querySelector("h4").textContent = song.title;
//   currentTrack.querySelector("p").textContent = song.artist;
// }

// function updateProgress() {
//   if (!currentAudio) return;

//   const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
//   progressBar.value = progress;

//   document.querySelectorAll(".time").forEach((time, index) => {
//     time.textContent = formatTime(
//       index === 0 ? currentAudio.currentTime : currentAudio.duration
//     );
//   });
// }

// // Navigation and Rendering
// function handleNavigation(e) {
//   e.preventDefault();
//   const target = e.target.closest("a");

//   navLinks.forEach((link) => link.classList.remove("active"));
//   target.classList.add("active");

//   switch (target.textContent.trim()) {
//     case "Recent":
//       renderMusicCards(recents, { type: "recents" });
//       break;
//     case "Playlists":
//       renderPlaylists();
//       break;
//     default:
//       renderMusicCards(songsData, { type: "library" });
//   }
// }

// function renderMusicCards(songs, context = currentContext) {
//   currentContext = context;
//   const musicGrid = document.querySelector(".grid-container");
//   musicGrid.innerHTML = "";

//   songs.forEach((song) => {
//     const isCurrentSong = currentAudio?.src === song.mp3;
//     const card = document.createElement("div");
//     card.className = "music-card";
//     card.innerHTML = `
//       <div class="album-art">
//         <img src="${song.cover}" alt="${song.title} cover" />
//         <button class="play-btn">
//           <i class="fas ${
//             isCurrentSong ? (isPlaying ? "fa-pause" : "fa-play") : "fa-play"
//           }"></i>
//         </button>
//       </div>
//       <div class="song-info">
//         <h4>${song.title}</h4>
//         <p>${song.artist}</p>
//         <span class="duration">${song.formattedDuration}</span>
//         <button class="add-to-playlist">
//           <i class="fas fa-plus"></i>
//         </button>
//       </div>
//     `;

//     card.querySelector(".play-btn").addEventListener("click", () => {
//       if (isCurrentSong) {
//         togglePlayPause();
//       } else {
//         playSong(song, currentContext);
//       }
//     });

//     card
//       .querySelector(".add-to-playlist")
//       .addEventListener("click", async (e) => {
//         e.stopPropagation();
//         const selectedPlaylist = await showPlaylistSelection();
//         if (selectedPlaylist) {
//           addToPlaylist(selectedPlaylist.id, song);
//         }
//       });

//     musicGrid.appendChild(card);
//   });
// }

// // Helper Functions
// function formatTime(seconds) {
//   const minutes = Math.floor(seconds / 60);
//   seconds = Math.floor(seconds % 60);
//   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
// }

// function showLoading() {
//   loadingOverlay.style.display = "flex";
// }

// function hideLoading() {
//   loadingOverlay.style.display = "none";
// }

// function showError(message) {
//   errorMessage.textContent = message;
//   errorMessage.style.display = "block";
//   setTimeout(() => {
//     errorMessage.style.display = "none";
//   }, 5000);
// }

// // Data Management
// async function fetchData() {
//   try {
//     const response = await fetch("/api/deezer");
//     if (!response.ok) throw new Error("Failed to fetch songs");
//     const data = await response.json();
//     return data.data.map((track) => ({
//       artist: track.artist.name,
//       title: track.title,
//       cover: track.album.cover_medium,
//       duration: track.duration,
//       formattedDuration: formatTime(track.duration),
//       mp3: track.preview,
//     }));
//   } catch (error) {
//     showError("Failed to load songs. Please try again later.");
//     return [];
//   }
// }

// // Player Controls
// function playPrevious() {
//   if (!currentAudio) return;

//   const currentList = getCurrentSongList();
//   const currentIndex = currentList.findIndex(
//     (song) => song.mp3 === currentAudio.src
//   );

//   if (currentIndex > 0) {
//     playSong(currentList[currentIndex - 1], currentContext);
//   }
// }

// function playNext() {
//   if (!currentAudio) return;

//   const currentList = getCurrentSongList();
//   const currentIndex = currentList.findIndex(
//     (song) => song.mp3 === currentAudio.src
//   );

//   if (currentIndex < currentList.length - 1) {
//     playSong(currentList[currentIndex + 1], currentContext);
//   }
// }

// function getCurrentSongList() {
//   switch (currentContext.type) {
//     case "recents":
//       return recents;
//     case "playlist":
//       return currentContext.data?.songs || [];
//     default:
//       return songsData;
//   }
// }

// // Event Handlers
// function handleTrackEnd() {
//   if (currentContext.type === "playlist") {
//     currentContext.data.currentIndex =
//       (currentContext.data.currentIndex + 1) % currentContext.data.songs.length;
//     playSong(
//       currentContext.data.songs[currentContext.data.currentIndex],
//       currentContext
//     );
//   } else {
//     playNext();
//   }
// }

// function handleAudioError() {
//   showError("Error playing audio track");
//   isPlaying = false;
//   updatePlayButton(false);
// }

// function handleSeek(e) {
//   if (!currentAudio) return;
//   const seekTime = (currentAudio.duration * e.target.value) / 100;
//   currentAudio.currentTime = seekTime;
// }

// function handleVolumeChange(e) {
//   if (currentAudio) currentAudio.volume = e.target.value / 100;
// }

// function toggleSidebar() {
//   sidebar.classList.toggle("active");
//   overlay.classList.toggle("active");
//   mobileMenuBtn.style.display = sidebar.classList.contains("active")
//     ? "none"
//     : "block";
// }

// function toggleTheme() {
//   body.classList.toggle("dark-mode");
//   localStorage.setItem(
//     "theme",
//     body.classList.contains("dark-mode") ? "dark" : "light"
//   );
//   themeToggle.querySelector("i").classList.toggle("fa-moon");
//   themeToggle.querySelector("i").classList.toggle("fa-sun");
// }

// // Playlist Management
// function createNewPlaylist() {
//   const playlistName = prompt("Enter playlist name:");
//   if (playlistName) {
//     const newPlaylist = {
//       id: Date.now(),
//       name: playlistName,
//       songs: [],
//       currentIndex: 0,
//     };
//     playlists.push(newPlaylist);
//     localStorage.setItem("playlists", JSON.stringify(playlists));
//     renderPlaylists();
//   }
// }

// function addToPlaylist(playlistId, song) {
//   const playlist = playlists.find((p) => p.id === playlistId);
//   if (playlist) {
//     // Check using ID instead of mp3 URL to avoid duplicate issues
//     if (!playlist.songs.some((s) => s.id === song.id)) {
//       // Store the complete song object with all necessary fields
//       playlist.songs.push({
//         id: song.id,
//         title: song.title,
//         artist: song.artist,
//         cover: song.cover,
//         duration: song.duration,
//         formattedDuration: song.formattedDuration,
//         mp3: song.preview, // Use preview URL as mp3
//         preview: song.preview,
//       });
//       localStorage.setItem("playlists", JSON.stringify(playlists));

//       if (currentPlaylist?.id === playlistId) {
//         renderMusicCards(currentPlaylist.songs);
//       }
//       return true;
//     }
//   }
//   return false;
// }
// // Playlist Rendering
// function renderPlaylists() {
//   playlistList.innerHTML = playlists
//     .map(
//       (playlist) => `
//     <div class="playlist-item ${
//       currentPlaylist?.id === playlist.id ? "active" : ""
//     }"
//          data-id="${playlist.id}">
//       <div class="playlist-color" style="background: ${getRandomColor()}"></div>
//       <span>${playlist.name} (${playlist.songs.length})</span>
//       <div class="playlist-actions">
//         <button class="play-playlist"><i class="fas fa-play"></i></button>
//         <button class="add-song-btn">+</button>
//       </div>
//     </div>
//   `
//     )
//     .join("");

//   // Add event listeners
//   document.querySelectorAll(".playlist-item").forEach((item) => {
//     item.addEventListener("click", (e) => {
//       if (!e.target.closest(".playlist-actions")) {
//         const playlist = playlists.find(
//           (p) => p.id === parseInt(item.dataset.id)
//         );
//         currentPlaylist = playlist;
//         renderMusicCards(playlist.songs);
//         document
//           .querySelectorAll(".playlist-item")
//           .forEach((p) => p.classList.remove("active"));
//         item.classList.add("active");
//       }
//     });
//   });

//   document.querySelectorAll(".play-playlist").forEach((btn, index) => {
//     btn.addEventListener("click", async (e) => {
//       e.stopPropagation();
//       const playlist = playlists[index];
//       if (playlist.songs.length > 0) {
//         // Use the first song in playlist exactly as stored
//         playSong(playlist.songs[0], "playlist", playlist);
//       }
//     });
//   });
// }

// // Modal Functions
// async function showPlaylistSelection() {
//   return new Promise((resolve) => {
//     const modal = document.createElement("div");
//     modal.className = "playlist-selection-modal";
//     modal.innerHTML = `
//       <div class="modal-content">
//         <h3>Select Playlist</h3>
//         <div class="playlist-options"></div>
//         <button class="create-new">Create New Playlist</button>
//         <button class="cancel-btn">Cancel</button>
//       </div>
//     `;

//     const options = modal.querySelector(".playlist-options");
//     playlists.forEach((playlist) => {
//       const btn = document.createElement("button");
//       btn.className = "playlist-option";
//       btn.textContent = `${playlist.name} (${playlist.songs.length} songs)`;
//       btn.addEventListener("click", () => {
//         document.body.removeChild(modal);
//         resolve(playlist);
//       });
//       options.appendChild(btn);
//     });

//     modal.querySelector(".create-new").addEventListener("click", () => {
//       const name = prompt("Enter new playlist name:");
//       if (name) {
//         const playlist = createNewPlaylist(name);
//         document.body.removeChild(modal);
//         resolve(playlist);
//       }
//     });

//     modal.querySelector(".cancel-btn").addEventListener("click", () => {
//       document.body.removeChild(modal);
//       resolve(null);
//     });

//     document.body.appendChild(modal);
//   });
// }

// async function showSongSelection() {
//   return new Promise((resolve) => {
//     const modal = document.createElement("div");
//     modal.className = "song-selection-modal";
//     modal.innerHTML = `
//       <div class="modal-content">
//         <h3>Select a Song</h3>
//         <div class="song-list"></div>
//         <button class="cancel-btn">Cancel</button>
//       </div>
//     `;

//     const songList = modal.querySelector(".song-list");
//     songsData.forEach((song) => {
//       const item = document.createElement("div");
//       item.className = "song-item";
//       item.innerHTML = `
//         <img src="${song.cover}" alt="${song.title}" />
//         <div>
//           <h4>${song.title}</h4>
//           <p>${song.artist}</p>
//         </div>
//       `;
//       item.addEventListener("click", () => {
//         document.body.removeChild(modal);
//         resolve(song);
//       });
//       songList.appendChild(item);
//     });

//     modal.querySelector(".cancel-btn").addEventListener("click", () => {
//       document.body.removeChild(modal);
//       resolve(null);
//     });

//     document.body.appendChild(modal);
//   });
// }

// // Utility Functions
// function getRandomColor() {
//   return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// }

// // Initial theme setup
// if (localStorage.getItem("theme") === "dark") {
//   body.classList.add("dark-mode");
//   themeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
// }

// // Add this function to handle search functionality
// function handleSearch(e) {
//   const searchTerm = e.target.value.toLowerCase().trim();
//   const filteredSongs = songsData.filter(
//     (song) =>
//       song.title.toLowerCase().includes(searchTerm) ||
//       song.artist.toLowerCase().includes(searchTerm)
//   );

//   // Update the current context if we're in library view
//   if (currentContext.type === "library") {
//     renderMusicCards(filteredSongs);
//   }
// }

import "./utils/app";
