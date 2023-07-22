var userFormEl = document.querySelector("#user-input");
var cityInput = document.querySelector("#city-input");
var resultsContainerEl = document.querySelector("#results-list");
var currentWeatherContainerEl = document.querySelector("#current-weather");
var futureWeatherContainerEl = document.querySelector("#future-weather");

var formSubmittal = function (event) {
  event.preventDefault();
  var city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    //saveSearches(city);
    currentWeatherContainerEl.textContent = "";
    futureWeatherContainerEl.textContent = "";
    cityInput.value = "";
  } else {
    // display "please insert city"
  }
};

var getWeather = function (city) {
  var APIkey = "eb3d56c7eca0dd2d4f55841ca1bf5295";
  var requestedUrl =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" +
    city +
    "&appid=" +
    APIkey +
    "";
  fetch(requestedUrl, { method: "GET" })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      console.log(data);
      var date = data.list[0].dt_txt;
      var currentWeather = data.list[0];
      var fiveDayWeather = data.list;
      displayCurrentWeather(currentWeather, city, date);
      displayFiveDayWeather(fiveDayWeather, city);
    });
};

var displayCurrentWeather = function (currentWeather, city, date) {
  var icon = currentWeather.weather[0].icon;
  var temp = currentWeather.main.temp;
  var wind = currentWeather.wind.speed;
  var humidity = currentWeather.main.humidity;

  var cityEl = document.createElement("h2");
  var forcastEl = document.createElement("ul");
  var iconEl = document.createElement("li");
  var iconImg = document.createElement("img");
  var tempEl = document.createElement("li");
  tempEl.textContent = "Temperature: " + temp + " °F";
  var windEl = document.createElement("li");
  windEl.textContent = "Wind Speed: " + wind + " MPH";
  var humidityEl = document.createElement("li");
  humidityEl.textContent = "Humidity: " + humidity + " %";

  iconImg.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" + icon + ".png"
  );
  iconEl.appendChild(iconImg);
  var searchedCity = document.createTextNode(city + " " + date);
  cityEl.appendChild(searchedCity);

  forcastEl.appendChild(iconEl);
  forcastEl.appendChild(tempEl);
  forcastEl.appendChild(windEl);
  forcastEl.appendChild(humidityEl);

  currentWeatherContainerEl.appendChild(cityEl);
  currentWeatherContainerEl.appendChild(forcastEl);
};

var displayFiveDayWeather = function (fiveDayWeather, city) {
  console.log(fiveDayWeather);
  var headerEl = document.createElement("h3");
  var header = document.createTextNode("5-Day Forcast:");
  headerEl.appendChild(header);
  futureWeatherContainerEl.appendChild(headerEl);

  for (var i = 0; i < fiveDayWeather.length; i++){
    
  }

};

var saveSearches = function(){

}

var displaySearches = function(){

}


userFormEl.addEventListener("submit", formSubmittal);
