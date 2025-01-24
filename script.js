const apiKey = '81e1b30dc34e8df9368c3898ce3ae393';
const baseUrl = 'https://api.openweathermap.org/data/2.5';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search');
    const searchButton = document.querySelector('.search-btn');

    // Fetch current weather data
    async function getCurrentWeather(city) {
        try {
            const response = await fetch(`${baseUrl}/weather?q=${city}&units=metric&appid=${apiKey}`);
            if (!response.ok) throw new Error('City not found');
            
            const data = await response.json();
            updateCurrentWeatherUI(data);
        } catch (error) {
            console.error('Error fetching current weather:', error);
            alert('Could not retrieve weather data. Please check your city name.');
        }
    }

    // Fetch 5-day forecast
    async function getFiveDayForecast(city) {
        try {
            const response = await fetch(`${baseUrl}/forecast?q=${city}&units=metric&appid=${apiKey}`);
            if (!response.ok) throw new Error('City forecast not found');
            
            const data = await response.json();
            updateForecastUI(data);
        } catch (error) {
            console.error('Error fetching forecast:', error);
        }
    }

    // Update current weather UI
    function updateCurrentWeatherUI(data) {
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
        document.querySelector('.feels_like').innerHTML = Math.round(data.main.feels_like) + '°C';
        document.querySelector('.country').innerHTML = data.sys.country;
        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.coulds').innerHTML = data.weather[0].description;
        document.querySelector('.Rafales').innerHTML = data.wind.speed + ' km/h';
        document.querySelector('.vent').innerHTML = data.wind.deg + '°';
        document.querySelector('.Humidité').innerHTML = data.main.humidity + '%';

        // Update weather icon
        const weatherIcon = document.querySelector('.weather-icon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    }

    // Update 5-day forecast UI
    function updateForecastUI(data) {
        const daysEl = document.querySelectorAll('.days p');
        const iconsEl = document.querySelectorAll('.iconweather img');
        const tempEl = document.querySelectorAll('.celsiuse p');

        // OpenWeatherMap API returns forecast in 3-hour intervals
        const forecastDays = [];
        const uniqueDays = new Set();

        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
            
            if (!uniqueDays.has(day)) {
                uniqueDays.add(day);
                forecastDays.push({
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    temp: Math.round(forecast.main.temp),
                    icon: forecast.weather[0].icon
                });
            }

            if (forecastDays.length === 5) return;
        });

        // Update UI with forecast data
        forecastDays.forEach((dayData, index) => {
            daysEl[index].textContent = dayData.day;
            tempEl[index].textContent = `${dayData.temp}°C`;
            iconsEl[index].src = `https://openweathermap.org/img/wn/${dayData.icon}@2x.png`;
        });
    }

    // Geolocation function
    function getLocationWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Fetch weather by coordinates
                    const response = await fetch(`${baseUrl}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
                    const data = await response.json();
                    
                    // Update UI with current location weather
                    updateCurrentWeatherUI(data);
                    getFiveDayForecast(data.name);
                } catch (error) {
                    console.error('Error fetching location weather:', error);
                }
            }, (error) => {
                console.error('Geolocation error:', error);
                alert('Could not retrieve your location. Please enter a city manually.');
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            getCurrentWeather(city);
            getFiveDayForecast(city);
        } else {
            alert('Please enter a city name.');
        }
    });

    // Event listener for location button (you'll need to add this to HTML)
    const locationButton = document.createElement('button');
    locationButton.textContent = 'Use My Location';
    locationButton.classList.add('btn', 'btn-secondary', 'ms-2');
    locationButton.addEventListener('click', getLocationWeather);
    
    // Append location button next to search button
    const searchContainer = document.querySelector('.input-group');
    searchContainer.appendChild(locationButton);

    // Optional: Initial load with a default city
    getCurrentWeather('Beni Mellal');
    getFiveDayForecast('Beni Mellal');
});