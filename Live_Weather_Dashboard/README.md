# SkyCast — Live Weather Dashboard

A responsive weather dashboard built with HTML, CSS and vanilla JavaScript. It uses the free Open-Meteo Geocoding and Forecast APIs; no API key or installation is required.

## Features
- Search for a city and fetch its coordinates using the Open-Meteo Geocoding API.
- Fetch current temperature, feels-like temperature, weather condition, humidity, wind, pressure and UV index.
- Five-day forecast with weather icons, high/low temperatures and precipitation probability.
- Async JavaScript with `fetch()` / `async` / `await`.
- Checks `response.ok` before parsing JSON.
- Validates empty, too-short and invalid city input.
- Friendly loading, success and error states.
- Uses `encodeURIComponent()` and `URLSearchParams` when building API requests.
- Builds forecast cards dynamically with DOM methods and `textContent`.
- Remembers the last searched city in localStorage and reloads it on the next visit.
- Responsive mobile layout and reduced-motion support.

## Run locally
1. create folder 
2. Open the folder in VS Code.
3. Open `index.html` in a browser, or use the VS Code Live Server extension.
4. Make sure you have an internet connection because the weather data comes from Open-Meteo.

## Error handling
- Empty search: asks the user to enter a city.
- Invalid characters or too-short input: displays a validation message.
- Unknown city: explains that the city could not be found.
- API/network/server error: displays a friendly error message.
- Loading state: disables the search button while data is being fetched.
- JSON is parsed only after checking `response.ok`.

## API endpoints
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`
- Documentation: https://open-meteo.com/en/docs

## Files
- `index.html` — page structure
- `style.css` — responsive styling and animations
- `script.js` — API calls, validation, error handling and dynamic rendering

## Before submitting
Test a valid city (for example, London), an unknown city, and an empty search. Check the layout at phone width. Upload the project to a public GitHub repository and deploy the same folder using GitHub Pages or Netlify for a live demo.
