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
      // need to seperate the date from the time at the space and return just the date then rearrange the date by placing it in an array
      // or cal lthe unix number and format using that
      var cityName = data.city.name;
      var currentWeather = data.list[0];
      var fiveDayWeather = data.list;
      displayCurrentWeather(currentWeather, cityName, date);
      displayFiveDayWeather(fiveDayWeather);
      saveSearches(cityName);
    });
};

var displayCurrentWeather = function (currentWeather, cityName, date) {
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
  var searchedCity = document.createTextNode(cityName + " " + date);
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
  // need to make this display cards of the weather for the next 5 days
  for (var i = 0; i < fiveDayWeather.length; i++) {
    console.log(fiveDayWeather[i]);
  }
};

var saveSearches = function (cityName) {
  var cityArray = JSON.parse(localStorage.getItem("searchedCity")) || [];
  var existingCity = cityArray.indexOf(cityName);

  if (existingCity !== -1) {
    cityArray[existingCity] = cityName;
  } else {
    cityArray.push(cityName);
  }
  var cities = JSON.stringify(cityArray);
  localStorage.setItem("searchedCity", cities);

  displaySearches(cityArray);
};

var displaySearches = function (cityArray) {
  resultsContainerEl.innerHTML = "";

  cityArray.forEach(function (city) {
    var resultItem = document.createElement("li");
    var cityBtn = document.createElement("button");
    cityBtn.textContent = city;
    cityBtn.addEventListener("click", function () {
      currentWeatherContainerEl.textContent = "";
      futureWeatherContainerEl.textContent = "";
      getWeather(city);
    });
    resultItem.appendChild(cityBtn);
    resultsContainerEl.appendChild(resultItem);
  });
};

var cityArray = JSON.parse(localStorage.getItem("searchedCity")) || [];
displaySearches(cityArray);

userFormEl.addEventListener("submit", formSubmittal);
