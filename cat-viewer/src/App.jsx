import React, { useState, useEffect } from 'react';

const API_URL = "https://api.freeapi.app/api/v1/public/cats/cat/random";

function App() {
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCat = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      console.log("API Response:", result);   
      if (result.success) {
        setCat(result.data);
      } else {
        throw new Error("Failed to fetch cat data");
      }
    } catch (err) {
      setError("The cats are napping. Try again later!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCat();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Cat Finder 3000</h1>

        <div className="relative aspect-square w-full bg-slate-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          ) : error ? (
            <p className="text-red-500 px-4">{error}</p>
          ) : (
            cat && (
              <img 
                src={cat.image} 
                alt="A random cute cat" 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            )
          )}
        </div>

        {cat && !loading && (
          <div className="mb-6 text-left">
            <p className="text-sm text-slate-500 italic">"I'm just here for the treats."</p>
          </div>
        )}

        <button
          onClick={fetchCat}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-blue-300"
        >
          {loading ? "Fetching..." : "Gimme Another Cat!"}
        </button>
      </div>

    </div>
  );
}

export default App;