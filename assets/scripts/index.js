const getWeatherBtn = document.querySelector('button#get_weather');
const address = document.querySelector('input#location')

const weatherResult = document.querySelector('section#weather_result .headline')
const temperature = document.querySelector('section#weather_result #temperature')
const tempText = document.querySelector('section#weather_result #temp_text')
const weatherIcon = document.querySelector('section#weather_result #weather_icon')
const resultAddress = document.querySelector('section#weather_result #location')

const headlineText = document.querySelector('section#weather_result .headline-text')
const addressError = document.querySelector('section#weather_result #address_error')
const loader = document.querySelector('.loader')

const OW_API_KEY = "ed4301f7e8297fb27910d5fea27d4320";
const pixabayUrl = `https://pixabay.com/api/?key=17619649-3f81e35a51e2410035f34f6df&q=yellow+flowers&image_type=photo`

function displayWeatherResult(weatherData, response) {
    if(response.status != 200) {
        addressError.style.display = "block";
        headlineText.style.display = "none";
        loader.style.display = "none";
        return console.log("Location could not be found");
    }

    addressError.style.display = "none";
    headlineText.style.display = "block";
    weatherResult.style.display = "block";
    loader.style.display = "none";

    const { main: {feels_like, temp}, weather, name, sys: { country } } = weatherData;
    const degreeCelcius = temp - 273;
    resultAddress.innerHTML = `${name}, ${country}`;
    temperature.innerHTML = `${Math.round(degreeCelcius)} &#8451;`;
    tempText.innerHTML = weather[0].main;
    weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`);
}

getWeatherBtn.addEventListener('click', async (event) => {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${(encodeURIComponent(address.value))}&appid=${OW_API_KEY}`;

    if (!address.value){
        return alert("Please fill in a location!");
    }
    weatherResult.style.display = "none";
    loader.style.display = "block";
    // const response = await fetch(coordsUrl);
    try{
        const response = await fetch(weatherUrl);
        const data = await response.json();
        displayWeatherResult(data, response)
    } catch(error) {
        alert("Couldn't fetch. Make sure you're connected to the internet")
    }

})
