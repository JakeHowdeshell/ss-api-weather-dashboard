// variables that define the html id's where the functions will be called
var userFormEl = document.querySelector("#user-input");
var cityInput = document.querySelector("#city-input");
var resultsContainerEl = document.querySelector("#results-list");
var currentWeatherContainerEl = document.querySelector("#current-weather");
var futureWeatherContainerEl = document.querySelector("#future-weather");
// function the prevents the page from refreshing on the event, in this case a submit
// it then takes the value from the user input trims it if there were spaces,
// calls the get weather function providing the city that was submitted and then
// removes any items that were previously loaded and alters the placeholder.
var formSubmittal = function (event) {
  event.preventDefault();
  var city = cityInput.value.trim();

  getWeather(city);
  currentWeatherContainerEl.textContent = "";
  currentWeatherContainerEl.classList.add("hidden");
  futureWeatherContainerEl.textContent = "";
  cityInput.value = "";
  cityInput.placeholder = "Enter a city...";
};
// when this function is called it uses the city query to fetch the API from openweathermap.org
// with the provided API key. if the status returns good then the rest of the function runs
// using the datat collected from the API to create variables to usse in the display
// and save functions. if it returns bad then the placeholder changes.
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
      } else {
        cityInput.placeholder = "Please try again";
      }
    })
    .then(function (data) {
      var unixTS = data.city.sunrise;
      var date = new Date(unixTS * 1000).toLocaleDateString("en-US");
      var cityName = data.city.name;
      var currentWeather = data.list[0];
      var fiveDayWeather = data;
      displayCurrentWeather(currentWeather, cityName, date);
      displayFiveDayWeather(fiveDayWeather);
      saveSearches(cityName);
    });
};
// this function takes the data from array[0] of the provided weather as well as
// the API provided cityName and date calculated from the sunrise date using the unix timestamp
// to display the icon, temperature, windspeed, and humidity in the above defined
// current weather container element.
var displayCurrentWeather = function (currentWeather, cityName, date) {
  currentWeatherContainerEl.classList.remove("hidden");
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
  var searchedCity = document.createTextNode(cityName + " (" + date + ")");
  cityEl.appendChild(searchedCity);

  forcastEl.appendChild(iconEl);
  forcastEl.appendChild(tempEl);
  forcastEl.appendChild(windEl);
  forcastEl.appendChild(humidityEl);

  currentWeatherContainerEl.appendChild(cityEl);
  currentWeatherContainerEl.appendChild(forcastEl);
};
// this function displays the h3 for the 5 day weather forecast then runs through the length
// of the array provided by the API containing the weather information. It skips four indexes when it reaches
// a new date so the weather provided is coming from mid day. because there are only 39 indexes
// when the for loop reaches the 36th index it only increases by three so that the function captures the
// last index. The information is collected and displayed in divisions providing a week long
// weather forecast.
var displayFiveDayWeather = function (fiveDayWeather) {
  var headerEl = document.createElement("h3");
  var header = document.createTextNode("5-Day Forecast:");
  headerEl.appendChild(header);
  futureWeatherContainerEl.appendChild(headerEl);
  var cards = document.createElement("div");
  cards.className = "cards";
  futureWeatherContainerEl.appendChild(cards);
  var forecastDate = new Date(
    fiveDayWeather.list[0].dt * 1000
  ).toLocaleDateString("en-US");
  for (var i = 0; i < fiveDayWeather.list.length; i++) {
    console.log(fiveDayWeather);
    var date = new Date(fiveDayWeather.list[i].dt * 1000).toLocaleDateString(
      "en-US"
    );
    console.log(forecastDate);
    console.log(date);
    if (date === forecastDate) {
      i++;
      console.log(i);
    } else if (date !== forecastDate) {
      if (i === 36) {
        i += 3;
      } else {
        i += 4;
      }
      console.log(i);
      forecastDate = date;

      var icon = fiveDayWeather.list[i].weather[0].icon;
      var temp = fiveDayWeather.list[i].main.temp;
      var wind = fiveDayWeather.list[i].wind.speed;
      var humidity = fiveDayWeather.list[i].main.humidity;

      var cardEl = document.createElement("div");
      var dateEl = document.createElement("h3");
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
      var futureDate = document.createTextNode("(" + date + ")");
      dateEl.appendChild(futureDate);

      forcastEl.appendChild(iconEl);
      forcastEl.appendChild(tempEl);
      forcastEl.appendChild(windEl);
      forcastEl.appendChild(humidityEl);

      cardEl.appendChild(dateEl);
      cardEl.appendChild(forcastEl);

      cards.appendChild(cardEl);
    }
  }
};
// this function saves the cityName to local storage and if it is a name that
// has already been input then replaces the existing input with the new name
// turns the array into a string and
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
// keeps the searches stored in local storage on the page when the page is refreshed
// by parsing them based on a key word.
var cityArray = JSON.parse(localStorage.getItem("searchedCity")) || [];
displaySearches(cityArray);
// submit event listiner that calls the form submittal function to start the program.
userFormEl.addEventListener("submit", formSubmittal);
