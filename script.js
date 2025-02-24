const inputLocation = document.getElementById("input-location");
const submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  getWeatherInfo(inputLocation.value);
});

const getWeatherInfo = async (location) => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=KR7QNXQQLPNJN5WYLDDYF2JJW&contentType=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const responseData = await response.json();

    // get and display address
    const getAddress = (response) => ({
      responseAddress: response.address,
      responseResolvedAddress: response.resolvedAddress,
    });

    const displayAddress = (response) => {
      const { responseAddress, responseResolvedAddress } = getAddress(response);
      console.log(responseAddress);
      console.log(responseResolvedAddress);
    };

    // Get and display days
    const getDays = (response) => response.days;

    const displayDays = (response) => {
      const responseDays = getDays(response);
      console.log(responseDays);
      responseDays.forEach((day) => {
        console.log(
          `Date: ${day.datetime} Max: ${day.tempmax} Min: ${day.tempmin}`
        );
      });
    };

    displayDays(responseData);
    displayAddress(responseData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
  }
};
