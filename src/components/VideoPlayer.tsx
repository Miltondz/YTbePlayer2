import React, { useState, useEffect, useRef } from 'react';
import { VideoDetails, VideoPlayerState } from '../types/youtube';
import VideoControls from './VideoControls';
import { extractVideoId } from '../utils/youtube';
import { fetchVideoDetails } from '../services/youtube';
import { YOUTUBE_EMBED_BASE_URL } from '../config/constants';

interface VideoPlayerProps {
  videoUrl: string;
  songInfo?: { songName: string; artistName: string } | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, songInfo }) => {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isLooping: false,
  });

  const videoId = extractVideoId(videoUrl);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!videoId) return;
      
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event: any) => {
            setPlayerState(prev => ({
              ...prev,
              isPlaying: event.data === window.YT.PlayerState.PLAYING,
              duration: playerRef.current?.getDuration() || 0
            }));
          },
          onReady: () => {
            // Update initial state
            setPlayerState(prev => ({
              ...prev,
              duration: playerRef.current?.getDuration() || 0
            }));
          }
        }
      });
    };

    // Cleanup
    return () => {
      playerRef.current?.destroy();
    };
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;

    const loadVideoDetails = async () => {
      try {
        const details = await fetchVideoDetails(videoId);
        setVideoDetails(details);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
        setVideoDetails(null);
      }
    };

    loadVideoDetails();
  }, [videoId]);

  // Update current time periodically
  useEffect(() => {
    if (!playerRef.current || !playerState.isPlaying) return;

    const interval = setInterval(() => {
      const currentTime = playerRef.current?.getCurrentTime() || 0;
      setPlayerState(prev => ({ ...prev, currentTime }));
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState.isPlaying]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerState.isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stopVideo();
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    }
  };

  const handleVolumeChange = (value: number) => {
    if (playerRef.current) {
      playerRef.current.setVolume(value * 100);
      setPlayerState(prev => ({ ...prev, volume: value }));
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      if (playerState.isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setPlayerState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    }
  };

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  };

  const handleSkipBackward = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const newTime = Math.max(0, currentTime - seconds);
      handleSeek(newTime);
    }
  };

  const handleSkipForward = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      const newTime = Math.min(duration, currentTime + seconds);
      handleSeek(newTime);
    }
  };

  const handleLoopToggle = () => {
    if (playerRef.current) {
      const newLoopState = !playerState.isLooping;
      playerRef.current.setLoop(newLoopState);
      setPlayerState(prev => ({ ...prev, isLooping: newLoopState }));
    }
  };

  const formatDescription = (description: string) => {
    return description.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="w-full bg-zinc-900 rounded-lg overflow-hidden shadow-xl">
      <div className="aspect-video bg-black relative">
        {videoDetails ? (
          <iframe
            ref={iframeRef}
            src={`${YOUTUBE_EMBED_BASE_URL}/${videoDetails.id}?enablejsapi=1&origin=${window.location.origin}&loop=${playerState.isLooping ? 1 : 0}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            {error || 'Enter a YouTube URL to load a video'}
          </div>
        )}
      </div>

      <VideoControls
        state={playerState}
        onPlayPause={handlePlayPause}
        onStop={handleStop}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onSeek={handleSeek}
        onSkipBackward={handleSkipBackward}
        onSkipForward={handleSkipForward}
        onLoopToggle={handleLoopToggle}
      />

      {videoDetails && (
        <div className="p-4 bg-zinc-800 text-white">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold flex-1">{videoDetails.title}</h2>
            {songInfo && (
              <div className="ml-4 px-4 py-2 bg-zinc-700 rounded-lg">
                <p className="text-emerald-400 text-sm font-medium">
                  {songInfo.songName} - {songInfo.artistName}
                </p>
              </div>
            )}
          </div>
          
          <div className="relative">
            <div 
              className={`text-sm text-zinc-400 overflow-hidden ${
                isDescriptionExpanded ? '' : 'max-h-24'
              }`}
            >
              <div className="border-l-2 border-zinc-700 pl-4">
                {formatDescription(videoDetails.description)}
              </div>
            </div>
            {!isDescriptionExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-800 to-transparent" />
            )}
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 text-sm text-purple-400 hover:text-purple-300"
            >
              {isDescriptionExpanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;