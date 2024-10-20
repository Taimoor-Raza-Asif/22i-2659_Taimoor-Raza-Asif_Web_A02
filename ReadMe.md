# Weather Dashboard

A Weather Dashboard web application that provides **current weather data**, **5-day forecasts**, **interactive charts**, and **chatbot functionality** to answer weather-related queries. It uses the OpenWeather API for real-time data and Chart.js for data visualization.

---

## Features

1. **Current Weather Widget**  
   Displays real-time weather conditions for a searched city, including:
   - Temperature
   - Weather Description
   - Humidity
   - Wind Speed

2. **5-Day Weather Forecast**  
   Presents forecasts for upcoming days at 12:00 PM, with dynamic backgrounds based on weather conditions.

3. **Charts and Visualizations**  
   Uses Chart.js to generate:
   - **Bar Chart:** Temperature over time.
   - **Line Chart:** Temperature trends.
   - **Doughnut Chart:** Weather condition distribution.

4. **Weather Tables with Filters**  
   Provides a table with forecast data that can be:
   - **Sorted by Temperature (Ascending/Descending)**
   - **Filtered to show only Rainy Days**
   - **Display the Highest Temperature Day**

5. **Chatbot Integration (Google Generative AI)**  
   Allows users to ask weather-related questions, such as:
   - Current temperature in Fahrenheit
   - Max/Min temperature on a specific date
   - Weather for a specific time and day

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-repository/weather-dashboard.git
   cd weather-dashboard

## Project-Hierarchy
weather-dashboard/
│
├── index.html         # Dashboard page
├── table.html         # Weather Table page with filters
├── styles.css         # Main stylesheet
├── table-styles.css   # Styles for the table page
├── script.js          # Weather widget and chart logic
├── table_script.js    # Table filtering and sorting logic
├── bot.js             # Chatbot logic (Google Generative AI)
├── /pics              # Weather condition images
└── README.md          # Project documentation

## Open the Application:

You can open index.html in any web browser.

## Configure API Keys:
Replace the placeholder in script.js and bot.js with your own OpenWeather API Key and Google Generative AI API Key.

## Usage

### Search Weather:
- Enter a city name in the input field and click **Get Weather** to see current conditions and forecast.

### Interact with the Table:
- Use the sorting and filtering buttons to customize the weather table view.

---

### Ask the Chatbot:
- Use the chatbot to ask questions like:
  - "What is the temperature in Fahrenheit?"
  - "What is the max temperature on 2024-10-22?"

---

## Dependencies
- **OpenWeather API:** Provides weather data.  
- **Chart.js:** Used for creating interactive charts.  
- **Google Generative AI (Gemini):** Powers the chatbot.  
- **JavaScript ES6 Modules:** For importing chatbot logic.  

---



## License
This project is licensed under the **MIT License**

---

## Acknowledgements
- **OpenWeather API:** [https://openweathermap.org](https://openweathermap.org)  
- **Chart.js:** [https://www.chartjs.org](https://www.chartjs.org)  
- **Google Generative AI:** [https://developers.google.com/ai](https://developers.google.com/ai)
