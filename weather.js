const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getCoordinates(city) {
  const response = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!response.ok) throw new Error("Weather location search is temporarily unavailable.");
  const data = await response.json();
  if (!data.results?.length) throw new Error(`We couldn't find "${city}". Try a nearby city name.`);
  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}
export async function getWeather(latitude, longitude) {
  const url = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not retrieve the forecast. Please try again later.");
  return response.json();
}
export function weatherDescription(code) {
  if (code === 0) return ["Clear sky", "☀️"];
  if ([1, 2].includes(code)) return ["Mainly clear / partly cloudy", "🌤️"];
  if (code === 3) return ["Overcast", "☁️"];
  if ([45, 48].includes(code)) return ["Foggy", "🌫️"];
  if ([51, 53, 55, 56, 57].includes(code)) return ["Drizzle", "🌦️"];
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ["Rain showers", "🌧️"];
  if ([71, 73, 75, 77, 85, 86].includes(code)) return ["Snow", "❄️"];
  if ([95, 96, 99].includes(code)) return ["Thunderstorm", "⛈️"];
  return ["Variable conditions", "🌥️"];
}