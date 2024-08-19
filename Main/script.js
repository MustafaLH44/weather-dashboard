const apiKey = 'd91f911bcf2c0f925fb6535547a5ddc9'; // OpenWeatherMap API key
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const historyList = document.getElementById('historyList');

// Function to fetch and display weather data
function fetchWeather(city) {
    // Fetch current weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(currentData => {
            if (currentData.cod === 200) {
                // Fetch 5-day forecast
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(forecastData => {
                        if (forecastData.cod === "200") {
                            displayCurrentWeather(currentData);
                            displayForecast(forecastData);
                            addToHistory(city);
                        } else {
                            alert("City not found");
                        }
                    });
            } else {
                alert("City not found");
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

