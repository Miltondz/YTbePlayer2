export const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const regExp = /(?:https?:\/\/(?:www\.)?youtu\.be\/|(?:https?:\/\/(?:www\.)?youtube\.com\/(?:v\/|e\/|watch\?v=)))([^&?=]*)(?:[^\w-]|$)/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match?.[1] || '').replace('H', '') || '0';
  const minutes = (match?.[2] || '').replace('M', '') || '0';
  const seconds = (match?.[3] || '').replace('S', '') || '0';
  
  return (
    parseInt(hours) * 3600 +
    parseInt(minutes) * 60 +
    parseInt(seconds)
  );
};