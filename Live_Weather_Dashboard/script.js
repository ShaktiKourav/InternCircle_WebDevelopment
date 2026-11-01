// Open-Meteo is a free weather API and does not require an API key.
const API = {
  geocoding: "https://geocoding-api.open-meteo.com/v1/search",
  forecast: "https://api.open-meteo.com/v1/forecast"
};

const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const statusPanel = document.querySelector("#status-panel");
const statusTitle = document.querySelector("#status-title");
const statusMessage = document.querySelector("#status-message");
const weatherContent = document.querySelector("#weather-content");
const forecastGrid = document.querySelector("#forecast-grid");

const weatherDescriptions = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"], 48: ["Depositing rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Heavy drizzle", "🌧️"],
  56: ["Freezing drizzle", "🌧️"], 57: ["Freezing drizzle", "🌧️"],
  61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  66: ["Freezing rain", "🌧️"], 67: ["Heavy freezing rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "❄️"], 75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "🌨️"], 80: ["Rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"], 82: ["Heavy showers", "⛈️"],
  85: ["Snow showers", "🌨️"], 86: ["Heavy snow showers", "❄️"],
   95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"], 99: ["Thunderstorm with hail", "⛈️"]
};

function getWeatherInfo(code) {
  return weatherDescriptions[code] || ["Variable conditions", "🌤️"];
}

function showStatus(type, title, message) {
  statusPanel.className = `status-panel ${type}`;
  statusTitle.textContent = title;
  statusMessage.textContent = message;
  statusPanel.hidden = false;
}

function formatDay(dateString, index) {
  if (index === 0) return "Today";
  return new Intl.DateTimeFormat(undefined, { weekday: "short" })
    .format(new Date(`${dateString}T12:00:00`));
}

function formatLocalTime(timezone) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timezone, weekday: "long", hour: "numeric", minute: "2-digit"
    }).format(new Date());
  } catch {
    return "Local time unavailable";
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather service returned ${response.status}. Please try again.`);
  }
  return response.json();
}

async function searchCity(city) {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    weatherContent.hidden = true;
    showStatus("error", "Enter a city name", "Please type a city before searching.");
    cityInput.focus();
    return;
  }

  if (trimmedCity.length < 2 || !/^[\p{L}\p{M}\s.'-]+$/u.test(trimmedCity)) {
    weatherContent.hidden = true;
    showStatus("error", "Check your search", "Use a city name with at least 2 letters. Numbers and special symbols are not needed.");
    cityInput.focus();
    return;
  }

  searchButton.disabled = true;
  searchButton.textContent = "Loading…";
  showStatus("loading", "Finding your forecast", `Getting the latest weather for ${trimmedCity}…`);

  try {
    const geoUrl = `${API.geocoding}?name=${encodeURIComponent(trimmedCity)}&count=1&language=en&format=json`;
    const geoData = await fetchJson(geoUrl);

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`We couldn't find “${trimmedCity}”. Check the spelling or try another city.`);
    }

    const place = geoData.results[0];
    const params = new URLSearchParams({
      latitude: place.latitude,
      longitude: place.longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max",
      forecast_days: "5",
      timezone: "auto"
    });
    const weatherData = await fetchJson(`${API.forecast}?${params.toString()}`);

    renderWeather(place, weatherData);
    localStorage.setItem("skycast-last-city", trimmedCity);
    showStatus("success", "Forecast updated", `Showing current conditions and the five-day forecast for ${place.name}.`);
    weatherContent.hidden = false;
  } catch (error) {
    weatherContent.hidden = true;
    showStatus("error", "Unable to load weather", error.message || "Something went wrong. Please try again.");
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Search <span aria-hidden="true">→</span>';
  }
}

function renderWeather(place, data) {
  const current = data.current;
  const daily = data.daily;
  const [description, icon] = getWeatherInfo(current.weather_code);

  document.querySelector("#location-name").textContent =
    [place.name, place.admin1, place.country].filter(Boolean).join(", ");
  document.querySelector("#local-time").textContent = `Local time · ${formatLocalTime(data.timezone)}`;
  document.querySelector("#current-icon").textContent = icon;
  document.querySelector("#current-temp").textContent = Math.round(current.temperature_2m);
  document.querySelector("#current-description").textContent = description;
  document.querySelector("#feels-like").textContent = Math.round(current.apparent_temperature);
  document.querySelector("#humidity").textContent = current.relative_humidity_2m;
  document.querySelector("#wind-speed").textContent = Math.round(current.wind_speed_10m);
  document.querySelector("#pressure").textContent = Math.round(current.pressure_msl);
  document.querySelector("#uv-index").textContent = daily.uv_index_max?.[0] ?? "—";
  document.querySelector("#day-summary").textContent =
    current.is_day ? "Daytime conditions" : "Nighttime conditions";

  // Build forecast cards with DOM methods and textContent (not user-provided HTML).
  forecastGrid.replaceChildren();
  daily.time.forEach((date, index) => {
    const [dayDescription, dayIcon] = getWeatherInfo(daily.weather_code[index]);
    const card = document.createElement("article");
    card.className = "forecast-card";

    const day = document.createElement("div");
    day.className = "forecast-day";
    day.textContent = formatDay(date, index);

    const iconNode = document.createElement("div");
    iconNode.className = "forecast-icon";
    iconNode.textContent = dayIcon;
    iconNode.setAttribute("aria-label", dayDescription);

    const temps = document.createElement("div");
    temps.className = "forecast-temps";
    const high = document.createElement("span");
    high.textContent = `${Math.round(daily.temperature_2m_max[index])}°`;
    const low = document.createElement("span");
    low.className = "low";
    low.textContent = `${Math.round(daily.temperature_2m_min[index])}°`;
    temps.append(high, low);

    const rain = document.createElement("div");
    rain.className = "forecast-rain";
    rain.textContent = `${daily.precipitation_probability_max?.[index] ?? 0}% rain`;

    card.append(day, iconNode, temps, rain);
    forecastGrid.append(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchCity(cityInput.value);
});

// Restore the last searched city and refresh its weather on the next visit.
const lastCity = localStorage.getItem("skycast-last-city");
if (lastCity) {
  cityInput.value = lastCity;
  searchCity(lastCity);
}
