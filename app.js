import { getCoordinates, getWeather } from "./weather.js";
import { searchMovies, sampleMovies } from "./movies.js";
import { renderWeather, renderForecast, renderMovies, showMovieDetails } from "./ui.js";

const weatherForm = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const weatherMessage = document.querySelector("#weather-message");
const currentWeather = document.querySelector("#current-weather");
const forecastEl = document.querySelector("#forecast");
const movieForm = document.querySelector("#movie-form");
const movieInput = document.querySelector("#movie-input");
const movieMessage = document.querySelector("#movie-message");
const movieGrid = document.querySelector("#movie-grid");
let activeGenre = "All";
let currentMovies = sampleMovies;

async function loadWeather(city) {
  weatherMessage.textContent = "Finding the latest forecast...";
  currentWeather.hidden = true;
  forecastEl.innerHTML = "";
  try {
    const place = await getCoordinates(city);
    const data = await getWeather(place.latitude, place.longitude);
    renderWeather(place, data.current, currentWeather);
    renderForecast(data.daily, forecastEl);
    weatherMessage.textContent = `Weather information for ${place.name}${place.country ? ", " + place.country : ""}.`;
  } catch (error) {
    weatherMessage.textContent = error.message || "Could not load weather. Please try again.";
  }
}

weatherForm.addEventListener("submit", event => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) loadWeather(city);
});

document.querySelector("#use-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    weatherMessage.textContent = "Location is not supported by this browser. Search by city instead.";
    return;
  }
  weatherMessage.textContent = "Requesting your location...";
  navigator.geolocation.getCurrentPosition(async position => {
    try {
      const { latitude, longitude } = position.coords;
      const data = await getWeather(latitude, longitude);
      const place = { name: "Your location", country: "" };
      renderWeather(place, data.current, currentWeather);
      renderForecast(data.daily, forecastEl);
      weatherMessage.textContent = "Showing weather near your current location.";
    } catch (error) { weatherMessage.textContent = error.message; }
  }, () => { weatherMessage.textContent = "Location permission was not granted. Search by city instead."; });
});

function refreshMovieGrid() {
  const filtered = activeGenre === "All" ? currentMovies : currentMovies.filter(movie => movie.genre === activeGenre);
  renderMovies(filtered, movieGrid, openMovie);
  if (!filtered.length) movieMessage.textContent = `No ${activeGenre.toLowerCase()} movies in these results. Try another genre or search.`;
}
function openMovie(movie) {
  showMovieDetails(movie, document.querySelector("#movie-dialog"), document.querySelector("#dialog-content"));
}
movieForm.addEventListener("submit", async event => {
  event.preventDefault();
  const query = movieInput.value.trim();
  if (!query) return;
  movieMessage.textContent = "Searching the movie database...";
  try {
    const results = await searchMovies(query);
    currentMovies = results;
    activeGenre = "All";
    document.querySelectorAll(".genre-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.genre === "All"));
    refreshMovieGrid();
    movieMessage.textContent = results.length ? `${results.length} result(s) for "${query}".` : `No movies found for "${query}". Check the spelling and try again.`;
  } catch (error) {
    movieMessage.textContent = error.message;
  }
});
document.querySelector("#genre-filters").addEventListener("click", event => {
  const chip = event.target.closest(".genre-chip");
  if (!chip) return;
  activeGenre = chip.dataset.genre;
  document.querySelectorAll(".genre-chip").forEach(item => item.classList.toggle("active", item === chip));
  refreshMovieGrid();
});
document.querySelector("#close-dialog").addEventListener("click", () => document.querySelector("#movie-dialog").close());
document.querySelector("#movie-dialog").addEventListener("click", event => {
  if (event.target.id === "movie-dialog") event.target.close();
});

refreshMovieGrid();
loadWeather("Kolkata");