// Search for a city and display the current weather and 5-day forecast
document.getElementById('searchButton').addEventListener('click', () => {
    const cityInput = document.getElementById('cityInput').value;
    const city = capitalizeCityName(cityInput);
    if (city) {
        getCoordinates(city);
    }
});

// Add event listener for cities searched
document.addEventListener('DOMContentLoaded', () => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    updateSearchHistory(searchHistory);
    const lastCity = searchHistory[searchHistory.length - 1];
    if (lastCity) {
        getCoordinates(lastCity);
    }
});

// Capitalize the first letter of each word in the city name
function capitalizeCityName(city) {
    return city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// Fetch the coordinates of the city and error handling
function getCoordinates(city) {
    const apiKey = '666b14553d4fbb8e2e7c84bebf46c442';
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(city, lat, lon);
                saveCityToHistory(city);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}

// Fetch the weather data for the city
function getWeather(city, lat, lon) {
    const apiKey = '666b14553d4fbb8e2e7c84bebf46c442';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(city, data.list[0]);
            displayForecast(data.list);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Display the current weather for the city
function displayCurrentWeather(city, data) {
    const currentWeather = document.getElementById('currentWeather');
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const temp = data.main.temp;
    const wind = data.wind.speed;
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    currentWeather.innerHTML = `
        <h2>${city} (${date})</h2>
        <img src="${iconUrl}" alt="${description}">
        <p>Temp: ${temp} °F</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity} %</p>
    `;
}

// Display the 5-day forecast for the city

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    const filteredData = data.filter(item => item.dt_txt.includes('12:00:00'));
    filteredData.forEach(item => {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weatherCard');

        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temp = item.main.temp;
        const wind = item.wind.speed;
        const humidity = item.main.humidity;
        const description = item.weather[0].description;
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

        weatherCard.innerHTML = `
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="${description}">
            <p>Temp: ${temp} °F</p>
            <p>Wind: ${wind} MPH</p>
            <p>Humidity: ${humidity} %</p>
        `;

        forecastContainer.appendChild(weatherCard);
    });
}

// Save & update the search history to local storage

function saveCityToHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateSearchHistory(searchHistory);
    }
}

function updateSearchHistory(searchHistory) {
    const searchHistoryContainer = document.getElementById('searchHistory');
    searchHistoryContainer.innerHTML = '';

    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.textContent = city;
        historyItem.addEventListener('click', () => getCoordinates(city));
        searchHistoryContainer.appendChild(historyItem);
    });
}
