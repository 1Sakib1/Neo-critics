# Neo Critics 🍿

![Neo Critics Hero](public/hero.png) <!-- Replace with actual screenshot path later if added -->

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TMDB API](https://img.shields.io/badge/TMDB-API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Neo Critics** is a modern, high-performance web application designed for entertainment discovery. It provides live trending data, ratings, and streaming links for movies, TV shows, and anime. Powered by real-time data from **TMDB (The Movie Database)** and **OMDb**, the platform offers a sleek, cinematic UI built with **React** and **Tailwind CSS**.

---

## ✨ Features

- **Global Trending Dashboard:** Automatically fetches the top trending movies, TV shows, and anime globally every week.
- **Cinematic UI:** A beautiful, responsive design with immersive full-screen backdrop slideshows and glassmorphism styling.
- **Live Search API:** Search across the entire TMDB multi-search index seamlessly in real-time.
- **Dynamic Rating Badges:** Automatically queries OMDb to fetch and display cross-platform scores (IMDb and Rotten Tomatoes) for TMDB items.
- **Direct Streaming Integration:** Instantly directs users to external streaming sources (like Cinejoy) or supports native iframe embedding.
- **Automated CI/CD Deployment:** Automatically deploys to GitHub pages on every push to the `main` branch using GitHub Actions.

## 🚀 Tech Stack

- **Frontend:** React 19 (Hooks, Functional Components)
- **Styling:** Tailwind CSS 4 (Utility-first CSS)
- **Icons:** Lucide React
- **Build Tool:** Vite 8 (Ultra-fast HMR and optimized builds)
- **Data Sources:** 
  - [TMDB API](https://developer.themoviedb.org/docs) (Trending & Search)
  - [OMDb API](https://www.omdbapi.com/) (IMDb / Rotten Tomatoes Ratings)
- **Deployment:** GitHub Pages & Actions

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/1Sakib1/Neo-critics.git
   cd Neo-critics
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🌐 Live Demo

Check out the live site here: **[Neo Critics Live](https://1Sakib1.github.io/Neo-critics/)**

## 📜 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/1Sakib1/Neo-critics/issues).
