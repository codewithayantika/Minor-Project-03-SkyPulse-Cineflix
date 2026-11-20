# Minor Project 03 — SkyPulse × Cineflix

A responsive two-in-one web project built with HTML5, CSS3 and vanilla JavaScript ES6+.

## Features

### SkyPulse
- Search current weather by city.
- Use browser location (with permission).
- Current temperature, feels-like temperature, humidity, wind and precipitation.
- Five-day outlook with daily high/low temperatures and rain probability.
- Friendly error messages for unknown cities and network errors.
- Uses the free Open-Meteo geocoding and forecast APIs. No API key required.

### Cineflix
- Sample English, Hindi, Bengali and cartoon/animation collection included.
- Movie poster artwork, year, category, rating and short plot.
- Search sample titles immediately.
- Optional live movie search with a free OMDb API key.
- Genre filters, movie detail view and locally saved user reviews/comments.
- Watch panel links to official trailer search and explains that full copyrighted films are not hosted.

## Run on your laptop

1. Extract the ZIP file.
2. Open the extracted folder in VS Code.
3. Recommended: install the **Live Server** extension.
4. Right-click `index.html` → **Open with Live Server**.
5. The page opens in your browser. SkyPulse loads a Kolkata forecast by default; search another city to test it.

You can also use a local development server. Because the JavaScript uses ES modules, do not open `index.html` directly with a `file://` URL.

## Enable live movie search (optional)

1. Visit https://www.omdbapi.com/apikey.aspx and request a free API key.
2. Open `config.js`.
3. Replace `YOUR_OMDB_API_KEY` with your key.
4. Save and refresh the site.

Without a key, the included sample movie catalogue and matching searches still work. OMDb's free tier and availability may have limits.

## Deploy to GitHub Pages

1. Create a new public GitHub repository, for example `minor-project-03`.
2. Upload the extracted project files and folders. Keep `index.html`, `styles.css`, `config.js`, and the `js` folder in the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages URL to appear. Open it and test both apps on mobile and desktop.

## APIs and learning objectives

- Open-Meteo Geocoding API: city lookup.
- Open-Meteo Forecast API: current and daily weather.
- OMDb API: optional live movie search and metadata.
- `fetch`, `async/await`, Promises, ES modules, destructuring, template literals, DOM updates, form events, error handling and responsive CSS.

## Important notes

- Poster URLs require an internet connection. If a poster cannot load, the card shows a title fallback rather than a broken image.
- The movie watch area is a demonstration, not a streaming service. It does not unlock or provide full copyrighted films. Use licensed streaming services for full movies.
- Reviews are stored in the browser's `localStorage` on the device where they are posted. They are not shared between visitors.
- Do not publish private API keys in a public repository. For a classroom demo, use a restricted/demo key and understand that a key placed in frontend JavaScript is visible to visitors.
