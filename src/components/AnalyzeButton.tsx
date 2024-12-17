import React from 'react';
import { Search } from 'lucide-react';

interface AnalyzeButtonProps {
  onAnalyze: (videoTitle?: string) => void; // Accepts an optional video title
  isLoading: boolean;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onAnalyze, isLoading }) => {
  const videoTitle = 'Sample Video Title'; // Replace this with dynamic data if available

  return (
    <button
      onClick={() => onAnalyze(videoTitle)} // Pass the videoTitle explicitly
      disabled={isLoading}
      className={`px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors flex items-center gap-2 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Search size={20} />
      {isLoading ? 'Analyzing...' : 'Analyze Song'}
    </button>
  );
};

export default AnalyzeButton;