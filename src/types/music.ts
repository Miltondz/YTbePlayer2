export interface SongInfo {
  songName: string;
  artistName: string;
}

export interface SongAnalysis {
  songInfo: SongInfo;
  trivia: string;
  lyrics: string;
  isLoading: boolean;
  error?: string;
}