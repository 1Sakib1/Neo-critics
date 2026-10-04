import { useState, useEffect } from 'react'
import { Film, Star, TrendingUp, PlayCircle, Loader2, Info, Search, X, Award, Tv, ChevronRight } from 'lucide-react'
import './App.css'

// Custom Component to fetch and display Real IMDb & Rotten Tomatoes data live!
const OmdbBadges = ({ imdbId }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    if (!imdbId) return;
    let mounted = true;
    fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=thewdb`)
      .then(r => r.json())
      .then(d => {
         if (mounted && d.Response === "True") setData(d);
      })
      .catch(e => console.error("OMDb Error", e));
    return () => { mounted = false; };
  }, [imdbId]);

  if (!data) return null;

  const rt = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value;
  const imdb = data.imdbRating;

  return (
    <div className="flex items-center gap-3">
      {imdb && imdb !== 'N/A' && (
        <span className="flex items-center gap-1 bg-[#f5c518] text-black px-2 py-0.5 rounded text-sm font-bold shadow-lg shadow-yellow-500/20">
          IMDb {imdb}
        </span>
      )}
      {rt && rt !== 'N/A' && (
        <span className="flex items-center gap-1 bg-[#fa320a] text-white px-2 py-0.5 rounded text-sm font-bold shadow-lg shadow-red-500/20">
          🍅 {rt}
        </span>
      )}
    </div>
  )
}

function App() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Real API Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  
  const [selectedShow, setSelectedShow] = useState(null)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  // 1. Fetch Default "Home Page" Data
  useEffect(() => {
    fetch('https://api.tvmaze.com/shows')
      .then(res => res.json())
      .then(data => {
        const topContent = data
          .filter(item => item.image && item.image.original && item.rating && item.rating.average)
          .sort((a, b) => b.rating.average - a.rating.average);
        setShows(topContent);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching live data:", err);
        setLoading(false);
      });
  }, [])

  // 2. Auto-rotate Hero
  useEffect(() => {
    if (shows.length === 0 || isSearching) return;
    
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % 5);
    }, 7000);
    
    return () => clearInterval(timer);
  }, [shows.length, isSearching]);

  // 3. Live Third-Party API Search (with Debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setSearchLoading(true);
    
    const debounceTimer = setTimeout(() => {
      fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          const results = data
            .map(item => item.show)
            .filter(show => show.image); 
          setSearchResults(results);
          setSearchLoading(false);
        })
        .catch(err => {
          console.error("API Search Error:", err);
          setSearchLoading(false);
        });
    }, 600);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
        <p className="text-gray-400 animate-pulse font-bold tracking-widest text-sm">FETCHING LIVE DATA FROM PUBLIC APIS...</p>
      </div>
    )
  }

  const heroShows = shows.slice(0, 5);
  const heroShow = heroShows[currentHeroIndex];
  
  const top10Shows = shows.slice(1, 11);
  const marqueeShows = shows.slice(11, 30);
  const topRatedShows = shows.slice(30, 34);
  const gridShows = isSearching ? searchResults : shows.slice(34, 54);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 pb-10">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold cursor-pointer" onClick={() => {setSearchQuery(''); window.scrollTo(0,0);}}>
          <Film className="text-cyan-400" />
          <span>Neo<span className="text-cyan-400 font-light">Critics</span></span>
        </div>
        
        {/* The Search Bar */}
        <div className="hidden md:flex relative w-1/3">
          <input 
            type="text" 
            placeholder="Search any show in the world..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-cyan-400/50 transition text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          {searchLoading && <Loader2 className="absolute right-3 top-2.5 text-cyan-400 animate-spin" size={16} />}
        </div>

        <div className="hidden md:flex gap-6 text-sm font-semibold tracking-wider text-gray-400">
          <a href="#" className="hover:text-cyan-400 transition" onClick={() => setSearchQuery('')}>DISCOVER</a>
          <a href="#" className="hover:text-cyan-400 transition" onClick={() => setSearchQuery('')}>LIVE FEED</a>
        </div>
      </nav>

      {/* Hero Section */}
      {!isSearching && heroShow && (
        <main className="relative pt-32 px-6 max-w-7xl mx-auto flex flex-col items-center min-h-[80vh] md:min-h-[70vh] justify-center">
          
          <div key={heroShow.id} className="flex flex-col md:flex-row items-center gap-12 w-full hero-animate">
            <div className="flex-1 space-y-6 z-10">
              <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-xs font-bold tracking-widest">
                #{currentHeroIndex + 1} TRENDING LIVE
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                {heroShow.name.toUpperCase()}
              </h1>
              
              <div 
                className="text-gray-400 text-lg leading-relaxed max-w-lg line-clamp-3" 
                dangerouslySetInnerHTML={{ __html: heroShow.summary }} 
              />
              
              <div className="flex items-center gap-4 text-sm font-bold text-gray-300">
                <OmdbBadges imdbId={heroShow.externals?.imdb} />
                <span>|</span>
                <span>{heroShow.genres.join(' • ')}</span>
                <span>|</span>
                <span>{heroShow.premiered?.substring(0,4)}</span>
              </div>

              <div className="flex gap-4 pt-4">
                <a 
                  href={`https://cinejoy.pro/search/${heroShow.name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-cyan-400 text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-cyan-300 transition hover:scale-105 shadow-lg shadow-cyan-500/30"
                >
                  <PlayCircle size={20} /> Watch on Cinejoy
                </a>
                <button 
                  onClick={() => setSelectedShow(heroShow)}
                  className="bg-white/5 border border-white/10 px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white/10 transition"
                >
                  <Info size={20} /> View Details
                </button>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] rounded-full" />
              <img 
                src={heroShow.image?.original || heroShow.image?.medium} 
                alt={heroShow.name}
                className="relative z-10 w-full md:w-[70%] ml-auto rounded-2xl border border-white/10 shadow-2xl shadow-black/50 hover:scale-[1.02] transition duration-500 object-cover aspect-[2/3]"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3">
            {heroShows.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ` + (idx === currentHeroIndex ? 'bg-cyan-400 w-8' : 'bg-white/20 w-2 hover:bg-white/50')}
                aria-label={"Go to featured show " + (idx + 1)}
              />
            ))}
          </div>
        </main>
      )}

      {/* Top 10 Trending Slideshow (Netflix Style) */}
      {!isSearching && (
        <section className="mt-24 pl-6 md:pl-12 lg:pl-0 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2 px-6 lg:px-0">
            <h2 className="text-2xl font-bold">Top 10 Trending Shows</h2>
            <ChevronRight className="text-cyan-400" />
          </div>
          
          <div className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory py-8 px-6 lg:px-0">
            {top10Shows.map((show, idx) => (
              <div 
                key={"top10-" + show.id}
                onClick={() => setSelectedShow(show)}
                className="relative flex-shrink-0 w-[240px] md:w-[280px] snap-start cursor-pointer group flex items-end pr-4"
              >
                <div 
                  className="text-[120px] leading-none font-black text-[#050505] tracking-tighter z-10 -mr-8 -mb-4 select-none group-hover:scale-110 transition duration-500" 
                  style={{ WebkitTextStroke: '3px rgba(255,255,255,0.8)' }}
                >
                  {idx + 1}
                </div>
                
                <div className="relative w-40 md:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl z-0 bg-white/5 border border-white/10">
                  <img 
                    src={show.image?.medium} 
                    alt={show.name} 
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                    <h3 className="font-bold text-white text-sm leading-tight mb-1">{show.name}</h3>
                    <OmdbBadges imdbId={show.externals?.imdb} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scrolling Titles (Marquee) */}
      {!isSearching && (
        <section className="mt-10 border-y border-white/5 bg-white/5 py-6 overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-content flex items-center gap-12 px-6">
              {[...marqueeShows, ...marqueeShows].map((show, i) => (
                <div key={"marquee-" + show.id + "-" + i} className="flex items-center gap-4 flex-shrink-0 cursor-pointer hover:text-cyan-400 transition" onClick={() => setSelectedShow(show)}>
                  <h3 className="text-xl font-bold tracking-wide uppercase whitespace-nowrap">{show.name}</h3>
                  <span className="flex items-center gap-1 text-yellow-500 text-sm font-bold"><Star size={14} fill="currentColor"/> {show.rating?.average || '?'}</span>
                  <span className="text-white/20 ml-8 text-2xl">•</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Rated Highlights */}
      {!isSearching && (
        <section className="mt-20 px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-yellow-500" size={32} />
            <h2 className="text-3xl font-bold">Critically Acclaimed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topRatedShows.map(show => (
              <div key={show.id} onClick={() => setSelectedShow(show)} className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition cursor-pointer">
                <img src={show.image?.medium} alt={show.name} className="w-1/3 object-cover" />
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <OmdbBadges imdbId={show.externals?.imdb} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition">{show.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3" dangerouslySetInnerHTML={{ __html: show.summary }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid Section (For Discover or API Search Results) */}
      <section className="mt-20 px-6 max-w-7xl mx-auto pt-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {isSearching ? <Search className="text-cyan-400" size={32} /> : <Tv className="text-cyan-400" size={32} />}
            <h2 className="text-3xl font-bold">
              {isSearching ? 'Live Global Search Results' : 'Discover More'}
            </h2>
          </div>
          {isSearching && !searchLoading && <span className="text-cyan-400 font-bold bg-cyan-400/10 px-3 py-1 rounded-full">{searchResults.length} FOUND VIA API</span>}
        </div>
        
        {isSearching && searchLoading ? (
          <div className="flex justify-center items-center py-32">
             <Loader2 className="animate-spin text-cyan-400" size={48} />
          </div>
        ) : gridShows.length === 0 ? (
          <div className="text-center py-32 text-gray-500 text-lg">
            {isSearching ? `No API results found for "${searchQuery}"` : "Nothing to display."}
          </div>
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
                    <Star size={12} fill="currentColor" /> {show.rating?.average || '?'}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition line-clamp-1">{show.name}</h3>
                  <p className="text-gray-500 text-xs font-semibold">{show.genres?.slice(0,2).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/10 pt-10 pb-6 text-center text-gray-500">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-4 opacity-50">
          <Film className="text-cyan-400" />
          <span className="text-white">Neo<span className="text-cyan-400 font-light">Critics</span></span>
        </div>
        <p className="text-sm max-w-md mx-auto mb-6">Your ultimate guide to honest, live, and dynamic entertainment reviews, powered by the TVMaze API and OMDb API.</p>
        <div className="text-xs font-bold tracking-widest text-white/20">
          © 2026 NEO CRITICS • ENGINEERED WITH REACT
        </div>
      </footer>

      {/* Modal */}
      {selectedShow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedShow(null)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl shadow-cyan-500/10" onClick={e => e.stopPropagation()}>
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
              <div className="flex gap-4 text-sm font-bold text-gray-400 mb-6 flex-wrap items-center">
                <OmdbBadges imdbId={selectedShow.externals?.imdb} />
                <span className="bg-white/10 px-2 py-0.5 rounded">{selectedShow.premiered || 'TBD'}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">{selectedShow.status}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">{selectedShow.network?.name || selectedShow.webChannel?.name || 'Unknown Network'}</span>
              </div>
              <div className="text-gray-300 leading-relaxed mb-8 flex-1" dangerouslySetInnerHTML={{ __html: selectedShow.summary || 'No summary available.' }} />
              
              <div className="flex gap-4">
                <a 
                  href={`https://cinejoy.pro/search/${selectedShow.name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-cyan-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-300 transition text-center flex-1 flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <PlayCircle size={18} /> Watch Live (Cinejoy)
                </a>
                {selectedShow.officialSite && (
                  <a href={selectedShow.officialSite} target="_blank" rel="noreferrer" className="bg-white/10 text-white px-6 py-2 rounded-lg font-bold hover:bg-white/20 transition text-center flex-1">
                    Official Site
                  </a>
                )}
                <a href={selectedShow.url} target="_blank" rel="noreferrer" className="bg-white/5 border border-white/10 text-white px-6 py-2 rounded-lg font-bold hover:bg-white/10 transition text-center flex-1">
                  TVMaze Info
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
