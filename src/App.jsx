import { useState, useEffect } from 'react'
import { Film, Star, TrendingUp, PlayCircle, Loader2, Info } from 'lucide-react'
import './App.css'

function App() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetching live data directly from the client side!
    // Using TVMaze's public free API - NO API KEY REQUIRED, NO VERCEL, NO DATABASE
    fetch('https://api.tvmaze.com/shows')
      .then(res => res.json())
      .then(data => {
        // Filter and sort for the best content with high-res images
        const topContent = data
          .filter(item => item.image && item.image.original && item.rating && item.rating.average)
          .sort((a, b) => b.rating.average - a.rating.average)
          .slice(0, 9); // 1 for hero, 8 for grid
        setShows(topContent);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching live data:", err);
        setLoading(false);
      });
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
        <p className="text-gray-400 animate-pulse font-bold tracking-widest text-sm">FETCHING LIVE DATA FROM PUBLIC API...</p>
      </div>
    )
  }

  // First show becomes our dynamic Hero!
  const heroShow = shows[0];
  // The rest go into the grid
  const gridShows = shows.slice(1);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Film className="text-cyan-400" />
          <span>Neo<span className="text-cyan-400 font-light">Critics</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-semibold tracking-wider text-gray-400">
          <a href="#" className="text-white hover:text-cyan-400 transition">DISCOVER</a>
          <a href="#" className="hover:text-cyan-400 transition">LIVE FEED</a>
          <a href="#" className="hover:text-cyan-400 transition">CRITICS</a>
        </div>
      </nav>

      {/* Dynamic Hero Section */}
      <main className="pt-32 px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest">
            #1 TRENDING LIVE
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
            {heroShow?.name.toUpperCase()}
          </h1>
          
          <div 
            className="text-gray-400 text-lg leading-relaxed max-w-lg line-clamp-3" 
            dangerouslySetInnerHTML={{ __html: heroShow?.summary }} 
          />
          
          <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
            <span className="flex items-center gap-1 text-yellow-500">
              <Star size={18} fill="currentColor" /> {heroShow?.rating?.average} / 10
            </span>
            <span>|</span>
            <span>{heroShow?.genres.join(' • ')}</span>
            <span>|</span>
            <span>{heroShow?.premiered?.substring(0,4)}</span>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="bg-cyan-400 text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-300 transition hover:scale-105">
              <PlayCircle size={20} /> Watch Trailer
            </button>
            <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition flex items-center gap-2">
              <Info size={20} /> Details
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
          <img 
            src={heroShow?.image?.original} 
            alt={heroShow?.name}
            className="relative z-10 w-full md:w-[70%] ml-auto rounded-2xl border border-white/10 shadow-2xl shadow-black/50 hover:scale-[1.02] transition duration-500 object-cover aspect-[2/3]"
          />
        </div>
      </main>

      {/* Dynamic API Grid */}
      <section className="mt-32 px-8 max-w-7xl mx-auto pb-32">
        <div className="flex items-center gap-3 mb-10">
          <TrendingUp className="text-rose-500" size={32} />
          <h2 className="text-3xl font-bold">Live Content Feed</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {gridShows.map(show => (
            <div key={show.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition group cursor-pointer flex flex-col">
              <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                <img 
                  src={show.image?.medium} 
                  alt={show.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-yellow-500 font-bold text-xs">
                  <Star size={12} fill="currentColor" /> {show.rating?.average}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-t from-black/50 to-transparent">
                <div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition line-clamp-1">{show.name}</h3>
                  <p className="text-gray-500 text-xs font-semibold mb-3">{show.genres[0] || 'Drama'}</p>
                </div>
                <div className="text-xs text-gray-400 line-clamp-2" dangerouslySetInnerHTML={{ __html: show.summary }} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center text-gray-600 text-xs font-bold tracking-widest bg-white/5 py-4 rounded-xl border border-white/5">
          DATA FETCHED 100% LIVE FROM PUBLIC TVMAZE API &nbsp;•&nbsp; NO CLOUD DATABASES &nbsp;•&nbsp; NO VERCEL BACKENDS
        </div>
      </section>
    </div>
  )
}

export default App
