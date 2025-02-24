const inputLocation = document.getElementById("input-location");
const submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  getWeatherInfo(inputLocation.value);
});
const locationContainer = document.getElementById("location-container");
const dateContainter = document.getElementById("date-container");

const getWeatherInfo = async (location) => {
  try {
    const loading = document.getElementById("loading");
    loading.innerText = "loading"

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=KR7QNXQQLPNJN5WYLDDYF2JJW&contentType=json`
    );

    loading.innerText = "";
    locationContainer.innerHTML = "";
    dateContainter.innerHTML = "";

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const responseData = await response.json();
    // console.log(responseData)

    // get and display address
    const getAddress = (response) => ({
      responseAddress: response.address,
      responseResolvedAddress: response.resolvedAddress,
    });

    const displayAddress = (response) => {
      const { responseAddress, responseResolvedAddress } = getAddress(response);
      const locationAddress = document.createElement("div");
      const locationResolvedAddress = document.createElement("div");

      locationAddress.innerText = responseAddress;
      locationResolvedAddress.innerText = responseResolvedAddress;

      locationContainer.appendChild(locationAddress);
      locationContainer.appendChild(locationResolvedAddress);
    };

    // Get and display days
    const getDays = (response) => response.days;

    const displayDays = (response) => {
      const responseDays = getDays(response);
      responseDays.forEach((day) => {
        const dateAndTemp = document.createElement("div");
        dateAndTemp.innerText = `Date: ${day.datetime} Max: ${day.tempmax} Min: ${day.tempmin}`;
        dateContainter.appendChild(dateAndTemp.cloneNode(true));
      });
    };
    displayDays(responseData);
    displayAddress(responseData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
};
