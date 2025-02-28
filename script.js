import { showLoading, hideLoading } from "./helperFunctions.js";
import { updateUI } from "./updateUI.js";
import { UNITGROUPS, State } from "./settings.js";

const getWeatherInfo = async (location, unitGroup) => {
  try {
    const loading = document.getElementById("loading");
    showLoading(loading, "Loading...");
    const response = await fetchWeatherData(location, unitGroup);
    hideLoading(loading);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const responseData = await response.json();
    updateUI(responseData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  } finally {
    hideLoading(loading);
  }
};

const fetchWeatherData = async (location, unitGroup) => {
  const API_KEY = "KR7QNXQQLPNJN5WYLDDYF2JJW";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`;
  return await fetch(url);
};

const inputLocation = document.getElementById("input-location");
const submit = document.getElementById("submit");
const unitGroupToggle = document.getElementById("unit-group");
let currentLocation = "Melbourne";
State.selectedUnitGroup = UNITGROUPS.METRIC;

//Event Listeners
submit.addEventListener("click", () => {
  currentLocation = inputLocation.value;
  getWeatherInfo(currentLocation, State.selectedUnitGroup);
});
inputLocation.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    currentLocation = inputLocation.value;
    getWeatherInfo(currentLocation, State.selectedUnitGroup);
  }
});
unitGroupToggle.addEventListener("click", () => {
  unitGroupToggle.checked
    ? (State.selectedUnitGroup = UNITGROUPS.METRIC)
    : (State.selectedUnitGroup = UNITGROUPS.US);
  getWeatherInfo(currentLocation, State.selectedUnitGroup);
});

getWeatherInfo(currentLocation, State.selectedUnitGroup);
