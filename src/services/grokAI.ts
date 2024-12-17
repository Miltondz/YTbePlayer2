import { SongInfo } from '../types/music';

const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY;
const API_URL = 'https://api.x.ai/v1/chat/completions';

export const analyzeSongFromTitle = async (videoTitle: string): Promise<SongInfo> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { 
            role: "system", 
            content: "You are a system that identifies songs and artists from YouTube video titles." 
          },
          { 
            role: "user", 
            content: `Extract the song and artist from the YouTube title: ${videoTitle} . The song and artist should be in the format of **Song:** followed by the Song name  and **Artist:** followed by the Artist name, nothing else is to be returned here, no other commentaries`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze song');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parse the response to extract song and artist
    const songMatch = content.match(/\*\*Song:\*\* (.*)/);
    const artistMatch = content.match(/\*\*Artist:\*\* (.*)/);

    return {
      songName: songMatch?.[1]?.trim() || '',
      artistName: artistMatch?.[1]?.trim() || ''
    };
  } catch (error) {
    console.error('Error analyzing song:', error);
    throw error;
  }
};

export const fetchSongTrivia = async (songName: string, artistName: string): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          { 
            role: "system", 
            content: "You are a system that provides trivia about songs." 
          },
          { 
            role: "user", 
            content: `I need a paragraph of trivia about the song "${songName}" by ${artistName}. I'm interested in learning something I probably wouldn't already know. Focus on details like: The song's writing or composition process, any interesting stories from the recording sessions, the song's chart performance or cultural impact beyond just 'it was a hit,' and any unusual or surprising facts about the song's creation or reception. Avoid generic information like 'it was a popular song.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trivia');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No trivia available.';
  } catch (error) {
    console.error('Error fetching trivia:', error);
    throw error;
  }
};