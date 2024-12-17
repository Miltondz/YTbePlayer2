import React from 'react';
import { 
  Play, 
  Pause, 
  Square,
  Rewind, 
  FastForward,
  Volume2, 
  VolumeX,
  Repeat
} from 'lucide-react';
import { VideoPlayerState } from '../types/youtube';

interface VideoControlsProps {
  state: VideoPlayerState;
  onPlayPause: () => void;
  onStop: () => void;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
  onSeek: (time: number) => void;
  onSkipBackward: (seconds: number) => void;
  onSkipForward: (seconds: number) => void;
  onLoopToggle: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  state,
  onPlayPause,
  onStop,
  onVolumeChange,
  onMuteToggle,
  onSeek,
  onSkipBackward,
  onSkipForward,
  onLoopToggle,
}) => {
  const { isPlaying, currentTime, duration, volume, isMuted, isLooping } = state;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ControlButton = ({ onClick, icon: Icon, label }: { onClick: () => void; icon: React.ElementType; label: string }) => (
    <button
      onClick={onClick}
      className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-full transition-colors"
      title={label}
    >
      <Icon size={20} />
    </button>
  );

  return (
    <div className="p-4 bg-zinc-800 space-y-4">
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="flex-1 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-zinc-400">{formatTime(duration)}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Main Controls */}
        <div className="flex items-center gap-2">
          <ControlButton
            onClick={onPlayPause}
            icon={isPlaying ? Pause : Play}
            label={isPlaying ? 'Pause' : 'Play'}
          />
          <ControlButton
            onClick={onStop}
            icon={Square}
            label="Stop"
          />
          <div className="h-8 w-px bg-zinc-700 mx-2" />
          
          {/* Skip Backward Controls */}
          <div className="flex items-center gap-1">
            {[5, 10, 20].map(seconds => (
              <button
                key={`back-${seconds}`}
                onClick={() => onSkipBackward(seconds)}
                className="px-2 py-1 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                title={`Back ${seconds}s`}
              >
                <div className="flex items-center gap-1">
                  <Rewind size={14} />
                  {seconds}
                </div>
              </button>
            ))}
          </div>

          {/* Skip Forward Controls */}
          <div className="flex items-center gap-1">
            {[5, 10, 20].map(seconds => (
              <button
                key={`forward-${seconds}`}
                onClick={() => onSkipForward(seconds)}
                className="px-2 py-1 text-xs text-zinc-300 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                title={`Forward ${seconds}s`}
              >
                <div className="flex items-center gap-1">
                  <FastForward size={14} />
                  {seconds}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Volume and Loop Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onLoopToggle}
            className={`p-2 rounded-full transition-colors ${
              isLooping 
                ? 'text-purple-400 hover:text-purple-300 bg-purple-400/10' 
                : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
            }`}
            title="Toggle Loop"
          >
            <Repeat size={20} />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onMuteToggle}
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-full transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-24 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;