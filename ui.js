import { weatherDescription } from "./weather.js";

export function renderWeather(place, current, target) {
  const [description, icon] = weatherDescription(current.weather_code);
  target.hidden = false;
  target.innerHTML = `
    <div class="weather-main"><div class="weather-icon">${icon}</div><div><div class="weather-place">${escapeHTML(place.name)}${place.country ? ", " + escapeHTML(place.country) : ""}</div><div class="muted">${description}</div><div class="temperature">${Math.round(current.temperature_2m)}°</div><small class="muted">Feels like ${Math.round(current.apparent_temperature)}°C</small></div></div>
    <div class="weather-details"><div class="detail"><strong>${current.relative_humidity_2m}%</strong><span>HUMIDITY</span></div><div class="detail"><strong>${Math.round(current.wind_speed_10m)} km/h</strong><span>WIND</span></div><div class="detail"><strong>${current.precipitation} mm</strong><span>PRECIPITATION</span></div></div>`;
}
export function renderForecast(daily, target) {
  target.innerHTML = daily.time.map((date, i) => {
    const [description, icon] = weatherDescription(daily.weather_code[i]);
    const day = new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" });
    const rain = daily.precipitation_probability_max[i];
    return `<article class="forecast-card"><small>${day}</small><div class="f-icon">${icon}</div><strong>${Math.round(daily.temperature_2m_max[i])}° <span class="muted">${Math.round(daily.temperature_2m_min[i])}°</span></strong><small>${description}</small><br><small>☂ ${rain ?? 0}% rain chance</small></article>`;
  }).join("");
}
export function renderMovies(movies, target, onSelect) {
  target.innerHTML = "";
  movies.forEach(movie => {
    const card = document.createElement("article");
    card.className = "movie-card";
    const poster = movie.poster ? `<img src="${escapeAttr(movie.poster)}" alt="${escapeAttr(movie.title)} poster" loading="lazy">` : `<div class="poster-fallback">${escapeHTML(movie.title)}</div>`;
    card.innerHTML = `<div class="poster-wrap">${poster}</div><div class="movie-info"><h3>${escapeHTML(movie.title)}</h3><div class="movie-meta"><span>${escapeHTML(movie.year || "—")} · ${escapeHTML(movie.genre || "Movie")}</span><span class="rating">★ ${escapeHTML(movie.rating || "N/A")}</span></div></div>`;
    const img = card.querySelector("img");
    if (img) img.addEventListener("error", () => { img.parentElement.innerHTML = `<div class="poster-fallback">${escapeHTML(movie.title)}</div>`; });
    card.addEventListener("click", () => onSelect(movie));
    target.append(card);
  });
}
export function showMovieDetails(movie, dialog, target) {
  const reviews = JSON.parse(localStorage.getItem(`reviews-${movie.imdbID || movie.title}`) || "[]");
  const poster = movie.poster ? `<img src="${escapeAttr(movie.poster)}" alt="">` : `<div class="poster-fallback">Poster unavailable</div>`;
  const trailerQuery = encodeURIComponent(`${movie.title} ${movie.year || ""} official trailer`);
  target.innerHTML = `<div class="dialog-layout"><div>${poster}</div><div><h2>${escapeHTML(movie.title)}</h2><div class="movie-meta">${escapeHTML(movie.year || "")} · ${escapeHTML(movie.genre || "Movie")} · <span class="rating">★ ${escapeHTML(movie.rating || "N/A")}</span></div><p>${escapeHTML(movie.plot || "No description available.")}</p>
    <div class="watch-box"><strong>Ready to watch?</strong><p>This student demo uses a subscription-style preview gate. Full films are not hosted here. You can find official trailers and legal viewing options.</p><a href="https://www.youtube.com/results?search_query=${trailerQuery}" target="_blank" rel="noopener">Find official trailer on YouTube ↗</a></div></div></div>
    <h3>Reviews & comments</h3><div class="review-list">${reviews.length ? reviews.map(r => `<p><strong>${escapeHTML(r.name)}:</strong> ${escapeHTML(r.comment)}</p>`).join("") : "<p>No reviews yet. Be the first to share your thoughts.</p>"}</div>
    <form class="review-form" id="review-form"><input name="name" maxlength="30" placeholder="Your name" required><textarea name="comment" maxlength="500" placeholder="Write a review or comment..." required></textarea><button class="btn movie-btn" type="submit">Post review</button></form>`;
  target.querySelector("#review-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = JSON.parse(localStorage.getItem(`reviews-${movie.imdbID || movie.title}`) || "[]");
    next.unshift({ name: form.get("name").trim(), comment: form.get("comment").trim() });
    localStorage.setItem(`reviews-${movie.imdbID || movie.title}`, JSON.stringify(next.slice(0, 30)));
    showMovieDetails(movie, dialog, target);
  });
  if (!dialog.open) dialog.showModal();
}
function escapeHTML(value = "") { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function escapeAttr(value = "") { return escapeHTML(value); }