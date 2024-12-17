import { YOUTUBE_API_BASE_URL } from '../config/constants';
import { VideoDetails, SearchResult } from '../types/youtube';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYoutubeVideos = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&maxResults=10&type=video&videoCategoryId=10&q=${encodeURIComponent(query)}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle
    }));
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};
// utils/youtube.ts

export const extractVideoId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const fetchVideoDetails = async (videoId: string): Promise<VideoDetails> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = data.items[0];
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
      duration: video.contentDetails.duration
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};