export const state = {
  currentAudio: null,
  isPlaying: false,
  songsData: [],
  playlists: JSON.parse(localStorage.getItem("playlists")) || [],
  recents: JSON.parse(localStorage.getItem("recents")) || [],
  currentContext: { type: "library", data: null },
  currentTrackIndex: -1,
  currentPlaylist: null,
};

// window.state = state;
