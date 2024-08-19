const apiKey = '18605a79f28bebe94fedaf3ef75b7da2'; // OpenWeatherMap API key
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const historyList = document.getElementById('historyList');

// Function to fetch and display weather data
function fetchWeather(city) {
    // Fetch current weather
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city_search}&limit=5&appid=${apiKey}`)
        .then(response => response.json())
        .then(currentData => {
            if (currentData.cod === 200) {
                // Fetch 5-day forecast
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${your_latitude}&lon=${your_longitude}&units=imperial&appid=${apiKey}`)
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
// Function to display current weather
function displayCurrentWeather(data) {
    const { name, weather, main, wind } = data;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
    currentWeather.innerHTML = `
        <h2>${name}</h2>
        <p>${new Date().toLocaleDateString()}</p>
        <img src="${weatherIcon}" alt="${weather[0].description}">
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}

// Function to display 5-day forecast
function displayForecast(data) {
    const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    forecast.innerHTML = '<h2>5-Day Forecast</h2>';
    forecastList.forEach(day => {
        const { dt_txt, main, weather, wind } = day;
        const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
        forecast.innerHTML += `
            <div class="forecast-day">
                <p>${new Date(dt_txt).toLocaleDateString()}</p>
                <img src="${weatherIcon}" alt="${weather[0].description}">
                <p>Temperature: ${main.temp}°C</p>
                <p>Wind Speed: ${wind.speed} m/s</p>
                <p>Humidity: ${main.humidity}%</p>
            </div>
        `;
    });
}

// Function to handle form submission
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        cityInput.value = '';
    }
});

// Function to add city to search history
function addToHistory(city) {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', function() {
        fetchWeather(city);
    });
    historyList.appendChild(listItem);

    // Store history in localStorage
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

// Load search history on page load
function loadHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(function(city) {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', function() {
            fetchWeather(city);
        });
        historyList.appendChild(listItem);
    });
}

loadHistory();
