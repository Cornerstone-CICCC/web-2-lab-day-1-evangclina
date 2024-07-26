//variables
const form = document.querySelector("#form")
const cityHeader = document.querySelector(".city")
const temperature = document.querySelector(".temp")
const countryTable = document.querySelector(".country")
const timezoneTable = document.querySelector(".timezone")
const populationTable = document.querySelector(".population")
const forecastTable = document.querySelector(".forecast")
const table = document.querySelector(".table")
const countryTitle = document.querySelector(".country-title")
const timezoneTitle = document.querySelector(".timezone-title")
const populationTitle = document.querySelector(".population-title")
const forecastTitle = document.querySelector(".forecast-title")
const doc = document.querySelector("body")
const background = document.querySelector(".container")

async function getCity(city){
    try{
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
        const data = await res.json()
        return data.results[0]

    }catch(error){
        console.error(error)
    }
}

async function getWeather(lat, lon){
    try{
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
        const data = await res.json() 
        return data
    }catch(error){
        console.error(error)
    }
}

function buildHTML(cityData, weather){
    const cityName = cityData.name
    const timezone = weather.timezone
    const country = cityData.country
    const population = cityData.population

    //from city database
    countryTitle.innerHTML = `Country`
    timezoneTitle.innerHTML = `Timezone`
    populationTitle.innerHTML = `Population`
    forecastTitle.innerHTML = `Tomorrow's Forecast`
    cityHeader.innerHTML = `${cityName}`
    timezoneTable.innerHTML = `${timezone}`
    countryTable.innerHTML = `${country}`
    populationTable.innerHTML = `${population}`

    //from weather database
    const temp = weather.current.temperature_2m
    const tempUnit = weather.current_units.temperature_2m
    const maxTemp = weather.daily.temperature_2m_max
    const minTemp = weather.daily.temperature_2m_min
    const isDay = weather.current.is_day

    temperature.innerHTML = `${temp} ${tempUnit}`
    forecastTable.innerHTML = `<div> Max: ${maxTemp} ${tempUnit} </div><div>Min: ${minTemp} ${tempUnit}</div>`

    if (isDay === 0){
        doc.classList.add("dark-mode")
        background.classList.add("dark-bckg")

    }else{
        background.classList.remove("dark-bckg")
        doc.classList.remove("dark-mode")
    }
}

//submit search bar 
form.addEventListener("submit", async (e)=>{
    e.preventDefault()
    const formData = new FormData(form)
    const city = formData.get("city")
    const cityData = await getCity(city)
    console.log(cityData)
    const weather = await getWeather(cityData.latitude, cityData.longitude)
    console.log(weather)

    buildHTML(cityData, weather)

    table.style.display = "flex"
    background.style.display = "flex"
})
