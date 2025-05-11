import { state } from "./state.js";
import {
  showLoading,
  hideLoading,
  showError,
  updateCurrentTrackInfo,
  updatePlayButton,
  updatePlayButtons,
  updateProgress,
} from "./ui.js";
import { addToRecents, getCurrentSongList } from "./playlistService.js";

export const setupAudioEventListeners = (playlist) => {
  if (!state.currentAudio) return;
  state.currentAudio.addEventListener("timeupdate", updateProgress);
  state.currentAudio.addEventListener("ended", () => handleTrackEnd(playlist));
  state.currentAudio.addEventListener("error", handleAudioError);
};

export const playSong = async (
  song,
  context = { type: "library" },
  playlist = null
) => {
  showLoading();
  try {
    addToRecents(song);
    const url = song.preview || song.mp3;
    if (state.currentAudio?.src === url) {
      togglePlayPause();
      return;
    }
    stopCurrentPlayback();
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    state.currentAudio = audio;
    state.currentPlaylist = playlist;
    audio.volume = document.querySelector(".volume-slider").value / 100;
    updateCurrentTrackInfo(song);
    // updatePlayButtons();
    const currentList = getCurrentSongList();
    const index = currentList.findIndex((s) => s.mp3 === song.mp3);
    updatePlayButton(true, index);

    setupAudioEventListeners(playlist);
    await audio.play();
    state.isPlaying = true;
  } catch (err) {
    console.error("playSong error:", err);
    showError("Error playing song");
  } finally {
    hideLoading();
  }
};

export const togglePlayPause = () => {
  if (!state.currentAudio) return;

  if (state.isPlaying) {
    state.currentAudio.pause();
    state.isPlaying = false;
  } else {
    state.currentAudio
      .play()
      .catch(() => showError("Failed to resume playback"));
    state.isPlaying = true;
  }

  //   updatePlayButtons();
  const currentList = getCurrentSongList();
  const index = currentList.findIndex((s) => s.mp3 === song.mp3);
  updatePlayButton(true, index);
};

export const stopCurrentPlayback = () => {
  if (!state.currentAudio) return;
  state.currentAudio.pause();
  state.currentAudio.removeEventListener("timeupdate", updateProgress);
  state.currentAudio.removeEventListener("ended", handleTrackEnd);
  state.currentAudio.removeEventListener("error", handleAudioError);
  state.currentAudio = null;
};

export const playPrevious = () => {
  if (!state.currentAudio) return;
  const list = getCurrentSongList();
  const idx = list.findIndex((s) => s.mp3 === state.currentAudio.src);
  if (idx > 0)
    playSong(list[idx - 1], state.currentContext, state.currentPlaylist);
};

export const playNext = () => {
  if (!state.currentAudio) return;
  const list = getCurrentSongList();
  const idx = list.findIndex((s) => s.mp3 === state.currentAudio.src);
  if (idx < list.length - 1)
    playSong(list[idx + 1], state.currentContext, state.currentPlaylist);
};

export const handleTrackEnd = (playlist) => {
  if (state.currentContext.type === "playlist") {
    const ctx = state.currentContext.data;
    ctx.currentIndex = (ctx.currentIndex + 1) % ctx.songs.length;
    playSong(ctx.songs[ctx.currentIndex], state.currentContext, playlist);
  } else {
    playNext();
  }
};

export const handleAudioError = () => {
  showError("Error playing audio track");
  state.isPlaying = false;
  //   updatePlayButtons();
  const currentList = getCurrentSongList();
  const index = currentList.findIndex((s) => s.mp3 === song.mp3);
  updatePlayButton(true, index);
};
