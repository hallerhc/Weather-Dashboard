
const initButton= document.getElementById("initButton");
const fiveDayOutput = document.getElementById("five-day-output");
const city = document.getElementById("city");
const targetCity = document.getElementById("target-city");
const currentTemp = document.getElementById("current-temp");
const currentWind = document.getElementById("current-wind");
const currentHumidity = document.getElementById("current-humidity");
const currentUvi = document.getElementById("current-uvi");
const currentDate =document.getElementById("current-date");
const history = document.getElementById("history");
const clearButton= $("clear-history");

const APIKey = "1e06536f5a294af84bdbb70939e4a2dc";
let lat 
let lon 
let temp 
let humidity
let uvi
let wind
let icon 
let fiveDay = []

initButton.onclick = init
function init() {
    fiveDayOutput.innerHTML = "";
    fiveDay = []
    getLatLon()
}

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); 
let yyyy = today.getFullYear();

let todayFormatted = mm + '/' + dd + '/' + yyyy;
currentDate.textContent= todayFormatted;


function getLatLon() {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city.value}&limit=5&appid=${APIKey}`)
    .then(res => res.json())
    .then(data => {
        lat = data[0].lat;
        lon = data[0].lon;
        getWeather()
        
    })
    .catch(err => console.error(err))
    
}

 function getWeather() {
         fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`)
         .then(res => res.json())
         .then(data => {
             temp = data.current.temp;
             humidity = data.current.humidity;
             uvi = data.current.uvi;
             wind = data.current.wind_speed;
            icon = data.current.weather[0].icon;
             getFiveDay()
         })
         .catch(err => console.error(err))
 }

function getFiveDay() {
         fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`)
         .then(res => res.json())
         .then(data => {
             
            for (let i = 0; i < 5; i++) {
                let weatherObj = {
                    temp: data.list[i].main.temp,
                    humidity: data.list[i].main.humidity,
                    icon: data.list[i].weather[0].icon,
                    wind: data.list[i].wind.speed
                }

                fiveDay.push(weatherObj)   
            }
             
           renderData();
 })
          .catch(err => console.error(err))
}

function renderData() {
    targetCity.textContent=city.value;
    currentTemp.textContent=`Temp: ${temp} °F`;
    currentWind.textContent=`Wind: ${wind} MPH`;
    currentHumidity.textContent=`Humidity: ${humidity} %`;
    currentUvi.textContent=`UV Index: ${uvi}`;



    // loop through fiveDay and make an html element for each day
    fiveDay.forEach((day, i) => {
        let weatherCard = document.createElement('div');
        let currentDate = document.createElement('p');
        let weatherIcon = document.createElement('img');
        let weatherTemp =  document.createElement('p');
        let weatherWind = document.createElement('p');
        let weatherHumidity = document.createElement('p');

        fiveDayOutput.appendChild(weatherCard);
         weatherCard.append(currentDate, weatherIcon, weatherTemp, weatherWind, weatherHumidity);

        fiveDayOutput.setAttribute("class", "row text-light");
        weatherCard.setAttribute('class', "col-sm-2 bg-primary forecast text-white ml-4 mb-2 p-3 mt-1")

        let tomorrow = new Date()
        let counter = 1 + i;
        tomorrow.setDate(today.getDate()+counter);
        let d = String(tomorrow.getDate()).padStart(2, '0');
        let m = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
        let y = tomorrow.getFullYear();
        let tomorrowFormatted = m + '/' + d + '/' + y;
        currentDate.textContent = tomorrowFormatted;
        weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${day.icon}.png`);
        weatherIcon.setAttribute('alt', 'weather icon');
        weatherTemp.textContent = `Temp: ${day.temp}°F`;
        weatherWind.textContent = `Wind: ${day.wind}MPH`;
        weatherHumidity.textContent = `Humidity: ${day.humidity}%`;

    })
   
    saveData() 
}

function saveData() {
    let cities = [];
    let storage = JSON.parse(localStorage.getItem('previous-searches'));
    if (storage) { 
        storage.forEach(search => cities.push(search));
    }
    cities.push(city.value);  
    localStorage.setItem('previous-searches', JSON.stringify(cities))

    cities.forEach(place => {
        let listElement = document.createElement('li');
        history.append(listElement);
        listElement.textContent = place;
    })

    function clearHistory(event){
        event.preventDefault();
         cities=[];
        localStorage.removeItem("previous-searches");
        document.location.reload();
      
      }



$("#clear-history").on("click",clearHistory);

}   




