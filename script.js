const apiKey = "b27e5aa4a6f25304bc393d34949eb4b3";
const weatherIcon = document.querySelector('.weather-icon')
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const toggleTemp = document.querySelector('.parentTemp button');
const apiErrorDiv = document.getElementById("api-error");
const weatherDisplay = document.querySelector('.weather');

var units = "metric";
var city = "";
var CF = "°F"

// all event listeners to wait for dom ready or content loaded event
document.addEventListener('DOMContentLoaded', () => {

    console.log('DOMContentLoaded event fully loaded');

    searchBtn.addEventListener('click', () => {
        getWeather(searchBox.value, units);
    });

    searchBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            getWeather(searchBox.value, units);
        }
    });

    toggleTemp.addEventListener('click', () => {
        units = units === 'metric' ? 'imperial' : 'metric';

        if (typeof CF === 'undefined') {
            CF = '°C';
        }

        CF = CF === '°F' ? '°C' : '°F';

        const cfElement = document.getElementById("CF");
        console.log(CF);
        if (cfElement) {
            cfElement.innerHTML = CF;
        }

        const city = searchBox.value;
        getWeather(city, units);
    });

    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showLocation, checkError);
        } else {
            locationDiv.innerText = "The browser does not support geolocation";
        }
    });

});

async function getWeather(city, units) {
    // Show the loading element
    const loadingElement = document.querySelector('.loading');
    loadingElement.style.display = 'block';

    let response; // Declare response variable here

    apiErrorDiv.style.display = 'none';
    weatherDisplay.style.display = 'none';
    locationErrorDiv.style.display = 'none';

    try {
        response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`);
        const data = await response.json();

        document.querySelector('.description').innerHTML = data.weather[0].description;
        let tempData = `${Math.round(data.main.temp)}°${units === 'metric' ? 'C' : 'F'}`;
        document.querySelector('.temp').innerHTML = tempData;
        document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
        let tempWind = `${Math.round(data.wind.speed)}${units === 'metric' ? 'km/h' : 'mph'}`;
        document.querySelector('.wind').innerHTML = tempWind;
        document.querySelector('.locDetails').innerHTML = data.name + ' , ' + data.sys.country;

        var iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        weatherDisplay.style.display = 'block';
        console.log(data);
    } catch (error) {

        if (response && response.status === 404) {
            apiErrorDiv.style.display = 'block';
            apiErrorDiv.innerText = "City not found. Please check the city name/code and try again.";
        } else if (city === "") {
            apiErrorDiv.style.display = 'block';
            apiErrorDiv.innerText = "Please enter a city name/code.";
        } else if (response && response.status !== 200) {
            apiErrorDiv.style.display = 'block';
            apiErrorDiv.innerText = `An error occurred while fetching the weather data. Status code: ${response.status}`;
        }
    }

    loadingElement.style.display = 'none';
}


let locationButton = document.getElementById("get-location");
let locationDiv = document.getElementById("location-details");
const locationErrorDiv = document.getElementById("location-error");

const checkError = (error) => {
    apiErrorDiv.style.display = 'none';
    weatherDisplay.style.display = 'none';
    locationErrorDiv.style.display = 'none';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            locationErrorDiv.style.display = "block";
            locationErrorDiv.innerText = "Please allow access to location in order to fetch weather data.";
            break;
        case error.POSITION_UNAVAILABLE:
            locationErrorDiv.style.display = "block";
            locationErrorDiv.innerText = "Location information is currently unavailable.";
            break;
        case error.TIMEOUT:
            locationErrorDiv.style.display = "block";
            locationErrorDiv.innerText = "The request to get user location timed out.";
            break;
    }
};

const showLocation = async (position) => {
    try {
        let response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch location data.");
        }

        let data = await response.json();
        // locationDiv.innerText = "Your Location is "+`${data.address.city}`;
        console.log(`${data.address.city}`);
        const city = `${data.address.city}`;
        searchBox.value = city;
        getWeather(city, units);
    } catch (error) {
        // Handle errors here
        const locationErrorDiv = document.getElementById("location-error");
        locationErrorDiv.style.display = "block";
        locationErrorDiv.innerText = `An error occurred while fetching location data: ${error.message}`;
    }
};
