//JavaScript Document

const searchBox = document.querySelector("#searchBox");
const searchBtn = document.querySelector("#searchBtn");
const cityName = document.querySelector("#cityName");
const cityTemp = document.querySelector("#cityTemp");
const weatherIcon = document.querySelector("#weatherIcon");
const weatherDescription = document.querySelector("#weatherDescription");
const weatherHumidity = document.querySelector("#humidity");
const weatherWindSpeed = document.querySelector("#windSpeed");
const errText = document.querySelector("#errText");
const errDiv = document.querySelector("#errDiv");
const initialTextDiv = document.querySelector("#initialTextDiv");
const mainContent = document.querySelector("#mainContent");
const API_KEY = "";

errDiv.style.display = "none";
mainContent.style.display = "none";

const fetchWeather = async (searchCityName) => {
  const apiUrlForFindLatAndLon = `http://api.openweathermap.org/geo/1.0/direct?q=${searchCityName}&limit=5&appid=${API_KEY}`;
  const apiCallForFindLatAndLon = await (
    await fetch(apiUrlForFindLatAndLon)
  ).json();
  if (apiCallForFindLatAndLon.length == 0) return 0;
  const lat = apiCallForFindLatAndLon[0].lat;
  const lon = apiCallForFindLatAndLon[0].lon;
  const fetchWeatherInfo = async ({ lat, lon }) => {
    const apiUrlForFetchWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const fetchedWeather = await (await fetch(apiUrlForFetchWeather)).json();
    return fetchedWeather;
  };
  return fetchWeatherInfo({ lat, lon });
};

const setWeather = ({
  city,
  temp,
  iconClass,
  description,
  humidity,
  windSpeed,
}) => {
  cityName.innerText = city;
  cityTemp.innerText = temp;
  weatherIcon.className = iconClass;
  weatherDescription.innerText = description;
  weatherHumidity.innerText = humidity;
  weatherWindSpeed.innerText = windSpeed;
  initialTextDiv.style.display = "none";
  errDiv.style.display = "none";
  mainContent.style.display = "block";
};

const noCityFound = () => {
  errText.innerText = "No City Found";
  initialTextDiv.style.display = "none";
  mainContent.style.display = "none";
  errDiv.style.display = "block";
};

const evalulateIconClass = (iconInfoArr) => {
  const iconId = iconInfoArr.id;
  const dayOrNight = iconInfoArr.icon.slice(-1);
  if (dayOrNight == "n") return `wi wi-owm-night-${iconId}`;
  return `wi wi-owm-day-${iconId}`;
};

const evaluateWeather = () => {
  const searchBoxValue = searchBox.value;
  if (searchBoxValue == null || searchBoxValue == "") {
    mainContent.style.display = "none";
    initialTextDiv.style.display = "none";
    errDiv.style.display = "block";
    errText.innerText = "Please Enter City Name";
  }
  const weatherInfoProm = fetchWeather(searchBoxValue);
  weatherInfoProm.then((weatherInfo) => {
    if (weatherInfo == 0) noCityFound();
    const city = weatherInfo.name;
    const temp = `${weatherInfo.main.temp} °C`;
    const iconClass = evalulateIconClass(weatherInfo.weather[0]);
    const description = weatherInfo.weather[0].description;
    const humidity = `${weatherInfo.main.humidity}%`;
    const windSpeed = `${weatherInfo.wind.speed} m/s`;
    setWeather({ city, temp, iconClass, description, humidity, windSpeed });
  });
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  evaluateWeather();
});

searchBox.addEventListener("search", (e) => {
  e.preventDefault();
  evaluateWeather();
});

if (API_KEY === "") {
  initialTextDiv.style.display = "none";
  mainContent.style.display = "none";
  errDiv.style.display = "block";
  errText.innerText = "Please Add an API Key";
}