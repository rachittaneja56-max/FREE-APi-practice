import React, { useState, useEffect } from 'react';

const USERS_API = "https://api.freeapi.app/api/v1/public/randomusers";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(USERS_API);
      const result = await response.json();

      if (result.success) {
        const userData = result.data.data || [];
        setUsers(shuffle(userData));
      } else {
        throw new Error("Could not retrieve users");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased px-6 py-12">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-900">
            Team Directory
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Connecting talent across the globe.</p>
        </div>
        <button 
          onClick={fetchUsers}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          {loading ? "Syncing..." : "Refresh Members"}
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
            {error}
          </div>
        )}

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300 ${loading ? 'opacity-40 grayscale' : 'opacity-100 grayscale-0'}`}>
          {users.map((user) => (
            <div 
              key={user.login.uuid} 
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img 
                    src={user.picture.large} 
                    alt={user.name.first}
                    className="relative w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                  />
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                  {user.name.title} {user.name.first} {user.name.last}
                </h2>
                <p className="text-indigo-600 font-medium mb-4 text-sm tracking-wide">
                  @{user.login.username}
                </p>

                <div className="w-full space-y-3 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <span className="text-lg">📧</span>
                    <span className="text-sm truncate w-full">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <span className="text-lg">📍</span>
                    <span className="text-sm">{user.location.city}, {user.location.country}</span>
                  </div>
                </div>

                <button className="mt-8 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;