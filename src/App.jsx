import { useState, useEffect } from 'react'
import { PlayCircle, Info, Star, Search, Loader2, Tv, Film, X } from 'lucide-react'

// Constants
const TMDB_KEY = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

// Live Rating Badge Component (OMDb + TMDB)
const OmdbBadges = ({ tmdbId, type, voteAverage }) => {
  const [omdbData, setOmdbData] = useState(null);

  useEffect(() => {
    if (!tmdbId || !type) return;
    
    fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids?api_key=${TMDB_KEY}`)
      .then(res => res.json())
      .then(ext => {
        if (ext.imdb_id) {
          return fetch(`https://www.omdbapi.com/?i=${ext.imdb_id}&apikey=thewdb`);
        }
        throw new Error('No IMDB ID');
      })
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.Response === "True") setOmdbData(data);
      })
      .catch(() => {});
  }, [tmdbId, type]);

  const rtRating = omdbData?.Ratings?.find(r => r.Source === "Rotten Tomatoes")?.Value;

  return (
    <>
      <div className="flex items-center gap-1 bg-[#f5c518] text-black px-2 py-0.5 rounded font-black">
        IMDb {omdbData?.imdbRating || (voteAverage ? (voteAverage).toFixed(1) : '?')}
      </div>
      {rtRating && (
        <div className="flex items-center gap-1 bg-[#fa320a] text-white px-2 py-0.5 rounded font-bold">
          \uD83C\uDF45 {rtRating}
        </div>
      )}
    </>
  );
};

const normalizeTmdb = (item) => ({
  id: item.id,
  name: item.title || item.name,
  image: {
    original: item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : null,
    medium: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
  },
  backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
  summary: item.overview,
  premiered: item.release_date || item.first_air_date,
  type: item.media_type || (item.title ? 'movie' : 'tv'),
  vote_average: item.vote_average,
  tmdbId: item.id
});

const getCinejoyLink = (show) => {
  if (!show) return '#';
  const slug = show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `https://cinejoy.pro/${show.type}/${show.tmdbId}-${slug}/watch`;
};

function App() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedShow, setSelectedShow] = useState(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  
  const [heroIndex, setHeroIndex] = useState(Math.floor(Math.random() * 5))

  // 1. Fetch TMDB Trending Data
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}`)
      .then(res => res.json())
      .then(data => {
        const validItems = data.results
          .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
          .map(normalizeTmdb);
        setShows(validItems);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load:", err);
        setLoading(false);
      });
  }, []);

  // 2. Auto-rotate hero slideshow
  useEffect(() => {
    if (shows.length === 0 || isSearching) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % Math.min(5, shows.length));
    }, 7000);
    return () => clearInterval(interval);
  }, [shows, isSearching]);

  // 3. Live TMDB API Search (with Debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setSearchLoading(true);
    
    const debounceTimer = setTimeout(() => {
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          const results = data.results
            .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
            .map(normalizeTmdb); 
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
        <h1 className="text-2xl font-bold tracking-widest">LOADING TMDB DATA...</h1>
      </div>
    )
  }

  const heroShow = shows[heroIndex]
  const topRatedShows = shows.slice(5, 9)
  const gridShows = isSearching ? searchResults : shows.slice(9)

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
          <Film className="text-cyan-400" />
          <span>Neo<span className="text-cyan-400 font-light">Critics</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-400 transition" size={18} />
            <input 
              type="text" 
              placeholder="Search Live (Movies, TV, Anime)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 w-64 md:w-96 focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition text-sm"
            />
          </div>
          <button className="hidden md:block bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-full text-sm font-bold">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section Slideshow (Hide during search) */}
      {!isSearching && heroShow && (
        <section className="relative pt-24 pb-12 px-6 lg:pt-32 lg:pb-20 min-h-[85vh] flex flex-col lg:flex-row gap-12 items-center max-w-7xl mx-auto">
          {/* Dynamic Background Image */}
          <div className="absolute inset-0 z-[-1] opacity-20">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent z-10" />
            {heroShow.backdrop && (
              <img src={heroShow.backdrop} alt="backdrop" className="w-full h-full object-cover object-top blur-sm scale-105" />
            )}
          </div>

          <div className="flex-1 space-y-6 z-10">
            <div className="inline-block bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              #1 Trending {heroShow.type === 'movie' ? 'Movie' : 'TV Show'}
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              {heroShow.name}
            </h1>
            
            <div className="flex items-center gap-4 text-sm font-bold text-gray-400 flex-wrap">
              <OmdbBadges tmdbId={heroShow.tmdbId} type={heroShow.type} voteAverage={heroShow.vote_average} />
              <span className="bg-white/10 px-2 py-0.5 rounded uppercase">{heroShow.type}</span>
              <span className="bg-white/10 px-2 py-0.5 rounded">{heroShow.premiered || 'TBD'}</span>
            </div>

            <p 
              className="text-lg text-gray-300 leading-relaxed max-w-2xl line-clamp-4"
              dangerouslySetInnerHTML={{ __html: heroShow.summary}}
            />

            <div className="flex gap-4 pt-4">
              <a 
                href={getCinejoyLink(heroShow)}
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

            {/* Slideshow Indicators */}
            <div className="flex gap-2 pt-8">
              {[0, 1, 2, 3, 4].map(idx => (
                <button 
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === heroIndex ? 'w-8 bg-cyan-400' : 'w-4 bg-white/20'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 w-full max-w-sm lg:max-w-md relative z-10">
            <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl rounded-full z-0" />
            <img 
              src={heroShow.image?.original || heroShow.image?.medium} 
              alt={heroShow.name} 
              className="w-full rounded-2xl shadow-2xl relative z-10 border border-white/10 rotate-2 hover:rotate-0 transition duration-500" 
            />
          </div>
        </section>
      )}

      {/* Top Rated Sidebar / Row (Hide during search) */}
      {!isSearching && (
        <section className="px-6 max-w-7xl mx-auto -mt-10 relative z-20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-gray-400">
            <Star className="text-yellow-500" size={20} /> Top Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topRatedShows.map(show => (
              <div key={show.id} onClick={() => setSelectedShow(show)} className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition cursor-pointer">
                <img src={show.image?.medium} alt={show.name} className="w-1/3 object-cover" />
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 scale-90 origin-left">
                    <OmdbBadges tmdbId={show.tmdbId} type={show.type} voteAverage={show.vote_average} />
                  </div>
                  <h3 className="text-md font-bold mb-1 text-white group-hover:text-cyan-400 transition line-clamp-1">{show.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2" dangerouslySetInnerHTML={{ __html: show.summary}} />
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
            {isSearching ? <Search className="text-cyan-400" size={32} /> : <Film className="text-cyan-400" size={32} />}
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
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-yellow-500 font-bold text-xs uppercase">
                    <Star size={12} fill="currentColor" /> {(show.vote_average || 0).toFixed(1)}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition line-clamp-1">{show.name}</h3>
                  <p className="text-gray-500 text-xs font-semibold uppercase">{show.type}</p>
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
        <p className="text-sm max-w-md mx-auto mb-6">Your ultimate guide to honest, live, and dynamic entertainment reviews, powered by TMDB API and OMDb API.</p>
        <div className="text-xs font-bold tracking-widest text-white/20">
          (C) 2026 NEO CRITICS • ENGINEERED WITH REACT
        </div>
      </footer>

      {/* Modal */}
      {selectedShow && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setSelectedShow(null)}>
          <div className={`bg-[#0a0a0a] border border-white/10 rounded-2xl-w-full ${selectedShow.isPlaying ? 'max-w-6xl aspect-video' : 'max-w-4xl max-h-[90vh]'} overflow-hidden relative flex flex-col md:flex-row shadow-2xl shadow-cyan-500/20`} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedShow(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-red-500 p-2 rounded-full text-white transition z-50"
            >
              <X size={24} />
            </button>

            {selectedShow.isPlaying ? (
              <div className="w-full h-full bg-black">
                <iframe
                  src={`https://vidsrc.to/embed/${selectedShow.type}/${selectedShow.tmdbId}`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  title="Live Stream Player"
                ></iframe>
              </div>
            ) : (
              <>
                <div className="w-full md:w-2/5 relative group cursor-pointer" onClick={() => setSelectedShow({ ...selectedShow, isPlaying: true })}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition duration-300 z-10 flex items-center justify-center">
                    <PlayCircle size={64} className="text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 group-hover:text-cyan-400 transition duration-300" />
                  </div>
                  <img src={selectedShow.image?.original || selectedShow.image?.medium} alt={selectedShow.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 md:w-3/5 flex flex-col overflow-y-auto">
                  <h2 className="text-4xl font-black mb-2">{selectedShow.name}</h2>
                  <div className="flex gap-4 text-sm font-bold text-gray-400 mb-6 flex-wrap items-center">
                    <OmdbBadges tmdbId={selectedShow.tmdbId} type={selectedShow.type} voteAverage={selectedShow.vote_average} />
                    <span className="bg-white/10 px-2 py-0.5 rounded uppercase">{selectedShow.type}</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded">{selectedShow.premiered || 'TBD'}</span>
                  </div>
                  <div className="text-gray-300 leading-relaxed mb-8 flex-1" dangerouslySetInnerHTML={{ __html: selectedShow.summary || 'No summary available.' }} />
                  
                  <div className="flex gap-4 mt-auto">
                    <a 
                      href={getCinejoyLink(selectedShow)}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-cyan-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-cyan-300 transition text-center flex-1 flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <PlayCircle size={20} /> Watch on Cinejoy
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App