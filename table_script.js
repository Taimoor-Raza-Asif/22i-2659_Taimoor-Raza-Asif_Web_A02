const openWeatherKey = 'a277e0757a345c43a2b8c2fe9cdd5616';
let lastSearchedCity = '';
let weatherForecastData = []; // Store all forecast data globally

// Function to populate the table with filtered or sorted data
function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear the table before adding new data

    data.forEach(entry => {
        const row = `
            <tr>
                <td>${entry.dt_txt.split(' ')[0]}</td>
                <td>${entry.main.temp} °C</td>
                <td>${entry.weather[0].description}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Sort temperatures in ascending or descending order
function sortTemperature(order) {
    const sortedData = weatherForecastData.slice().sort((a, b) => {
        return order === 'asc' ? a.main.temp - b.main.temp : b.main.temp - a.main.temp;
    });
    populateTable(sortedData);
}

// Filter out non-rainy days
function filterRainyDays() {
    const rainyDays = weatherForecastData.filter(entry =>
        entry.weather[0].description.toLowerCase().includes('rain')
    );

    if (rainyDays.length === 0) {
        alert('No rainy days found in the forecast.');
    } else {
        populateTable(rainyDays);
    }
}

// Find the day with the highest temperature
function showHighestTemperature() {
    const highestTempEntry = weatherForecastData.reduce((max, entry) =>
        entry.main.temp > max.main.temp ? entry : max
    );

    populateTable([highestTempEntry]); // Show only the highest temperature day
}

async function getWeather() {
    const city = document.getElementById('city-input').value.trim();

    if (!city || city === lastSearchedCity) {
        alert('Please enter a new city name!');
        return;
    }

    lastSearchedCity = city;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${openWeatherKey}`;

    try {
        const response = await fetch(forecastUrl);
        const forecastData = await response.json();

        if (forecastData.cod !== '200') {
            alert(`Error: ${forecastData.message || 'No data available for this city.'}`);
            return;
        }

        // Store the forecast data globally for chatbot queries
        weatherForecastData = forecastData.list;

        populateTable(forecastData.list);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}
