import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.freeapi.app/api/v1/public/randomproducts')
      .then((res) => res.json())
      .then((res) => {
        setProducts(res.data?.data || [])
        setLoading(false)
      })
      .catch((err) => console.error("Error:", err));
  }, [])
  return (
    <>
      <div className='container mx-auto p-6'>
        <h1 className="text-3xl font-bold text-center mb-8">Product Store</h1>
        {loading ? (<div className="flex justify-center">Loading...</div>) : (
          <div className='grid grid-cols-1 gap-6'>
            {products.map((product) => (
              <div key={product.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-contain bg-gray-50 p-4"
                />
                <div className="p-4">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h2 className="text-lg font-bold truncate">{product.title}</h2>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-gray-900">${product.price}</span>
                    <button className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App
