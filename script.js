const domManip = (() => {
  const searchButton = document.querySelector(".search-button");
  const clearButton = document.querySelector(".reset-button");
  searchButton.addEventListener("click", fetchCurrentWeather);
  clearButton.addEventListener("click", clearSearch);
  document.addEventListener("DOMContentLoaded", function hideBrokenImg() {
    let firstLoadImg = document.querySelector("img");
    firstLoadImg.style.display = "none";
  });
})();

async function fetchCurrentWeather() {
  try {
    const searchCity = document.getElementById("search-city").value;
    const searchState = document.getElementById("search-state").value;
    const searchCountry = document.getElementById("search-country").value;

    // Run check to ensure all fields have values
    if (searchCity == "" || searchState == "" || searchCountry == "") {
      alert("All fields are required. Please try again!");
      return;
    }

    console.log(searchCity);
    console.log(searchState);
    console.log(searchCountry);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchCity},${searchState},${searchCountry}&appid=4811fa0ff9e098eb3dbec8bcf35a1448&units=imperial`,
      { mode: "cors" }
    );
    const currentData = await response.json();
    console.log("Fetching Current weather data from API ....", currentData);

    //Construct object for my weather app from the API JSON data

    const currentWeather = {
      mainWeather: currentData.weather[0].main,
      place:
        currentData.name +
        ", " +
        searchState.toUpperCase() +
        ", " +
        currentData.sys.country,
      temp: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity + "%",
      wind: Math.round(currentData.wind.speed) + "MPH",
    };
    console.log(currentWeather);
    displayWeather(currentWeather);
    getGiphy(currentWeather.mainWeather);
  } catch (err) {
    console.log(
      "Something has went wrong with fetching the current weather data ...",
      err
    );
  }
}

function clearSearch() {
  document.getElementById("search-city").value = "";
  document.getElementById("search-state").value = "";
  document.getElementById("search-country").value = "";
  img.style.display = "none";
  clearDOM();
}

function displayWeather(currentWeather) {
  const displayDiv = document.querySelector(".display-div");

  //Call function to clear any DOM elements that may be present from previous search
  clearDOM();
  const city = document.createElement("p");
  city.textContent = currentWeather.place;
  displayDiv.appendChild(city);
  const status = document.createElement("p");
  status.textContent = currentWeather.mainWeather;
  displayDiv.appendChild(status);
  const cityTemp = document.createElement("p");
  cityTemp.textContent = currentWeather.temp + " Degrees";
  displayDiv.appendChild(cityTemp);
  const humidity = document.createElement("p");
  humidity.textContent = currentWeather.humidity + " Humidity";
  displayDiv.appendChild(humidity);
  const Citywind = document.createElement("p");
  Citywind.textContent = currentWeather.wind + " Wind";
  displayDiv.appendChild(Citywind);
}

async function getGiphy(mainWeather) {
  try {
    const img = document.querySelector("img");
    let keyWord = mainWeather;
    if ((keyWord = "Clear")) {
      keyWord = "Clear Sky";
    }
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=fjaTOMUuDpBZyKT5N2qw1Q3lBSoqWrkO&s=${keyWord}`,
      { mode: "cors" }
    );
    const giPhyResponse = await response.json();
    console.log(giPhyResponse);
    img.style.display = "";
    img.src = giPhyResponse.data.images.original.url;
  } catch (err) {
    console.log("Something has went wrong when trying to fetch giphy...", err);
  }
}

function clearDOM() {
  // Clear the DOM if anything was present from a prior search
  const nodeList = document.querySelectorAll("p");
  if (nodeList !== null) {
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].remove();
    }
  }
}
