const inputLocation = document.getElementById("input-location");
const submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  getWeatherInfo(inputLocation.value);
});
inputLocation.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeatherInfo(inputLocation.value);
  }
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
    loading.style.display = "block";
    loading.innerText = "Loading...";

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=KR7QNXQQLPNJN5WYLDDYF2JJW&contentType=json`
    );

    loading.innerText = "";

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const responseData = await response.json();
    console.log(responseData);

    const displayConditionIcon = (condition) => {
      let iconSrc;

      switch (condition.toLowerCase()) {
        case "clear":
          iconSrc = "images/clear-icon.png";
          break;
        case "overcast":
          iconSrc = "images/overcast-icon.png";
          break;
        case "partially cloudy":
          iconSrc = "images/partially-cloudy-icon.png";
          break;
        case "rain, partially":
          iconSrc = "images/partially-rainy-icon.webp";
          break;
        case "rain, overcast":
          iconSrc = "images/rainy-icon.webp";
          break;
        case "rain, partially cloudy":
          iconSrc = "images/partially-rainy-icon.webp";
          break;
      }
      return iconSrc;
    };

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

    const appendHeader = (container, header) => {
      if (!container.hasChildNodes()) {
        container.appendChild(header);
      }
    }

    //Create weather detail elements
    const currentTemp = document.createElement("div");
    currentTemp.textContent = `${responseData.currentConditions.temp}C`;
    const currentCondition = document.createElement("img");
    const conditionText = responseData.currentConditions.conditions;
    currentCondition.textContent = conditionText;
    currentCondition.setAttribute("src", displayConditionIcon(conditionText));
    currentCondition.setAttribute("alt", conditionText);
    currentCondition.setAttribute("title", conditionText);
    const currentPrecipprob = document.createElement("div");
    currentPrecipprob.textContent = responseData.precipprob
      ? `Chance of rain: ${responseData.precipprob}%`
      : "Chance of rain: 0%";

    // get and display address
    const getAddress = (response) => response.resolvedAddress;

    const displayAddress = (response) => {
      const responseResolvedAddress = getAddress(response);

      const locationResolvedAddress = document.createElement("div");
      locationResolvedAddress.classList.add("resolved-address");
      const locationFlexContainer = document.createElement("div");
      locationFlexContainer.classList.add("location-flex-1");
      const locationFlexContainer2 = document.createElement("div");

      //Clear and add content
      clearContainer(locationContainer);
      locationResolvedAddress.textContent = responseResolvedAddress;
      locationContainer.appendChild(locationFlexContainer);
      locationContainer.appendChild(locationFlexContainer2);
      locationFlexContainer.appendChild(locationResolvedAddress);
      locationFlexContainer.appendChild(currentPrecipprob);
      locationFlexContainer.appendChild(currentTemp);
      locationFlexContainer2.appendChild(currentCondition);
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
      responseDays.slice(0, 7).forEach((day) => {
        //Create date elements
        const dateFlexContainer = document.createElement("div");
        dateFlexContainer.classList.add("date-flex-container");
        dateFlexContainer.classList.add("date-item");
        const dateDay = document.createElement("div");
        dateDay.classList.add("date-item");
        dateDay.textContent =
          day.datetime === today ? "Today" : getDayOfWeek(day.datetime);
        const dateCondition = document.createElement("img");
        dateCondition.classList.add("date-item");
        const dateConditionText = day.conditions;
        dateCondition.setAttribute(
          "src",
          displayConditionIcon(dateConditionText)
        );
        dateCondition.setAttribute("alt", dateConditionText);
        dateCondition.setAttribute("title", dateConditionText);
        const dateMaxMin = document.createElement("div");
        dateMaxMin.classList.add("date-item");
        dateMaxMin.textContent = `${day.tempmax} / ${day.tempmin}`;

        appendHeader(dateContainer, dateHeader);
        dateFlexContainer.appendChild(dateDay.cloneNode(true));
        dateFlexContainer.appendChild(dateCondition.cloneNode(true));
        dateFlexContainer.appendChild(dateMaxMin.cloneNode(true));
        dateContainer.appendChild(dateFlexContainer.cloneNode(true));
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

      const currentDayHeader = document.createElement("h3");
      currentDayHeader.textContent = "Today's Forecast";
      appendHeader(currentDayContainer, currentDayHeader);
      const currentDayFlexContainer = document.createElement("div");
      currentDayFlexContainer.classList.add("current-day-flex-container")
      currentDayContainer.appendChild(currentDayFlexContainer)

      selectedHours.forEach((hour) => {
        const { convertedString } = convertHourFormat(hour.datetime);
        const currentHourContainer = document.createElement("div");
        currentHourContainer.classList.add("hour-container");
        currentHourContainer.classList.add("current-day-hour");
        const currentDayHour = document.createElement("div");
        currentDayHour.classList.add("current-day-hour");
        currentDayHour.innerText = convertedString;
        const currentHourCondition = document.createElement("img");
        currentHourCondition.classList.add("current-day-hour");
        const currentHourConditionText = hour.conditions;
        currentHourCondition.setAttribute(
          "src",
          displayConditionIcon(currentHourConditionText)
        );
        currentHourCondition.setAttribute("alt", currentHourConditionText);
        currentHourCondition.setAttribute("title", currentHourConditionText);
        const currentHourTemp = document.createElement("div");
        currentHourTemp.classList.add("current-day-hour");
        currentHourTemp.textContent = hour.temp;

        console.log(hour);
        currentHourContainer.appendChild(currentDayHour.cloneNode(true));
        currentHourContainer.appendChild(currentHourCondition.cloneNode(true));
        currentHourContainer.appendChild(currentHourTemp.cloneNode(true));
        currentDayFlexContainer.appendChild(currentHourContainer.cloneNode(true));
      });
    };

    const displayAirConditions = (response) => {
      const airConditionsHeader = document.createElement("h3");
      airConditionsHeader.classList.add("air-conditions-header");
      airConditionsHeader.textContent = "Air Conditions";
      const airConditionsFlexContainer = document.createElement("div");
      airConditionsFlexContainer.classList.add("air-conditions-flex-container");
      airConditionsFlexContainer.classList.add("air-conditions-item");
      const airConditionsFlex1 = document.createElement("div");
      const airConditionsFlex2 = document.createElement("div");
      airConditionsFlexContainer.appendChild(airConditionsFlex1);
      airConditionsFlexContainer.appendChild(airConditionsFlex2);

      
      const feelsLike = document.createElement("div");
      feelsLike.classList.add("air-conditions-item");
      feelsLike.textContent = `Feels Like: ${response.currentConditions.feelslike}`;
      const currentWind = document.createElement("div");
      currentWind.classList.add("air-conditions-item");
      currentWind.textContent = `Wind Speed: ${response.currentConditions.windspeed}`;
      const uvIndex = document.createElement("div");
      uvIndex.classList.add("air-conditions-item");
      uvIndex.textContent = `UV Index: ${response.currentConditions.uvindex}`;
      currentPrecipprob.classList.add("air-conditions-item");

      clearClassElement(".air-conditions-item");
      appendHeader(airConditions, airConditionsHeader);
      airConditionsFlex1.appendChild(feelsLike);
      airConditionsFlex1.appendChild(currentWind);
      airConditionsFlex2.appendChild(currentPrecipprob.cloneNode(true));
      airConditionsFlex2.appendChild(uvIndex);
      airConditions.appendChild(airConditionsFlexContainer);
    };

    displayDays(responseData);
    displayHours(responseData);
    displayAddress(responseData);
    displayAirConditions(responseData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
  finally {
    loading.style.display = "none"; // Hide loading dialog after fetching
  }
};

getWeatherInfo("Melbourne")
