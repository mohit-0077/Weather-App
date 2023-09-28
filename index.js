const apiKey = "b27e5aa4a6f25304bc393d34949eb4b3";
const weatherIcon = document.querySelector('.weather-icon')
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const toggleTemp = document.querySelector('.parentTemp button');

let flag = 1;

async function checkWeather(city) {
    const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`);
    const response1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);

    // const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`);

    var data1 = await response1.json();
    var data2 = await response2.json();

    if (flag == 1) {
        var data = data1;
        var response = response1;
    } else{
        var data = data2;
        var response = response2;        
    }

    if (response.status == 404) {
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather').style.display = 'none';
        document.querySelector('.no-city').style.display = 'none';
    } else if (city == "") {
        document.querySelector('.no-city').style.display = 'block';
        document.querySelector('.weather').style.display = 'none';
        document.querySelector('.error').style.display = 'none';

    }
    else {
        // document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.description').innerHTML = data.weather[0].description;
        // document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '°C';
        let tempData = `${Math.round(data.main.temp)}°${flag === 1 ? 'C' : 'F'}`;
        document.querySelector('.temp').innerHTML = tempData;
        document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
        // document.querySelector('.wind').innerHTML = data.wind.speed + 'km/h';
        let tempWind = `${Math.round(data.wind.speed)}${flag === 1 ? 'km/h' : 'mph'}`;
        document.querySelector('.wind').innerHTML = tempWind;

        if (data.weather[0].main == 'Clouds') {
            weatherIcon.src = "images/clouds.png"
        }
        else if (data.weather[0].main == 'Clear') {
            weatherIcon.src = "images/clear.png"
        }
        else if (data.weather[0].main == 'Rain') {
            weatherIcon.src = "images/rain.png"
        }
        else if (data.weather[0].main == 'Drizzle') {
            weatherIcon.src = "images/drizzle.png"
        }
        else if (data.weather[0].main == 'Mist') {
            weatherIcon.src = "images/mist.png"
        }

        document.querySelector('.weather').style.display = 'block';
        document.querySelector('.error').style.display = 'none';
        document.querySelector('.no-city').style.display = 'none';
    }
    console.log(data);
    var units = 'si';
}

searchBtn.addEventListener('click', () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkWeather(searchBox.value);
    }
});

toggleTemp.addEventListener('click', () => {
    if (flag == 1) {
        flag++;
    }else{
        flag--;
    }
    const city = searchBox.value;
    checkWeather(city);
});



let locationButton = document.getElementById("get-location");
let locationDiv = document.getElementById("location-details");

locationButton.addEventListener("click", () => {
    //Geolocation APU is used to get geographical position of a user and is available inside the navigator object
    if (navigator.geolocation) {
        //returns position(latitude and longitude) or error
        navigator.geolocation.getCurrentPosition(showLocation, checkError);
    } else {
        //For old browser i.e IE
        locationDiv.innerText = "The browser does not support geolocation";
    }
});

//Error Checks
const checkError = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            locationDiv.innerText = "Please allow access to location";
            break;
        case error.POSITION_UNAVAILABLE:
            //usually fired for firefox
            locationDiv.innerText = "Location Information unavailable";
            break;
        case error.TIMEOUT:
            locationDiv.innerText = "The request to get user location timed out";
    }
};

const showLocation = async (position) => {
    //We user the NOminatim API for getting actual addres from latitude and longitude
    let response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
    );
    //store response object
    let data = await response.json();
    // locationDiv.innerText = "Your Location is "+`${data.address.city}`;
    console.log(`${data.address.city}`);
    const city = `${data.address.city}`;
    searchBox.value = city;
    checkWeather(city);
};