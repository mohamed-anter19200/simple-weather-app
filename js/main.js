"use strict"
//* HTML variables
const forecastContainer = document.querySelector('.row');
const search = document.getElementById('search');
const findBtn = document.getElementById('findBtn');

//^ App Variables
const today = new Date();
let url;
let check = false;


//& Functions
function formatDate(date) {
  return {
    weekday: date.toLocaleString('en-US', { weekday: 'long' }),
    day: date.toLocaleString('en-US', { day: 'numeric' }),
    month: date.toLocaleString('en-US', { month: 'long' })
  };
}
async function fetchWeatherData(url) {
  const response = await fetch(url);
  return await response.json();
}
function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    url = `https://api.weatherapi.com/v1/forecast.json?key=2bd6be2fb86846fa93f11143241510&q=${latitude},${longitude}&days=3`;
    const data = await fetchWeatherData(url);
    displayCurrent(data);
    displayOther(data);
  });
}

async function searchWeather(query) {
  if (query !== "") {
    url = `https://api.weatherapi.com/v1/forecast.json?key=2bd6be2fb86846fa93f11143241510&q=${query}&days=3`;
    const data = await fetchWeatherData(url);
    displayCurrent(data);
    displayOther(data);
  }
}

function displayCurrent(data) {
  const { weekday, day, month } = formatDate(today);

  const currentWeatherHTML = `
    <div class="col-md-4 px-0 forecast today-forecast">
      <div class="forecast-header p-2 d-flex justify-content-between">
        <div class="day">${weekday}</div>
        <div class="date">${day} ${month}</div>
      </div>
      <div class="forecast-content p-3">
        <div class="location">${data.location.region}</div>
        <div class="degree fw-bold">
          <div class="num text-white">${data.current.temp_c}<sup>o</sup>C</div>
          <div class="forecast-icon">
            <img src="${data.current.condition.icon}" alt="" width="90">
          </div>
        </div>
        <div class="custom text-primary">${data.current.condition.text}</div>
        <span class="me-2"><img class="me-1" src="./images/icon-umberella.png" alt="">${data.current.humidity}%</span>
        <span class="me-2"><img class="me-1" src="./images/icon-wind.png" alt="">${data.current.wind_kph} km/h</span>
        <span class="me-2"><img class="me-1" src="./images/icon-compass.png" alt="">${data.current.wind_dir}</span>
      </div>
    </div>
  `;
  forecastContainer.innerHTML = currentWeatherHTML;
}
function displayOther(data) {
  const nextDay = new Date(today);
  let forecastHTML = "";
   for (let i = 1; i < data.forecast.forecastday.length; i++) {
    nextDay.setDate(today.getDate() + i);
    const { weekday } = formatDate(nextDay);
    
    forecastHTML += `
      <div class="col-md-4 px-0 forecast">
        <div class="forecast-header p-2">
          <div class="day text-center">${weekday}</div>
        </div>
        <div class="forecast-content text-center mt-2 p-3">
          <div class="forecast-icon">
            <img src="${data.forecast.forecastday[i].day.condition.icon}" alt="" width="90">
          </div>
          <div class="degree mb-3 text-white">
            <div class="great-num fw-bold">${data.forecast.forecastday[i].day.maxtemp_c}<sup>o</sup>C</div>
            <small>${data.forecast.forecastday[i].day.mintemp_c}<sup>o</sup>C</small>
          </div>
          <div class="custom text-primary">${data.forecast.forecastday[i].day.condition.text}</div>
        </div>
      </div>
    `;
  }

  forecastContainer.innerHTML += forecastHTML;
}

if (check == false) {
  getWeatherByLocation();
}
findBtn.addEventListener('click', function () {
  const searchQuery = search.value;
  if (searchQuery !="" && (searchQuery !="me" || searchQuery !="Me" ) ){
    check = true;
    searchWeather(searchQuery);
  }
   else if (searchQuery =="" ||searchQuery =="me" || searchQuery !="Me" ){
    check = false;
    getWeatherByLocation();
  }
});

