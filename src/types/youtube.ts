export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
}

export interface VideoError {
  message: string;
  code?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}