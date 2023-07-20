var userFormEl = document.querySelector('#user-input');
var cityInput = document.querySelector('#city-input');
var 



var requestedUrl =
  "https://api.openweathermap.org/data/2.5/forecast?q=" +
  city +
  "&appid=" +
  APIkey;
var APIkey = "eb3d56c7eca0dd2d4f55841ca1bf5295";
var city;

function getQuery(requestedUrl) {
  fetch(requestedUrl).then(function (response) {
    console.log(response.status);
  });
}


