const apiKey = "348335d9552c341cd099690c1ca25133";
// const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric";
const apiUrl2 = "https://api.openweathermap.org/data/2.5/weather?";
let city = "";
let degree = "";
let country = "";
let weather = ""
let clouds = ""

// Function to show loading indicator
const showLoading = () => {
  const loading = document.getElementById("loading");
  const weatherInfo = document.getElementById("weather-info");
  weatherInfo.classList.remove("show");
  loading.classList.add("show");
};

// Function to hide loading indicator
const hideLoading = () => {
  const loading = document.getElementById("loading");
  const weatherInfo = document.getElementById("weather-info");
  weatherInfo.classList.add("show");
  loading.classList.remove("show");
};

// Function to get location and city name
const getlocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              apiUrl2 +
                `lat=${position.coords.latitude}` +
                `&lon=${position.coords.longitude}` +
                `&appid=${apiKey}`
            );
            const data = await response.json();
            if (data.cod === "404") {
              reject("City not found");
            } else {
              city = data.name;
              resolve(city);
            }
          } catch (error) {
            reject(error.message);
          }
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      reject("Geolocation not supported");
    }
  });
};

// Function to check weather
async function checkWeather() {

  try {
    cityname()
    // const response = await fetch(apiUrl + `&q=${city}` + `&appid=${apiKey}`);
    // const data = await response.json();
    const response2 = await fetch(
      apiUrl2 + `&q=${city}` + `&appid=${apiKey}` + `&units=metric`
    );
    const data2 = await response2.json();
    if (data2.cod === "404") {
      //data.cod === "404" ||
      console.log("City not found");
    } else {
      // console.log(data);
      console.log(data2);
      document.getElementById("degree").innerHTML = Math.round(data2.main.temp);
      document.getElementById("city").innerHTML = city;
      document.getElementById("max_temp").innerHTML = `${Math.round(
        data2.main.temp_max
      )}<sup>o</sup> <i
      class="fa-light fa-temperature-three-quarters"
      style="color: #ff5900"
      ></i>`;
      document.getElementById("min_temp").innerHTML = `${Math.round(
        data2.main.temp_min
      )}<sup>o</sup> <i
      class="fa-light fa-temperature-quarter"
      style="color: #0091ff"
      ></i>`;
      document.getElementById("humidity").innerHTML = `${Math.round(
        data2.main.humidity
      )}% <i class="fa-light fa-droplet" style="color: #ffffff;"></i>`;
      document.getElementById("wind").innerHTML = `${Math.round(
        data2.wind.speed
      )}km/h <i class="fa-light fa-wind" style="color: #ffffff;"></i>`;
      clouds = Math.round(data2.clouds.all)
      document.getElementById("clouds").innerHTML = `${clouds}% <i class="fa-thin fa-clouds" style="color: #ffffff;"></i>`;
      document.getElementById("like").innerHTML = `${Math.round(
        data2.main.feels_like
      )}<sup>o</sup> <i class="fa-thin fa-heat" style="color: #ffffff;"></i>`;
      const icon = `http://openweathermap.org/img/wn/${data2.weather[0].icon}@2x.png`;
      document.getElementById("weather").innerHTML =
      data2.weather[0].description;
      document.getElementById("icon").src = icon;
      
      weather = data2.weather[0].main
      
      //date and time
      var dt = data2.dt; // Unix timestamp
      var timezone = data2.timezone; // Timezone offset in seconds
      
      // Convert Unix timestamp to milliseconds (required by Date constructor) and add timezone offset
      var localTimeMilliseconds = (dt + timezone) * 1000;
      
      // Create a new Date object with the local time
      var localTime = new Date(localTimeMilliseconds);
      
      // Adjust for local timezone
      var localOffset = localTime.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
      localTime.setTime(localTime.getTime() + localOffset);
      
      // Get the components of the date and time
      var year = localTime.getFullYear();
      var month = ("0" + (localTime.getMonth() + 1)).slice(-2);
      var day = ("0" + localTime.getDate()).slice(-2);
      var hours = ("0" + localTime.getHours()).slice(-2);
      var minutes = ("0" + localTime.getMinutes()).slice(-2);
      
      // Get the day of the week
      var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      var dayOfWeekNumber = localTime.getDay();
      var dayOfWeek = daysOfWeek[dayOfWeekNumber];
      
      // Construct the date and time string
      var localTimeStr =
      hours +
      ":" +
      minutes +
      " - " +
      dayOfWeek +
      ", " +
      day +
      " " +
      month +
      " " +
      year;
      
      document.getElementById("datetime").innerHTML = localTimeStr;
      
      background(weather, clouds, checktime(hours))
      updatesearch(city, data2.sys.country)
    }
  } catch (error) {
    console.log(error.message);
  } 
  finally {
    hideLoading();
  }
}
//change search 
const updatesearch = (city, country) => {
  console.log(city)
  console.log(country)
  var update = document.getElementById("search");
  update.value = `${city}, ${country}`;
}
//get city name
const cityname = () => {
  var citycheck = document.getElementById("search").value;
  if (citycheck != "") {
    city = citycheck.split(',')[0];
  }
}
//capital first letter
document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.getElementById("search");

  inputElement.addEventListener("input", function () {
    const value = inputElement.value;
    if (value.length > 0) {
      inputElement.value = value.charAt(0).toUpperCase() + value.slice(1);
    }
  });
});


//background change
const background = (weather, clouds, time) => {

  var backgroundImg = document.getElementById('weather-info');

  let newImageURL;
  if (weather === "Clouds") {
    if (clouds >= 60) {
      newImageURL = `./Images/Background/${time}/cloudy.jpg`;
    } else {
      newImageURL = `./Images/Background/${time}/cloud.jpg`;
    }
  } else if (weather === "Haze") {
    newImageURL = `./Images/Background/${time}/haze.jpg`;
  } else if (weather === "Rain") {
    newImageURL = `./Images/Background/${time}/rain.jpg`;
  } else if (weather === "Snow") {
    newImageURL = `./Images/Background/${time}/snow.jpg`;
  } else if (weather === "Clear") {
    newImageURL = `./Images/Background/${time}/clear.jpg`;
  } else {
    newImageURL = `./Images/Background/${time}/temp.jpg`;
  }

  
    backgroundImg.style.backgroundImage = 'url(' + newImageURL + ')';
}
// generate day and night

const checktime = (hour) =>{
  if ((hour >= 19 && hour <= 23) || (hour >= 0 && hour <= 7)) {
    return "Night";
  } else {
    return "Day";
  }
}
// Main function to get location and then check weather
async function main() {
  showLoading();
  try {
    await getlocation();
    await checkWeather();
  } catch (error) {
    console.log(error);
    // Default city if geolocation fails or is blocked
    city = "London"; // Set default city here
    await checkWeather();
  }
}

// Run the main function
main();
