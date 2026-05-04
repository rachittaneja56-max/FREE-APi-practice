import { useState, useEffect } from 'react';

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.freeapi.app/api/v1/public/quotes')
      .then((res) => res.json())
      .then((json) => {
        setQuotes(json.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const currentQuote = quotes[currentIndex];

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-2xl">
        
        {loading ? (
          <div className="text-center animate-pulse text-zinc-500">Loading wisdom...</div>
        ) : (
          <div className="space-y-8 text-center">
            <div className="relative p-12 bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-700">
              <span className="absolute top-4 left-8 text-8xl text-zinc-700 font-serif opacity-50">“</span>
              
              <div className="relative z-10">
                <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-6">
                  {currentQuote?.content}
                </p>
                <p className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">
                  — {currentQuote?.author || "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={handleNext}
                className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Next Quote
              </button>
              
              <p className="text-zinc-500 text-xs">
                Quote {currentIndex + 1} of {quotes.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}