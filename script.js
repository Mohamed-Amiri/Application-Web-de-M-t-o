const apiKey = '81e1b30dc34e8df9368c3898ce3ae393';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search'); // Input field
    const searchButton = document.querySelector('.search-btn'); // Search button

    async function getWeather(city) {
        try {
            const response = await fetch(apiUrl + city + '&appid=' + apiKey);
            if (!response.ok) throw new Error('City not found');
            
            const data = await response.json();

            // Update DOM elements with the retrieved weather data
            document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
            document.querySelector('.feels_like').innerHTML = Math.round(data.main.feels_like) + '°C';
            document.querySelector('.country').innerHTML = data.sys.country;
            document.querySelector('.city').innerHTML = data.name;
            document.querySelector('.clouds').innerHTML = data.clouds.all + '%';
            document.querySelector('.wind-speed').innerHTML = data.wind.speed + ' km/h';
            document.querySelector('.vent').innerHTML = data.wind.deg + '°';
            document.querySelector('.Humidité').innerHTML = data.main.humidity + '%';
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Could not retrieve weather data. Please check your city name.');
        }
    }

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const city = searchInput.value.trim();
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city name.');
        }
    });
});
