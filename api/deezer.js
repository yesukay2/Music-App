export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.deezer.com/chart/0/tracks?limit=10"
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
