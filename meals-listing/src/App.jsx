import React, { useState, useEffect } from 'react';

const MEALS_API = "https://api.freeapi.app/api/v1/public/meals";

function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await fetch(MEALS_API);
      const result = await response.json();

      if (result.success) {
        const mealData = result.data.data || [];
        setMeals(shuffle(mealData));
      } else {
        throw new Error("Failed to fetch meals");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-orange-100">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter uppercase">
            Flavor<span className="text-orange-500">Flow</span>
          </h1>
          <button 
            onClick={fetchMeals}
            disabled={loading}
            className="bg-stone-900 hover:bg-orange-600 disabled:bg-stone-300 text-white px-5 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95"
          >
            {loading ? "Cooking..." : "Refresh Menu"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="max-w-md mx-auto bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 transition-all duration-500 ${loading ? 'opacity-20 blur-sm' : 'opacity-100 blur-0'}`}>
          {meals.map((meal) => (
            <article 
              key={meal.idMeal} 
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200 shadow-lg">
                <img 
                  src={meal.strMealThumb} 
                  alt={meal.strMeal}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-stone-900">
                    {meal.strCategory}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{meal.strArea} Cuisine</span>
                </div>
                <h2 className="text-2xl font-bold leading-tight group-hover:text-orange-600 transition-colors">
                  {meal.strMeal}
                </h2>
                <button className="mt-4 text-sm font-bold border-b-2 border-stone-900 pb-1 hover:border-orange-500 hover:text-orange-500 transition-all">
                  Get Ingredients
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;