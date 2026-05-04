import { useState, useEffect } from 'react';

export default function App() {
  const [jokes, setJokes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchJokes = () => {
    setLoading(true);
    fetch('https://api.freeapi.app/api/v1/public/randomjokes')
      .then((res) => res.json())
      .then((json) => {
        setJokes(json.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jokes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % jokes.length);
  };

  const currentJoke = jokes[currentIndex];

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="w-full max-w-lg">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-amber-600 uppercase tracking-tighter">
            Laugh Factory
          </h1>
          <p className="text-slate-500 font-medium">Your daily dose of digital humor</p>
        </header>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-4 border-amber-200 animate-pulse">
            <p className="font-bold text-amber-400">Loading punchlines...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Joke Card */}
            <div className="bg-white p-10 rounded-3xl shadow-[8px_8px_0px_0px_rgba(245,158,11,1)] border-2 border-slate-900 min-h-[250px] flex flex-col justify-center relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 rounded-full opacity-50"></div>
              
              <div className="relative z-10">
                <p className="text-2xl font-bold leading-snug text-slate-900">
                  {currentJoke?.content}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={handleNext}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                Tell Me Another!
              </button>

              <div className="flex items-center gap-2">
                {jokes.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-amber-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}