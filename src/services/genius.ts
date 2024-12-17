import { SongInfo } from '../types/music';

const GENIUS_API_KEY = import.meta.env.VITE_GENIUS_API_KEY;
const GENIUS_API_URL = 'https://api.genius.com';

export const searchSongOnGenius = async ({ songName, artistName }: SongInfo) => {
  try {
    const response = await fetch(
      `${GENIUS_API_URL}/search?q=${encodeURIComponent(`${songName} ${artistName}`)}`,
      {
        headers: {
          'Authorization': `Bearer ${GENIUS_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search on Genius');
    }

    const data = await response.json();
    const hits = data.response.hits;
    
    if (hits.length === 0) {
      return null;
    }

    // Find the best match by comparing song and artist names
    const bestMatch = hits.find(hit => {
      const title = hit.result.title.toLowerCase();
      const artist = hit.result.primary_artist.name.toLowerCase();
      return (
        title.includes(songName.toLowerCase()) &&
        artist.includes(artistName.toLowerCase())
      );
    });

    return bestMatch ? bestMatch.result : null;
  } catch (error) {
    console.error('Error searching Genius:', error);
    return null;
  }
};