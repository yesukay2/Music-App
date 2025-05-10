import { formatTime } from "./utils.js";
import { showError } from "./ui.js";

export const fetchData = async () => {
  try {
    const res = await fetch("/api/deezer");
    if (!res.ok) throw new Error("Network response was not ok");
    const { data } = await res.json();
    return data.map(
      ({
        artist: { name: artist },
        title,
        album: { cover_medium: cover },
        duration,
        preview: mp3,
      }) => ({
        artist,
        title,
        cover,
        duration,
        formattedDuration: formatTime(duration),
        mp3,
        preview: mp3,
      })
    );
  } catch (err) {
    showError("Failed to load songs. Please try again later.");
    return [];
  }
};

export const fetchSongData = async (songId) => {
  try {
    const res = await fetch(`https://api.deezer.com/track/${songId}`);
    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      artist: data.artist.name,
      cover: data.album.cover_medium,
      duration: data.duration,
      preview: data.preview,
      mp3: data.preview,
    };
  } catch (err) {
    console.error("fetchSongData error:", err);
    return null;
  }
};
