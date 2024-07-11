const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const weatherContainer = document.querySelector(".weather-container");
const grantLocationContainer = document.querySelector(".grantlocation-container");
const grantAccess = document.querySelector("[data-grantAccess]");
const searchForm = document.querySelector("[data-searchForm]");
const searchInput = document.querySelector("[data-searchInput]");
const btn = document.querySelector(".btn");
const loadingContainer = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const name = document.querySelector(".name");
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countyIcon]");
const weatherDescription = document.querySelector("[data-weatherDescription]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temperature = document.querySelector("[data-temperature]");
const parameterContainer = document.querySelector(".parameter-container");
const cardParameter = document.querySelector(".parameter");
const windspeed = document.querySelector("[data-windspeed]");
const humidity = document.querySelector("[data-humidity]");
const clouds = document.querySelector("[data-clouds]");
const errorContainer = document.querySelector(".error-container");
const messageText = document.querySelector(".msgText");


let currentTab = userTab;
const API_KEY = "245792b98b9ad1386c4bdedf2b89c512";
currentTab.classList.add("current-tab")
getfromSessionStorage();

function switchTab(clickedTab){
  errorContainer.classList.remove("active");
  if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantLocationContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

// check if cordinates were saved in the storage
function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantLocationContainer.classList.add("active");
  } else{
    const cordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(cordinates);
  }
}

async function fetchUserWeatherInfo(cordinates){
  const {lat, lon} = cordinates;
  // make grant location page invincible
  grantLocationContainer.classList.remove("active");
  // add loader page
  loadingContainer.classList.add("active");

  // API CALL
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch(err){
    loadingContainer.classList.remove("active");
    // create an error make page which is visible  when the cordinates gets failed to achieve
    console.log("Your location is not working");
    errorContainer.classList.add("active");
  }
}

function renderWeatherInfo(weatherInfo){
  // fetch value from weatherInfo object and put it in UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp}°C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    grantAccess.style.display = "none";
    messageText.innerText = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const userCordinates = {
    lat : position.coords.latitude,
    lon : position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCordinates));
  fetchUserWeatherInfo(userCordinates);
}
grantAccess.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) =>{
  e.preventDefault();
  let cityName = searchInput.value;
  if(cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingContainer.classList.add("active");
  userInfoContainer.classList.remove("active");
  errorContainer.classList.remove("active");

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    const data = await response.json();
    if (!data.sys) {
      throw data;
    }
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    // do it
    loadingContainer.classList.remove("active");
    errorContainer.classList.add("active");
  }
}