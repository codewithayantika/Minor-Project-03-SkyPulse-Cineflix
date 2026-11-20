// Poster images are served from TMDB's public image CDN. Add an OMDb key in config.js for live title search.
export const sampleMovies = [
 {title:"The Dark Knight",year:"2008",genre:"English",rating:"9.0",poster:"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",plot:"Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy.",imdbID:"tt0468569"},
 {title:"Inception",year:"2010",genre:"English",rating:"8.8",poster:"https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",plot:"A skilled thief enters people's dreams to steal secrets and is offered a chance at redemption.",imdbID:"tt1375666"},
 {title:"Interstellar",year:"2014",genre:"English",rating:"8.7",poster:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",plot:"Explorers travel beyond this galaxy to discover whether mankind has a future among the stars.",imdbID:"tt0816692"},
 {title:"3 Idiots",year:"2009",genre:"Hindi",rating:"8.4",poster:"https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",plot:"Three engineering students navigate friendship, pressure and the meaning of success.",imdbID:"tt118 ramp"},
 {title:"Dangal",year:"2016",genre:"Hindi",rating:"8.3",poster:"https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg",plot:"A former wrestler trains his daughters to become world-class wrestlers.",imdbID:"tt5074352"},
 {title:"Pather Panchali",year:"1955",genre:"Bengali",rating:"8.2",poster:"",plot:"A moving portrait of a rural Bengali family seen through the eyes of young Apu.",imdbID:"tt0048473"},
 {title:"Chokher Bali",year:"2003",genre:"Bengali",rating:"7.1",poster:"",plot:"A period drama about love, jealousy and social expectations in Bengal.",imdbID:"tt0363226"},
 {title:"Spirited Away",year:"2001",genre:"Cartoon",rating:"8.6",poster:"https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",plot:"A young girl enters a mysterious world of spirits and must find a way to save her parents.",imdbID:"tt0245429"},
 {title:"Toy Story",year:"1995",genre:"Cartoon",rating:"8.3",poster:"https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",plot:"A cowboy toy feels threatened when a space ranger becomes the new favourite toy.",imdbID:"tt0114709"},
 {title:"Spider-Man: Into the Spider-Verse",year:"2018",genre:"Cartoon",rating:"8.4",poster:"https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",plot:"Miles Morales discovers a multiverse of Spider-heroes and learns what it means to wear the mask.",imdbID:"tt4633694"}
];
const key = window.APP_CONFIG?.OMDB_API_KEY;
export async function searchMovies(query) {
  if (!key || key === "YOUR_OMDB_API_KEY") {
    const local = sampleMovies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()));
    if (local.length) return local;
    throw new Error("Live search needs a free OMDb API key. Add it to config.js; the included sample collection is available without a key.");
  }
  const response = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}&s=${encodeURIComponent(query)}&type=movie`);
  if (!response.ok) throw new Error("Movie search is temporarily unavailable.");
  const data = await response.json();
  if (data.Response === "False") return [];
  const details = await Promise.all(data.Search.slice(0, 12).map(async item => {
    const r = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(key)}&i=${item.imdbID}&plot=short`);
    const d = await r.json();
    const title = d.Title || item.Title;
    return { title, year: d.Year || item.Year, genre: guessGenre(d.Genre, d.Language, title), rating: d.imdbRating || "N/A", poster: validPoster(d.Poster), plot: d.Plot || "No description is available.", imdbID: item.imdbID };
  }));
  return details;
}
function validPoster(url) { return url && url !== "N/A" ? url : ""; }
function guessGenre(genres = "", language = "", title = "") {
  const text = `${genres} ${language} ${title}`.toLowerCase();
  if (/animation|cartoon|family/.test(text)) return "Cartoon";
  if (/bengali|bangla/.test(text)) return "Bengali";
  if (/hindi/.test(text)) return "Hindi";
  return "English";
}