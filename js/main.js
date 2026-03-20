const API_KEY = "dd0bd50a39b699800aac514137f3cdb5";
let myMovies = JSON.parse(localStorage.getItem("myCinemaList")) || [];
let currentMovie = null;
let currentEpisode = 1;
let currentSource = 1;

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("myMoviesGrid")) {
        render();
    }
    const addBtn = document.getElementById("addBtn") || document.getElementById("submitBtn");
    if (addBtn) addBtn.onclick = () => window.searchMovie();
});

// ПОИСК И ДОБАВЛЕНИЕ
window.searchMovie = async function() {
    const input = document.getElementById("movieInput");
    if (!input) return;
    const query = input.value.trim();
    if (query.length < 2) return;

    try {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU`;
        const response = await fetch(url);
        const data = await response.json();
        const result = data.results.find(i => (i.media_type === "movie" || i.media_type === "tv") && i.poster_path);

        if (result) {
            myMovies = JSON.parse(localStorage.getItem("myCinemaList")) || [];
            myMovies.push({
                id: Date.now().toString(),
                tmdbId: result.id,
                title: result.title || result.name,
                type: result.media_type,
                poster: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
                rating: result.vote_average ? result.vote_average.toFixed(1) : "0.0",
                watched: false
            });
            localStorage.setItem("myCinemaList", JSON.stringify(myMovies));
            render();
            input.value = "";
        }
    } catch (e) { console.error("Ошибка поиска:", e); }
};

// РАБОТА ПЛЕЕРА
window.openPlayer = (id) => {
    myMovies = JSON.parse(localStorage.getItem("myCinemaList")) || [];
    currentMovie = myMovies.find(m => m.id == id);
    if (!currentMovie) return;

    currentEpisode = 1;
    currentSource = 1;

    document.getElementById("modalTitle").innerText = currentMovie.title;
    const epControls = document.getElementById("epControls");
    if (epControls) epControls.style.display = currentMovie.type === "tv" ? "flex" : "none";

    updateVideo();
    document.getElementById("playerModal").style.display = "flex";
};

window.changeSource = (s) => {
    currentSource = s;
    [1, 2, 3].forEach(i => {
        const btn = document.getElementById(`src${i}`);
        if (btn) btn.classList.toggle("active", i === s);
    });
    updateVideo();
};

window.changeEpisode = (step) => {
    currentEpisode = Math.max(1, currentEpisode + step);
    updateVideo();
};

window.closePlayer = () => {
    document.getElementById("playerModal").style.display = "none";
    document.getElementById("videoPlayer").src = "";
};

function updateVideo() {
    if (!currentMovie) return;
    const iframe = document.getElementById("videoPlayer");
    const display = document.getElementById("currentEpisodeDisplay");
    
    if (display) display.innerText = currentEpisode;

    const id = currentMovie.tmdbId;
    const type = currentMovie.type;
    
    let url = "";

    // Используем проверенные временем прямые вставки
    if (currentSource === 1) {
        url = `https://vidsrc.to/embed/${type}/${id}${type === 'tv' ? '/' + currentEpisode : ''}`;
    } else if (currentSource === 2) {
        url = `https://vidsrc.me/embed/${type}?tmdb=${id}${type === 'tv' ? '&s=1&e=' + currentEpisode : ''}`;
    } else {
        url = `https://vidsrc.xyz/embed/${type}/${id}${type === 'tv' ? '/1/' + currentEpisode : ''}`;
    }
    
    iframe.src = url;
}

// ОТРИСОВКА КАРТОЧЕК
function render() {
    const grid = document.getElementById("myMoviesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    myMovies = JSON.parse(localStorage.getItem("myCinemaList")) || [];

    myMovies.forEach((m) => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
            <button class="delete-btn" onclick="window.deleteMovie('${m.id}')">✕</button>
            <img src="${m.poster}" onclick="window.openPlayer('${m.id}')">
            <div class="movie-info">
                <div class="movie-title">${m.title}</div>
                <div style="display:flex; justify-content: space-between; align-items: center; margin-top:10px;">
                   <span>⭐ ${m.rating}</span>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

window.deleteMovie = (id) => {
    myMovies = myMovies.filter(m => m.id != id);
    localStorage.setItem("myCinemaList", JSON.stringify(myMovies));
    render();
};