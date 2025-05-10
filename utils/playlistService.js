import { state } from "./state.js";
import { renderPlaylists, renderMusicCards } from "./ui.js";

// create new playlist via prompt
export const createNewPlaylist = () => {
  const name = prompt("Enter playlist name:");
  if (!name) return null;
  const pl = { id: Date.now(), name, songs: [], currentIndex: 0 };
  state.playlists.push(pl);
  localStorage.setItem("playlists", JSON.stringify(state.playlists));
  renderPlaylists();
  return pl;
};

export const addToPlaylist = (playlistId, song) => {
  const pl = state.playlists.find((p) => p.id === playlistId);
  if (!pl || pl.songs.some((s) => s.id === song.id)) return false;
  pl.songs.push({ ...song });
  localStorage.setItem("playlists", JSON.stringify(state.playlists));
  if (state.currentPlaylist?.id === playlistId)
    renderMusicCards(pl.songs, { type: "playlist", data: pl });
  return true;
};

export const addToRecents = (song) => {
  state.recents = state.recents.filter((s) => s.mp3 !== song.mp3);
  state.recents.unshift(song);
  state.recents = state.recents.slice(0, 10);
  localStorage.setItem("recents", JSON.stringify(state.recents));
};

export const getCurrentSongList = () => {
  switch (state.currentContext.type) {
    case "recents":
      return state.recents;
    case "playlist":
      return state.currentContext.data.songs;
    default:
      return state.songsData;
  }
};

export const showPlaylistSelection = () =>
  new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "playlist-selection-modal";
    modal.innerHTML = `
    <div class="modal-content">
      <h3>Select Playlist</h3>
      <div class="playlist-options"></div>
      <button class="create-new">Create New Playlist</button>
      <button class="cancel-btn">Cancel</button>
    </div>
  `;
    const options = modal.querySelector(".playlist-options");
    state.playlists.forEach((pl) => {
      const btn = document.createElement("button");
      btn.className = "playlist-option";
      btn.textContent = `${pl.name} (${pl.songs.length})`;
      btn.addEventListener("click", () => {
        document.body.removeChild(modal);
        resolve(pl);
      });
      options.appendChild(btn);
    });
    modal.querySelector(".create-new").addEventListener("click", () => {
      const newPl = createNewPlaylist();
      if (newPl) {
        document.body.removeChild(modal);
        resolve(newPl);
      }
    });
    modal.querySelector(".cancel-btn").addEventListener("click", () => {
      document.body.removeChild(modal);
      resolve(null);
    });
    document.body.appendChild(modal);
  });

export const showSongSelection = () =>
  new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "song-selection-modal";
    modal.innerHTML = `
    <div class="modal-content">
      <h3>Select a Song</h3>
      <div class="song-list"></div>
      <button class="cancel-btn">Cancel</button>
    </div>
  `;
    const list = modal.querySelector(".song-list");
    state.songsData.forEach((song) => {
      const item = document.createElement("div");
      item.className = "song-item";
      item.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" />
      <div><h4>${song.title}</h4><p>${song.artist}</p></div>
    `;
      item.addEventListener("click", () => {
        document.body.removeChild(modal);
        resolve(song);
      });
      list.appendChild(item);
    });
    modal.querySelector(".cancel-btn").addEventListener("click", () => {
      document.body.removeChild(modal);
      resolve(null);
    });
    document.body.appendChild(modal);
  });
