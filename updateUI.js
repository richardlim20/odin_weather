import {
  displayConditionIcon,
  createImage,
  clearContainer,
  appendHeader,
  getCurrentPrecip,
  setTempTextContent,
} from "./helperFunctions.js";
import { UNITGROUPS, State } from "./settings.js";
//Update entire UI
export const updateUI = (response) => {
  displayCurrentForecast(response);
  displayWeeklyForecast(response);
  displayHourlyForecast(response);
  displayAirConditions(response);
};

const displayCurrentForecast = (response) => {
  const locationContainer = document.getElementById("location-container");
  const responseResolvedAddress = response.resolvedAddress;
  const currentTemp = document.createElement("div");
  setTempTextContent(
    response.currentConditions.temp,
    currentTemp,
    State.selectedUnitGroup
  );
  const conditionText = response.currentConditions.conditions;
  const currentCondition = createImage(
    displayConditionIcon(conditionText),
    conditionText,
    conditionText
  );
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
  locationFlexContainer.appendChild(getCurrentPrecip(response));
  locationFlexContainer.appendChild(currentTemp);
  locationFlexContainer2.appendChild(currentCondition);
};

// Get and display days
const displayWeeklyForecast = (response) => {
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  };
  const responseDays = response.days;
  const dateContainer = document.getElementById("date-container");
  const dateHeader = document.createElement("h3");
  dateHeader.innerText = "7 Day Forecast";

  clearContainer(dateContainer);
  appendHeader(dateContainer, dateHeader);

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  //Create and append date elements
  responseDays.slice(0, 7).forEach((day) => {
    const dateFlexContainer = document.createElement("div");
    dateFlexContainer.classList.add("date-flex-container");
    const dateDay = document.createElement("div");
    dateDay.textContent =
      day.datetime === today ? "Today" : getDayOfWeek(day.datetime);
    const dateConditionText = day.conditions;
    const dateCondition = createImage(
      displayConditionIcon(dateConditionText),
      dateConditionText,
      dateConditionText
    );
    const dateMaxMin = document.createElement("div");
    const dateMax = document.createElement("div");
    const dateMin = document.createElement("div");

    setTempTextContent(day.tempmax, dateMax, State.selectedUnitGroup);
    setTempTextContent(day.tempmin, dateMin, State.selectedUnitGroup);
    dateMaxMin.textContent = `${dateMin.textContent} / ${dateMax.textContent}`;

    dateFlexContainer.appendChild(dateDay.cloneNode(true));
    dateFlexContainer.appendChild(dateCondition.cloneNode(true));
    dateFlexContainer.appendChild(dateMaxMin.cloneNode(true));
    dateContainer.appendChild(dateFlexContainer.cloneNode(true));
  });
};

const displayHourlyForecast = (response) => {
  const convertHourFormat = (timeString) => {
    let hour = timeString.slice(0, 2);
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
  const currentDayContainer = document.getElementById("current-day-container");
  const currentDay = response.days[0];
  const nextDay = response.days[1];
  const allHours = [...currentDay.hours, ...nextDay.hours];

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

  clearContainer(currentDayContainer);
  appendHeader(currentDayContainer, currentDayHeader);
  const currentDayFlexContainer = document.createElement("div");
  currentDayFlexContainer.classList.add("current-day-flex-container");
  currentDayContainer.appendChild(currentDayFlexContainer);

  selectedHours.forEach((hour) => {
    const { convertedString } = convertHourFormat(hour.datetime);
    const currentHourContainer = document.createElement("div");
    currentHourContainer.classList.add("hour-container");
    const currentDayHour = document.createElement("div");
    currentDayHour.innerText = convertedString;
    const currentHourConditionText = hour.conditions;
    const currentHourCondition = createImage(
      displayConditionIcon(currentHourConditionText),
      currentHourConditionText,
      currentHourConditionText
    );
    const currentHourTemp = document.createElement("div");
    currentHourTemp.textContent = hour.temp;
    setTempTextContent(hour.temp, currentHourTemp, State.selectedUnitGroup);

    currentHourContainer.appendChild(currentDayHour.cloneNode(true));
    currentHourContainer.appendChild(currentHourCondition.cloneNode(true));
    currentHourContainer.appendChild(currentHourTemp.cloneNode(true));
    currentDayFlexContainer.appendChild(currentHourContainer.cloneNode(true));
  });
};

const displayAirConditions = (response) => {
  const airConditions = document.getElementById("air-conditions");
  const airConditionsHeader = document.createElement("h3");
  airConditionsHeader.classList.add("air-conditions-header");
  airConditionsHeader.textContent = "Air Conditions";
  const airConditionsFlexContainer = document.createElement("div");
  airConditionsFlexContainer.classList.add("air-conditions-flex-container");
  const airConditionsFlex1 = document.createElement("div");
  const airConditionsFlex2 = document.createElement("div");
  airConditionsFlexContainer.appendChild(airConditionsFlex1);
  airConditionsFlexContainer.appendChild(airConditionsFlex2);

  const feelsLike = document.createElement("div");
  const feelsLikeTemp = document.createElement("div");
  setTempTextContent(
    response.currentConditions.feelslike,
    feelsLikeTemp,
    State.selectedUnitGroup
  );
  feelsLike.textContent = `Feels Like: ${feelsLikeTemp.textContent}`;
  const currentWind = document.createElement("div");
  State.selectedUnitGroup === UNITGROUPS.METRIC
    ? (currentWind.textContent = `Wind Speed: ${response.currentConditions.windspeed} Km/h`)
    : (currentWind.textContent = `Wind Speed: ${response.currentConditions.windspeed} m/h`);
  const uvIndex = document.createElement("div");
  uvIndex.textContent = `UV Index: ${response.currentConditions.uvindex}`;

  clearContainer(airConditions);
  appendHeader(airConditions, airConditionsHeader);
  airConditionsFlex1.appendChild(feelsLike);
  airConditionsFlex1.appendChild(currentWind);
  airConditionsFlex2.appendChild(getCurrentPrecip(response));
  airConditionsFlex2.appendChild(uvIndex);
  airConditions.appendChild(airConditionsFlexContainer);
};
