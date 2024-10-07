const API_URL = 'https://api.open-meteo.com/v1/forecast';
const UPDATE_INTERVAL = 900000;

const locations = [
  {id: 'location1', name: 'Tokyo', lat: 35.6895, lon: 139.6917},
  {id: 'location2', name: 'New York', lat: 40.7128, lon: -74.0060},
  {id: 'location3', name: 'London', lat: 51.5074, lon: -0.1278},
  {id: 'location4', name: 'Sydney', lat: -33.8688, lon: 151.2093},
  {id: 'location5', name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729}
];

// fetch request, with error catching
function fetchWeatherData(location) {
  const url = `${API_URL}?latitude=${location.lat}&longitude=${
      location.lon}&current_weather=true`;

  fetch(url)
      .then(response => response.json())
      .then(data => {
        updateWeatherDisplay(location, data);
      })
      .catch(error => {
        console.error(
            `Error fetching weather data for ${location.name}:`, error);
        document.querySelector(`#${location.id} .loading`).textContent =
            'Error loading weather data. Please try again later.';
      });
}

function updateWeatherDisplay(location, data) {
  const weatherData = data.current_weather;
  const displayElement =
      document.querySelector(`#${location.id} .weather-data`);

  displayElement.innerHTML = `
        <p>Temperature: <span>${weatherData.temperature}°C</span></p>
        <p>Wind Speed: <span>${weatherData.windspeed} km/h</span></p>
        <p>Wind Direction: <span>${weatherData.winddirection}°</span></p>
        <p>Weather: <span>${
      getWeatherDescription(weatherData.weathercode)}</span></p>
        <p>Last Updated: <span>${
      new Date(weatherData.time).toLocaleString()}</span></p>
    `;

  document.querySelector(`#${location.id} .loading`).style.display = 'none';
  displayElement.style.display = 'block';
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm',
  };
  return weatherCodes[code] || `Unknown (Code: ${code})`;
}

// updates the weather, based on the 90000 ms timer
function initWeatherUpdates() {
  locations.forEach(location => {
    fetchWeatherData(location);
  });
  setInterval(() => {
    locations.forEach(location => {
      fetchWeatherData(location);
    });
  }, UPDATE_INTERVAL);
}

document.addEventListener('DOMContentLoaded', initWeatherUpdates);