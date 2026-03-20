const Storage = {
    // Получение списка фильмов
    getMovies() {
        return JSON.parse(localStorage.getItem("myCinemaList")) || [];
    },

    // Сохранение списка
    saveMovies(movies) {
        localStorage.setItem("myCinemaList", JSON.stringify(movies));
    },

    // Добавление нового элемента с уникальным ID (требование 4.2)
    addMovie(item) {
        const movies = this.getMovies();
        const newMovie = {
            id: Date.now().toString(), // Уникальный ID
            tmdbId: item.id,
            title: item.title || item.name,
            type: item.media_type,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750',
            rating: item.vote_average ? item.vote_average.toFixed(1) : "0.0",
            watched: false // Состояние по умолчанию 
        };
        movies.push(newMovie);
        this.saveMovies(movies);
    },

    // Удаление фильма
    deleteMovie(id) {
        const movies = this.getMovies().filter(m => m.id !== id);
        this.saveMovies(movies);
    },

    // Изменение статуса "Просмотрено" 
    toggleWatched(id) {
        const movies = this.getMovies().map(m => 
            m.id === id ? { ...m, watched: !m.watched } : m
        );
        this.saveMovies(movies);
    }
};