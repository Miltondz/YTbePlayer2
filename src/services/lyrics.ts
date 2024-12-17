import { SongInfo } from '../types/music';
import { searchSongOnGenius } from './genius';

const extractLyricsFromHTML = (html: string): string => {
  // Create a temporary element to parse the HTML
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove script tags and unwanted elements
  const scripts = div.getElementsByTagName('script');
  while (scripts.length > 0) {
    scripts[0].remove();
  }
  
  // Extract lyrics text
  const lyricsElements = div.querySelectorAll('[class*="Lyrics__Container"]');
  let lyrics = '';
  
  lyricsElements.forEach(element => {
    lyrics += element.textContent + '\n\n';
  });
  
  return lyrics.trim();
};

export const fetchLyrics = async (songInfo: SongInfo): Promise<string> => {
  try {
    // First, try Genius API
    const geniusResult = await searchSongOnGenius(songInfo);
    
    if (geniusResult) {
      // Fetch the song page HTML
      const response = await fetch(geniusResult.url);
      const html = await response.text();
      const lyrics = extractLyricsFromHTML(html);
      
      if (lyrics) {
        return lyrics;
      }
    }

    // Fallback to lyrics.ovh if Genius fails
    console.log('Falling back to lyrics.ovh...');
    const response = await fetch(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(songInfo.artistName)}/${encodeURIComponent(songInfo.songName)}`
    );

    if (!response.ok) {
      throw new Error('Lyrics not found');
    }

    const data = await response.json();
    return data.lyrics || 'Lyrics not available';
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    throw error;
  }
};