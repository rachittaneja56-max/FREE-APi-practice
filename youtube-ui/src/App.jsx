import { useState, useEffect } from 'react';
import './App.css'

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.freeapi.app/api/v1/public/youtube/videos')
      .then((res) => res.json())
      .then((data) => {
          setVideos(data.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className='p-4'>
      <h1 className="text-2xl font-bold mb-4">YouTube Clone</h1>
      
      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div className='flex flex-wrap gap-6'>
          {videos.map((video) => (
            <div key={video.id} className='flex flex-col gap-1 w-64'>
              <img 
                className="rounded-lg bg-gray-200"
                src={video.items?.snippet?.thumbnails?.high?.url} 
                alt={video.items?.snippet?.title}
              />
              <p className="font-semibold text-sm line-clamp-2">
                {video.items?.snippet?.title}
              </p>
              <p className="text-gray-500 text-xs">
                {video.items?.snippet?.channelTitle}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}