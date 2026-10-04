import { useState, useEffect } from 'react'
import { Film, Star, TrendingUp, PlayCircle, Loader2, Info, Search, X } from 'lucide-react'
import './App.css'

function App() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedShow, setSelectedShow] = useState(null)

  useEffect(() => {
    fetch('https://api.tvmaze.com/shows')
      .then(res => res.json())
      .then(data => {
        const topContent = data
          .filter(item => item.image && item.image.original && item.rating && item.rating.average)
          .sort((a, b) => b.rating.average - a.rating.average)
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

  // Filter shows based on search
  const filteredShows = shows.filter(show => 
    show.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (show.genres && show.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const heroShow = shows[0];
  const gridShows = searchQuery ? filteredShows : shows.slice(1, 13); // Show 12 cards max unless searching

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 pb-20">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold cursor-pointer" onClick={() => {setSearchQuery(''); window.scrollTo(0,0);}}>
          <Film className="text-cyan-400" />
          <span>Neo<span className="text-cyan-400 font-light">Critics</span></span>
        </div>
        
        <div className="hidden md:flex relative w-1/3">
          <input 
            type="text" 
            placeholder="Search shows or genres..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-cyan-400/50 transition text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
        </div>

        <div className="hidden md:flex gap-6 text-sm font-semibold tracking-wider text-gray-400">
          <a href="#" className="hover:text-cyan-400 transition">LIVE FEED</a>
        </div>
      </nav>

      {/* Hero Section (Only show if not searching) */}
      {!searchQuery && heroShow && (
        <main className="pt-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 z-10">
            <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest">
              #1 TRENDING LIVE
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
              {heroShow.name.toUpperCase()}
            </h1>
            
            <div 
              className="text-gray-400 text-lg leading-relaxed max-w-lg line-clamp-3" 
              dangerouslySetInnerHTML={{ __html: heroShow.summary }} 
            />
            
            <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
              <span className="flex items-center gap-1 text-yellow-500">
                <Star size={18} fill="currentColor" /> {heroShow.rating.average} / 10
              </span>
              <span>|</span>
              <span>{heroShow.genres.join(' • ')}</span>
              <span>|</span>
              <span>{heroShow.premiered?.substring(0,4)}</span>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setSelectedShow(heroShow)}
                className="bg-cyan-400 text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-300 transition hover:scale-105"
              >
                <Info size={20} /> View Details
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
            <img 
              src={heroShow.image.original} 
              alt={heroShow.name}
              className="relative z-10 w-full md:w-[70%] ml-auto rounded-2xl border border-white/10 shadow-2xl shadow-black/50 hover:scale-[1.02] transition duration-500 object-cover aspect-[2/3]"
            />
          </div>
        </main>
      )}

      {/* Grid Section */}
      <section className="mt-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-rose-500" size={32} />
            <h2 className="text-3xl font-bold">{searchQuery ? 'Search Results' : 'Live Content Feed'}</h2>
          </div>
          {searchQuery && <span className="text-cyan-400">{filteredShows.length} found</span>}
        </div>
        
        {filteredShows.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">No shows found matching "{searchQuery}"</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gridShows.map(show => (
              <div 
                key={show.id} 
                onClick={() => setSelectedShow(show)}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-black/50">
                  <img 
                    src={show.image?.medium} 
                    alt={show.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-yellow-500 font-bold text-xs">
                    <Star size={12} fill="currentColor" /> {show.rating?.average}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition line-clamp-1">{show.name}</h3>
                  <p className="text-gray-500 text-xs font-semibold">{show.genres.slice(0,2).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedShow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl shadow-cyan-500/10">
            <button 
              onClick={() => setSelectedShow(null)}
              className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:text-cyan-400 transition z-10"
            >
              <X size={24} />
            </button>
            <div className="w-full md:w-2/5">
              <img src={selectedShow.image?.original || selectedShow.image?.medium} alt={selectedShow.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:w-3/5 flex flex-col">
              <h2 className="text-4xl font-black mb-2">{selectedShow.name}</h2>
              <div className="flex gap-4 text-sm font-bold text-gray-400 mb-6">
                <span className="flex items-center gap-1 text-yellow-500"><Star size={16}/> {selectedShow.rating?.average}</span>
                <span>{selectedShow.premiered}</span>
                <span>{selectedShow.status}</span>
              </div>
              <div className="text-gray-300 leading-relaxed mb-8 flex-1" dangerouslySetInnerHTML={{ __html: selectedShow.summary }} />
              
              <div className="flex gap-4">
                {selectedShow.officialSite && (
                  <a href={selectedShow.officialSite} target="_blank" rel="noreferrer" className="bg-cyan-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-300 transition text-center flex-1">
                    Official Site
                  </a>
                )}
                <a href={selectedShow.url} target="_blank" rel="noreferrer" className="bg-white/10 text-white px-6 py-2 rounded-lg font-bold hover:bg-white/20 transition text-center flex-1">
                  View on TVMaze
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

