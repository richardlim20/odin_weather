const inputLocation = document.getElementById("input-location");
const submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  getWeatherInfo(inputLocation.value);
});

const getWeatherInfo = (location) => {
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=KR7QNXQQLPNJN5WYLDDYF2JJW&contentType=json`
  )
    //Turns into js object
    .then(
      (getObject = (response) => {
        return response.json();
      })
    )
    .then(
      (getAllInfo = (response) => {
        //Logs all responses
        console.log(response);

        //Logs addresses
        getAddress = (response) => {
          let responseAddress = response.address;
          let responseResolvedAddress = response.resolvedAddress;
          console.log(responseAddress);
          console.log(responseResolvedAddress);
          return responseAddress, responseResolvedAddress;
        };

        //Logs dates and temperatures
        getDays = (response) => {
          let responseDays = response.days;
          console.log(responseDays);
          responseDays.forEach((day) => {
            console.log(
              "Date: " +
                day.datetime +
                " Max: " +
                day.tempmax +
                " Min: " +
                day.tempmin
            );
          });
          return responseDays;
        };
        getDays(response);
        getAddress(response);
      })
    )
    .catch(
      (catchError = (err) => {
        console.log("error");
      })
    );
};

getWeatherInfo();
