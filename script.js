const openWeatherKey = 'a277e0757a345c43a2b8c2fe9cdd5616';
let lastSearchedCity = '';

async function getWeather() {
    const city = document.getElementById('city-input').value.trim();

    if (!city || city === lastSearchedCity) {
        alert('Please enter a new city name!');
        return;
    }

    lastSearchedCity = city;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${openWeatherKey}`;

    try {
        const [currentWeatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        const currentWeatherData = await currentWeatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (currentWeatherData.cod !== 200 || forecastData.cod !== '200') {
            alert(`Error: ${currentWeatherData.message || 'No data available for this city.'}`);
            return;
        }

        updateWeatherWidget(currentWeatherData);
        populateForecast(forecastData);
        createCharts(forecastData);
        populateTable(forecastData.list);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function updateWeatherWidget(data) {
    const widget = document.getElementById('weather-widget');
    const weatherDesc = data.weather[0].description.toLowerCase();

    const weatherImages = {
        clear: 'url("pics/clearsky.jpeg")',
        overcast: 'url("pics/overcast_clouds.jpg")',
        rain: 'url("pics/rainy-weather.jpg")',
        brokenClouds: 'url("pics/broken_clouds.jpg")',
        scatteredClouds: 'url("pics/scattered_clouds.jpg")',
        fewClouds: 'url("pics/broken_clouds.jpg")',
    };

    let backgroundImage = weatherImages.clear; // Default to clear sky

    // Update background based on weather description
    if (weatherDesc.includes('overcast')) {
        backgroundImage = weatherImages.overcast;
    } else if (weatherDesc.includes('rain')) {
        backgroundImage = weatherImages.rain;
    } else if (weatherDesc.includes('broken clouds')) {
        backgroundImage = weatherImages.brokenClouds;
    } else if (weatherDesc.includes('scattered clouds')) {
        backgroundImage = weatherImages.scatteredClouds;
    }
    else if (weatherDesc.includes('few clouds')) {
        backgroundImage = weatherImages.scatteredClouds;
    }

    // Apply the selected background image with proper styling
    widget.style.backgroundImage = backgroundImage;
    widget.style.backgroundSize = 'cover'; // Ensures the image covers the widget fully
    widget.style.backgroundPosition = 'center'; // Centers the image
    widget.style.opacity = '0.5'; 

    // Update other widget information
    document.getElementById('city-name').innerText = data.name || 'Unknown City';
    document.getElementById('weather-desc').innerText = weatherDesc;
    document.getElementById('temperature').innerText = `${data.main.temp} °C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind: ${data.wind.speed} m/s`;
}




function populateForecast(data) {
    const forecastGrid = document.getElementById('forecast-grid');
    forecastGrid.innerHTML = ''; // Clear previous content

    const weatherImages = {
        clear: 'pics/clearsky.jpeg',
        overcast: 'pics/overcast_clouds.jpg',
        rain: 'pics/rainy-weather.jpg',
        brokenClouds: 'pics/broken_clouds.jpg',
        scatteredClouds: 'pics/scattered_clouds.jpg',
    };

    // Filter forecasts for 12:00:00 of each day
    const filteredData = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));

    filteredData.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        const temp = entry.main.temp;
        const description = entry.weather[0].description.toLowerCase();

        // Select appropriate background image
        let backgroundImage = weatherImages.clear; // Default to clear sky

        if (description.includes('overcast')) {
            backgroundImage = weatherImages.overcast;
        } else if (description.includes('rain')) {
            backgroundImage = weatherImages.rain;
        } else if (description.includes('broken clouds')) {
            backgroundImage = weatherImages.brokenClouds;
        } else if (description.includes('scattered clouds')) {
            backgroundImage = weatherImages.scatteredClouds;
        }

        // Create the forecast item with a dynamic background
        const forecastItem = `
            <div class="forecast-item" 
                 style="background-image: url('${backgroundImage}');">
                <div class="forecast-content">
                    <p>${date}</p>
                    <p>${temp} °C</p>
                    <p>${description}</p>
                </div>
            </div>
        `;

        // Insert the forecast item into the grid
        forecastGrid.insertAdjacentHTML('beforeend', forecastItem);
    });
}



// Charts
let barChartInstance = null;
let doughnutChartInstance = null;
let lineChartInstance = null;

function createCharts(data) {
    const temps = data.list.map(entry => entry.main.temp);
    const labels = data.list.map(entry => entry.dt_txt.split(' ')[0]);

    if (barChartInstance) barChartInstance.destroy();
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    if (lineChartInstance) lineChartInstance.destroy();

    // Count weather occurrences (sunny, cloudy, rainy)
    let sunnyCount = 0;
    let cloudyCount = 0;
    let rainyCount = 0;

    data.list.forEach(entry => {
        const description = entry.weather[0].description.toLowerCase();
        if (description.includes('clear')) sunnyCount++;
        else if (description.includes('cloud')) cloudyCount++;
        else if (description.includes('rain')) rainyCount++;
    });

    // Doughnut Chart
    doughnutChartInstance = new Chart(document.getElementById('doughnutChart'), {
        type: 'doughnut',
        data: {
            labels: ['Sunny', 'Cloudy', 'Rainy'],
            datasets: [{
                data: [sunnyCount, cloudyCount, rainyCount],
                backgroundColor: ['yellow', 'gray', 'blue']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });

    // Bar Chart
    barChartInstance = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5 
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });

    // Line Chart
    lineChartInstance = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Over Time',
                data: temps,
                fill: false,
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom' 
                }
            }
        }
    });
}


function populateTable(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    const filteredData = data.filter(entry => entry.dt_txt.includes('12:00:00'));
    filteredData.forEach(entry => {
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
