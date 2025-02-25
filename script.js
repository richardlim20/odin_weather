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
dateHeader.innerText = "7 Day Forecast";

const getWeatherInfo = async (location) => {
  try {
    const loading = document.getElementById("loading");
    loading.innerText = "loading";

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=KR7QNXQQLPNJN5WYLDDYF2JJW&contentType=json`
    );

    loading.innerText = "";

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const responseData = await response.json();
    console.log(responseData);

    const clearClassElement = (className) => {
      document
        .querySelectorAll(className)
        .forEach((element) => element.remove());
    };

    const clearContainer = (container) => {
      if (container.hasChildNodes()) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };

    //Create weather detail elements
    const currentTemp = document.createElement("div");
    currentTemp.textContent = `${responseData.currentConditions.temp}C`;
    const currentCondition = document.createElement("div");
    currentCondition.textContent = responseData.currentConditions.conditions;
    const currentPrecipprob = document.createElement("div");
    currentPrecipprob.textContent = responseData.precipprob
      ? `${responseData.precipprob}%`
      : "0%";

    // get and display address
    const getAddress = (response) => response.resolvedAddress;

    const displayAddress = (response) => {
      const responseResolvedAddress = getAddress(response);

      const locationResolvedAddress = document.createElement("div");
      locationResolvedAddress.classList.add("resolved-address");

      //Clear and add content
      clearContainer(locationContainer);
      locationResolvedAddress.textContent = responseResolvedAddress;
      locationContainer.appendChild(locationResolvedAddress);
      locationContainer.appendChild(currentTemp);
      locationContainer.appendChild(currentPrecipprob);
      locationContainer.appendChild(currentCondition);
    };

    // Get and display days
    const getDays = (response) => response.days;
    const displayDays = (response) => {
      const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
          date
        );
      };
      const responseDays = getDays(response);
      //Clears all date items but leaves header
      clearClassElement(".date-item");
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];
      responseDays.forEach((day) => {
        //Create date elements
        const dateDay = document.createElement("div");
        dateDay.classList.add("date-item");
        dateDay.textContent =
          day.datetime === today ? "Today" : getDayOfWeek(day.datetime);
        const dateCondition = document.createElement("div");
        dateCondition.classList.add("date-item");
        dateCondition.textContent = day.conditions;
        const dateMax = document.createElement("div");
        dateMax.classList.add("date-item");
        dateMax.textContent = day.tempmax;
        const dateMin = document.createElement("div");
        dateMin.classList.add("date-item");
        dateMin.textContent = day.tempmin;

        if (!dateContainer.hasChildNodes()) {
          dateContainer.appendChild(dateHeader);
        }
        dateContainer.appendChild(dateDay.cloneNode(true));
        dateContainer.appendChild(dateCondition.cloneNode(true));
        dateContainer.appendChild(dateMax.cloneNode(true));
        dateContainer.appendChild(dateMin.cloneNode(true));
      });
    };

    const displayHours = (response) => {
      const convertHourFormat = (timeString) => {
        hour = timeString.slice(0, 2);
        const hourInt = parseInt(hour);
        const period = hourInt >= 12 ? "PM" : "AM";
        //Displays midnight as 12
        const hour12 = hourInt % 12 || 12;
        const convertedString = `${hour12} ${period}`;
        return {
          convertedString: `${hour12} ${period}`,
          hourInt: hourInt,
        };
      };
      const currentDay = getDays(response)[0];
      const nextDay = getDays(response)[1];
      const allHours = [...currentDay.hours, ...nextDay.hours];
      clearClassElement(".current-day-hour");

      const currentHour = document.createElement("div");
      const { convertedString, hourInt } = convertHourFormat(
        response.currentConditions.datetime
      );
      const currentHourString = convertedString;
      const currentHourInt = hourInt;
      currentHour.textContent = currentHourString;

      //Gets index from new array from current and next day
      const startIndex = allHours.findIndex(
        (hour) => parseInt(hour.datetime.split(":")[0]) >= currentHourInt
      );

      //finds and creates new array for 6 times 3 hours apart from current time
      const selectedHours = [];
      for (let i = 0; i < 6; i++) {
        const hourIndex = startIndex + i * 3;
        if (hourIndex < allHours.length) {
          selectedHours.push(allHours[hourIndex]);
        }
      }
      selectedHours.forEach((hour) => {
        const { convertedString } = convertHourFormat(hour.datetime);
        const currentDayHour = document.createElement("div");
        currentDayHour.classList.add("current-day-hour");
        currentDayHour.innerText = convertedString;
        const currentHourCondition = document.createElement("div");
        currentHourCondition.classList.add("current-day-hour");
        currentHourCondition.textContent = hour.conditions;
        const currentHourTemp = document.createElement("div");
        currentHourTemp.classList.add("current-day-hour");
        currentHourTemp.textContent = hour.temp;

        console.log(hour);
        currentDayContainer.appendChild(currentDayHour.cloneNode(true));
        currentDayContainer.appendChild(currentHourCondition.cloneNode(true));
        currentDayContainer.appendChild(currentHourTemp.cloneNode(true));
      });
    };

    const displayAirConditions = (response) => {
      const currentWind = document.createElement("div");
      currentWind.textContent = response.currentConditions.windspeed;
      airConditions.appendChild(currentCondition.cloneNode(true));
      airConditions.appendChild(currentTemp.cloneNode(true));
      airConditions.appendChild(currentWind);
      airConditions.appendChild(currentPrecipprob.cloneNode(true));
    };

    displayDays(responseData);
    displayHours(responseData);
    displayAddress(responseData);
    displayAirConditions(responseData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
};

getWeatherInfo("melbourne");
