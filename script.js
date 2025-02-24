const inputLocation = document.getElementById("input-location");
const submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  getWeatherInfo(inputLocation.value);
});
const locationContainer = document.getElementById("location-container");
const dateContainer = document.getElementById("date-container");
const currentDayContainer = document.getElementById("current-day-container");
const airConditions = document.getElementById("air-conditions");
const dateHeader = document.createElement("h3");
dateHeader.innerText = "7 Day Forecast"

const getWeatherInfo = async (location) => {
  try {
    const loading = document.getElementById("loading");
    loading.innerText = "loading"

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=KR7QNXQQLPNJN5WYLDDYF2JJW&contentType=json`
    );

    loading.innerText = "";

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const responseData = await response.json();
     console.log(responseData)

    const clearContainer = (className) => {
      document.querySelectorAll(className).forEach((element) => element.remove());
    }

    // get and display address
    const getAddress = (response) => response.resolvedAddress;

    const displayAddress = (response) => {
      const responseResolvedAddress = getAddress(response);
      const locationResolvedAddress = document.createElement("div");
      locationResolvedAddress.classList.add("resolved-address")

      locationResolvedAddress.textContent = responseResolvedAddress;
      clearContainer(".resolved-address")
      locationContainer.appendChild(locationResolvedAddress);
    };

    // Get and display days
    const getDays = (response) => response.days;

    const displayDays = (response) => {
      const responseDays = getDays(response);
      //Clears all date items but leaves header
      clearContainer(".date-item")    
      responseDays.forEach((day) => {
        const dateAndTemp = document.createElement("div");
        dateAndTemp.classList.add("date-item");
        dateAndTemp.innerText = `Date: ${day.datetime} Max: ${day.tempmax} Min: ${day.tempmin}`;
        if (!dateContainer.hasChildNodes()) {
          dateContainer.appendChild(dateHeader);
        }
        dateContainer.appendChild(dateAndTemp.cloneNode(true));
      });
    };

    const displayHours = (response) => {
      const currentDay = getDays(response)[0];
      clearContainer(".current-day-hour")      
      currentDayHours = currentDay.hours;
      console.log(currentDayHours);
      currentDayHours.forEach((hour) => {
        const currentDayElement = document.createElement("div");
        currentDayElement.classList.add("current-day-hour");
        currentDayElement.innerText = hour.datetime;
        currentDayContainer.appendChild(currentDayElement.cloneNode(true));
      });
    }

    displayDays(responseData);
    displayHours(responseData);
    displayAddress(responseData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
};

getWeatherInfo("melbourne");
