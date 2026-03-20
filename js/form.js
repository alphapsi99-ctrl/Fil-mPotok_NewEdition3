
async function searchMovie() {
    const input = document.getElementById("movieInput");
    const btn = document.getElementById("submitBtn"); // или addBtn
    const query = input.value.trim();

    if (query.length < 2) {
        alert("Введите хотя бы 2 символа для поиска");
        return;
    }

    // Визуальный отклик
    btn.disabled = true;
    btn.innerText = "Поиск...";

    try {
        // Добавляем параметр include_adult=false для чистоты поиска
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=ru-RU&include_adult=false`;
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Ошибка сервера API");

        const data = await response.json();

        // Фильтруем: только фильмы или сериалы, у которых есть постер
        const result = data.results.find(i => 
            (i.media_type === "movie" || i.media_type === "tv") && i.poster_path
        );

        if (result) {
            // Формируем объект для хранения
            const movieData = {
                id: Date.now().toString(), // Уникальный ID (требование 4.2)
                tmdbId: result.id,
                title: result.title || result.name,
                type: result.media_type,
                poster: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
                rating: result.vote_average.toFixed(1),
                watched: false
            };

            // Сохраняем (через функцию из storage.js)
            saveToLocalStorage(movieData);
            
            alert(`"${movieData.title}" добавлен в список!`);
            window.location.href = "index.html"; // Уходим на главную
        } else {
            alert("Ничего не найдено. Попробуйте уточнить название.");
        }
    } catch (error) {
        console.error("Ошибка поиска:", error);
        alert("Произошла ошибка при поиске. Проверьте интернет или API ключ.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Найти и сохранить";
    }
}

// Вспомогательная функция сохранения
function saveToLocalStorage(movie) {
    let movies = JSON.parse(localStorage.getItem("myCinemaList")) || [];
    movies.push(movie);
    localStorage.setItem("myCinemaList", JSON.stringify(movies));
}