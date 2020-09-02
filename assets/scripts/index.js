const getWeatherBtn = document.querySelector('button#get_weather');
const address = document.querySelector('input#location')

const MAPBOX_ACESS_TOKEN = "pk.eyJ1IjoiZW1teXRvYnMiLCJhIjoiY2syM2MyZW8zMXJ3MDNobXZ5eml3amduMyJ9.FhE930AvluTSDh2NGBeCoQ";

getWeatherBtn.addEventListener('click', async (event) => {
    const coordsUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address.value)}.json?access_token=${MAPBOX_ACESS_TOKEN}`;

    if (!address.value){
        return alert("Please fill in a location!")
    }
    const response = await fetch(coordsUrl);
    const data = await response.json();
    console.log(data.features[0])
})

