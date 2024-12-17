import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchYoutubeVideos } from '../services/youtube';
import { SearchResult } from '../types/youtube';
import useDebounce from '../hooks/useDebounce.js';

interface VideoSearchProps {
  onVideoSelect: (videoUrl: string) => void;
}

const VideoSearch: React.FC<VideoSearchProps> = ({ onVideoSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchVideos = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchYoutubeVideos(debouncedQuery);
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchVideos();
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    const videoUrl = `https://www.youtube.com/watch?v=${result.id}`;
    onVideoSelect(videoUrl);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search YouTube music videos..."
          className="w-full px-4 py-2 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-zinc-400 pr-10"
        />
        <div className="absolute right-3 top-2.5 text-zinc-400">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-400 border-t-transparent" />
          ) : (
            <Search size={20} />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full p-3 flex items-start gap-3 hover:bg-zinc-700 transition-colors text-left"
            >
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-24 h-18 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium line-clamp-2">{result.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{result.channelTitle}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoSearch;