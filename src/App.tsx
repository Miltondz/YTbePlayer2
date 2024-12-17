import React, { useState } from 'react';
import { Search } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import VideoSearch from './components/VideoSearch';
import AnalyzeButton from './components/AnalyzeButton';
import { analyzeSongFromTitle } from './services/grokAI';
import { fetchLyrics } from './services/lyrics';
import { SongAnalysis } from './types/music';
import { fetchVideoDetails } from './services/youtube';
import { extractVideoId } from './utils/youtube';

function App() {
  const [url, setUrl] = useState('');
  const [currentVideo, setCurrentVideo] = useState('');
  const [songAnalysis, setSongAnalysis] = useState<SongAnalysis>({
    songInfo: { songName: '', artistName: '' },
    trivia: '',
    lyrics: '',
    isLoading: false
  });

  const handleLoadVideo = async () => {
  if (!url) return;

  setCurrentVideo(url);
  setSongAnalysis({
    songInfo: { songName: '', artistName: '' },
    trivia: '',
    lyrics: '',
    isLoading: false
  });

  try {
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const videoDetails = await fetchVideoDetails(videoId);
    setVideoTitle(videoDetails.title);
  } catch (error) {
    console.error('Failed to fetch video title:', error);
    setVideoTitle('Unknown Video Title'); // Fallback title
  }
};

  const handleVideoSelect = (videoUrl: string) => {
    setUrl(videoUrl);
    setCurrentVideo(videoUrl);
    setSongAnalysis({
      songInfo: { songName: '', artistName: '' },
      trivia: '',
      lyrics: '',
      isLoading: false
    });
  };

const handleAnalyze = async (videoTitle: string = '') => {
  if (!currentVideo) return;

  setSongAnalysis(prev => ({ ...prev, isLoading: true, error: undefined }));

  try {
    // Use the passed videoTitle or query from the document as a fallback
    const title = videoTitle || document.querySelector('h2')?.textContent || '';
    if (!title) throw new Error('Unable to retrieve video title.');

    const songInfo = await analyzeSongFromTitle(title);
    const trivia = await fetchSongTrivia(songInfo.songName, songInfo.artistName);
    const lyrics = await fetchLyrics(songInfo);

    setSongAnalysis({
      songInfo,
      trivia,
      lyrics,
      isLoading: false
    });
  } catch (error) {
    setSongAnalysis(prev => ({
      ...prev,
      isLoading: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    }));
  }
};


  const formatTrivia = (trivia: string) => {
    return trivia.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  const formatLyrics = (lyrics: string) => {
    return lyrics.split('\n').map((line, index) => (
      <div key={index} className={line.trim() === '' ? 'h-4' : 'leading-relaxed'}>
        {line || '\u00A0'}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Music Video Player</h1>
        
        <div className="space-y-4 mb-8">
          <VideoSearch onVideoSelect={handleVideoSelect} />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Or enter YouTube URL directly"
                  className="w-full px-4 py-2 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-zinc-400"
                />
                <Search className="absolute right-3 top-2.5 text-zinc-400" size={20} />
              </div>
            </div>
            <button
              onClick={handleLoadVideo}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Load Video
            </button>
            <AnalyzeButton onAnalyze={handleAnalyze} isLoading={songAnalysis.isLoading} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <VideoPlayer 
              videoUrl={currentVideo} 
              songInfo={songAnalysis.songInfo.songName ? songAnalysis.songInfo : null}
            />
            <div className="bg-zinc-900 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Trivia</h3>
              {songAnalysis.isLoading ? (
                <p className="text-zinc-400">Analyzing...</p>
              ) : songAnalysis.error ? (
                <p className="text-red-400">{songAnalysis.error}</p>
              ) : songAnalysis.trivia ? (
                <div className="border-l-2 border-emerald-600 pl-4">
                  {formatTrivia(songAnalysis.trivia)}
                </div>
              ) : (
                <p className="text-zinc-400">Click "Analyze Song" to get song information and trivia</p>
              )}
            </div>
          </div>
          
          <div className="bg-zinc-900 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Lyrics</h3>
            {songAnalysis.isLoading ? (
              <p className="text-zinc-400">Loading lyrics...</p>
            ) : songAnalysis.error ? (
              <p className="text-red-400">{songAnalysis.error}</p>
            ) : songAnalysis.lyrics ? (
              <div className="border-l-2 border-purple-600 pl-4 text-zinc-400">
                {formatLyrics(songAnalysis.lyrics)}
              </div>
            ) : (
              <p className="text-zinc-400">Lyrics will appear here after analysis</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;