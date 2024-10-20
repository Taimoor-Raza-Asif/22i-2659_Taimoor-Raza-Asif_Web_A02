import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = 'AIzaSyCsQoAZi5p_2xC0JkR9Qwxk1sMIIgmKT34';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// DOM Elements
const chatInput = document.getElementById('chat-input');
const askButton = document.querySelector('.ask-button button');
const chatAnswer = document.getElementById('chat-answer');

// Global variables
// Store forecast data
let lastSearchedCity = ''; // Store the last searched city

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(temp) {
    return (temp * 9 / 5) + 32;
}

// Get min/max temperatures for a specific date
function getTemperatureForDate(date) {
    const dayEntries = weatherForecastData.filter(entry =>
        entry.dt_txt.startsWith(date)
    );

    if (dayEntries.length === 0) {
        return null; // No data available for this date
    }

    const maxTemp = Math.max(...dayEntries.map(entry => entry.main.temp));
    const minTemp = Math.min(...dayEntries.map(entry => entry.main.temp));

    return { maxTemp, minTemp };
}

// Find the closest weather entry for a specific time within the same day
function getClosestWeatherForTime(date, time) {
    const dayEntries = weatherForecastData.filter(entry =>
        entry.dt_txt.startsWith(date)
    );

    if (dayEntries.length === 0) {
        return null; // No data for the given date
    }

    const targetTime = new Date(`1970-01-01T${time}:00Z`);
    let closestEntry = dayEntries[0];
    let minDifference = Infinity;

    dayEntries.forEach(entry => {
        const entryTime = new Date(`1970-01-01T${entry.dt_txt.split(' ')[1]}Z`);
        const difference = Math.abs(entryTime - targetTime);

        if (difference < minDifference) {
            minDifference = difference;
            closestEntry = entry;
        }
    });

    return closestEntry;
}

// Chatbot event listener
askButton.addEventListener('click', async () => {
    const query = chatInput.value.trim().toLowerCase();

    if (!query) {
        chatAnswer.textContent = 'Please enter a question!';
        return;
    }

    if (query.includes('weather') || query.includes('temperature')) {
        if (weatherForecastData.length === 0) {
            chatAnswer.textContent = 'Please search for a city first to get its weather data.';
            return;
        }

        let response = '';

        if (query.includes('max temperature') || query.includes('min temperature')) {
            // Extract the date from the query, if provided
            const dateMatch = query.match(/\b(\d{4}-\d{2}-\d{2})\b/);
            const date = dateMatch ? dateMatch[0] : weatherForecastData[0].dt_txt.split(' ')[0];

            const tempData = getTemperatureForDate(date);

            if (tempData) {
                response = `On ${date} in ${lastSearchedCity}, the maximum temperature is ${tempData.maxTemp} °C and the minimum temperature is ${tempData.minTemp} °C.`;
            } else {
                response = `No weather data available for ${date}.`;
            }
        } else if (query.includes('fahrenheit')) {
            const tempF = celsiusToFahrenheit(weatherForecastData[0].main.temp);
            response = `The current temperature in ${lastSearchedCity} is ${tempF.toFixed(2)} °F.`;
        } else {
            // Handle specific time queries
            const timeMatch = query.match(/\b(\d{1,2}):?(\d{2})?\s?(am|pm)?\b/i);
            const dateMatch = query.match(/\b(\d{4}-\d{2}-\d{2})\b/);

            const date = dateMatch ? dateMatch[0] : weatherForecastData[0].dt_txt.split(' ')[0];
            const time = timeMatch ? timeMatch[0] : '12:00'; // Default to 12:00 if no time specified

            const forecastEntry = getClosestWeatherForTime(date, time);

            if (forecastEntry) {
                response = `The weather at ${forecastEntry.dt_txt} in ${lastSearchedCity} is ${forecastEntry.weather[0].description} with a temperature of ${forecastEntry.main.temp} °C.`;
            } else {
                response = `No weather data available for ${time} on ${date}.`;
            }
        }

        chatAnswer.textContent = response;
    } else {
        chatAnswer.textContent = 'I am currently able to answer weather-related queries only.';
    }

    chatInput.value = ''; // Clear input field
});
