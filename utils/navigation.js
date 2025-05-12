import { state } from "./state.js";
import { renderMusicCards, renderPlaylists, updateSectionTitle } from "./ui.js";

export const handleNavigation = (e) => {
  e.preventDefault();
  const target = e.target.closest("a");
  document
    .querySelectorAll(".nav-menu a")
    .forEach((a) => a.classList.remove("active"));
  target.classList.add("active");

  switch (target.textContent.trim()) {
    case "Recent":
      updateSectionTitle("Recently Played");
      renderMusicCards(state.recents, { type: "recents", data: null });
      break;
    case "Playlists":
      renderPlaylists();
      break;
    default:
      updateSectionTitle("Your Library");
      renderMusicCards(state.songsData, { type: "library", data: null });
  }
};

export const handleSearch = (e) => {
  const term = e.target.value.toLowerCase().trim();
  const filtered = state.songsData.filter(
    ({ title, artist }) =>
      title.toLowerCase().includes(term) || artist.toLowerCase().includes(term)
  );
  if (state.currentContext.type === "library")
    renderMusicCards(filtered, { type: "library", data: null });
};
