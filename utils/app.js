import { state } from "./state.js";
import { fetchData } from "./dataService.js";
import {
  renderMusicCards,
  renderPlaylists,
  updateRecentNavIndicator,
  showLoading,
  hideLoading,
  showError,
} from "./ui.js";
import { setupEventListeners } from "./eventListeners.js";

export const initializeApp = async () => {
  showLoading();
  try {
    state.songsData = await fetchData();
    updateRecentNavIndicator();
    renderMusicCards(state.songsData, { type: "library", data: null });
    renderPlaylists();
  } catch {
    showError("Failed to initialize application");
  } finally {
    hideLoading();
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await initializeApp();
  setupEventListeners();
});
