import { UNITGROUPS } from "./settings.js";
//Helper functions
export const displayConditionIcon = (condition) => {
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

export const createImage = (src, alt) => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.title = alt;
  return img;
};

export const clearContainer = (container) => {
  if (container.hasChildNodes()) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
};

export const appendHeader = (container, header) => {
  if (!container.hasChildNodes()) {
    container.appendChild(header);
  }
};

export const getCurrentPrecip = (response) => {
  const precip = document.createElement("div");
  precip.textContent = response.precipprob
    ? `Chance of rain: ${response.precipprob}%`
    : "Chance of rain: 0%";
  return precip;
};

export const showLoading = (element, message) => {
  element.style.display = "block";
  element.innerText = message;
};

export const hideLoading = (element) => {
  element.style.display = "none";
  element.innerText = "";
};

export const setTempTextContent = (response, element, unitGroup) => {
  switch (unitGroup) {
    case UNITGROUPS.METRIC:
      element.textContent = `${response}°C`;
      break;
    case UNITGROUPS.US:
      element.textContent = `${response}°F`;
      break;
  }
};
