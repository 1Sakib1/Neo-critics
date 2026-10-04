// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Dynamic Trending Movies
const movies = [
    { 
        title: 'Oppenheimer', 
        rating: '4.8', 
        genre: 'Biography', 
        img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800', 
        desc: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.' 
    },
    { 
        title: 'The Batman', 
        rating: '4.7', 
        genre: 'Action', 
        img: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800', 
        desc: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.' 
    },
    { 
        title: 'Interstellar', 
        rating: '4.9', 
        genre: 'Sci-Fi', 
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800', 
        desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.' 
    },
    { 
        title: 'Inception', 
        rating: '4.9', 
        genre: 'Sci-Fi', 
        img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800', 
        desc: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task.' 
    },
    { 
        title: 'Blade Runner 2049', 
        rating: '4.6', 
        genre: 'Sci-Fi', 
        img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800', 
        desc: 'A young blade runner\'s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.' 
    }
];

const carousel = document.getElementById('carousel');
movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${movie.img}" alt="${movie.title}">
        <div class="card-info">
            <h3>${movie.title}</h3>
            <div class="meta">
                <span><i class="fa-solid fa-star"></i> ${movie.rating}</span>
                <span><i class="fa-solid fa-film"></i> ${movie.genre}</span>
            </div>
            <div class="desc">${movie.desc}</div>
        </div>
    `;
    carousel.appendChild(card);
});

// Carousel Scroll Logic
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
let scrollPosition = 0;

nextBtn.addEventListener('click', () => {
    const cardWidth = carousel.querySelector('.movie-card').offsetWidth + 35; // card width + gap
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    scrollPosition = Math.min(scrollPosition + cardWidth, maxScroll);
    carousel.style.transform = `translateX(-${scrollPosition}px)`;
});

prevBtn.addEventListener('click', () => {
    const cardWidth = carousel.querySelector('.movie-card').offsetWidth + 35;
    scrollPosition = Math.max(scrollPosition - cardWidth, 0);
    carousel.style.transform = `translateX(-${scrollPosition}px)`;
});

// Dynamic Critics
const critics = [
    { name: 'Sarah Jenkins', role: 'Lead Critic', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200', rep: 'Top 1%' },
    { name: 'Marcus Chen', role: 'Indie Specialist', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200', rep: 'Top 5%' },
    { name: 'Elena Rodriguez', role: 'Cinematography', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200', rep: 'Top 2%' },
    { name: 'David Kim', role: 'Blockbuster Analyst', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200', rep: 'Top 10%' }
];

const criticsGrid = document.getElementById('criticsGrid');
critics.forEach(critic => {
    const card = document.createElement('div');
    card.className = 'critic-card fade-in';
    card.innerHTML = `
        <img src="${critic.img}" alt="${critic.name}">
        <h3>${critic.name}</h3>
        <p>${critic.role}</p>
        <span class="rep">${critic.rep} Reviewer</span>
    `;
    criticsGrid.appendChild(card);
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once it's visible
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements after a slight delay to allow DOM to render
setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}, 100);
