window.onload = function(){
  console.log('window has loaded!');

  const submitButton = document.querySelector('#submit-button');
  submitButton.addEventListener('click', () => {
    //console.log('submit button was clicked!');
    // capture zip code value, convert to coordinates, make API call
    let userZip = document.querySelector('#user-zip').value;
    //console.log('userZip: ', userZip);
    //make sure user entered a valid zip code
    if (userZip.length !== 5 || /\D/.test(userZip)) {
      alert('Please enter a valid zip code');
    }
    else {
      let googleQuery = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + userZip+ '&key=' + GOOGLE_API_KEY;
      //console.log('googleQuery: ', googleQuery);
      let googleRequest = new XMLHttpRequest();
      googleRequest.open('GET', googleQuery);
      googleRequest.send(null);

      googleRequest.onload = () => {
        let response = JSON.parse(googleRequest.responseText);
        const lat = response.results[0].geometry.location.lat;
        const lng = response.results[0].geometry.location.lng;
        console.log('lat: ', lat);
        console.log('lng: ', lng);

        let forecastQuery = 'https://api.forecast.io/forecast/' + FORECAST_API_KEY + '/' + lat + ',' + lng;
        console.log('forecastQuery: ', forecastQuery);

        window.myCallback = function(response) {
          console.log(response);

          //render 7 day forecast with temperature, apparentTemperature, summary, icon
          //loop over response and display data for each day
          function displayDailyForecast(object) {
            let headerArray = document.querySelectorAll('.header');
            let sevenDayHeader = document.querySelector('.seven-day-header');
            sevenDayHeader.classList.remove('hidden');

            for (let k = 0; k < headerArray.length; k += 1) {
              headerArray[k].classList.remove('hidden');
            }

            for (let i = 0; i < 7; i += 1) {
              //set up daily div:
              let flexForecastDiv = document.querySelector('#flex-forecast');
              let dayDiv = document.createElement('div');
              dayDiv.classList.add("daily-forecast-div");

              //display date:
              let dayHeader = document.createElement('h4');
              let day = new Date(response.daily.data[i].time * 1000);
              //const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              const options = {weekday: 'long', month: 'long', day: 'numeric'};
              let formattedDay = day.toLocaleDateString('en-US', options);
              dayHeader.innerText = formattedDay;
              dayHeader.classList.add('forecast-component');
              dayHeader.classList.add('medium');
              dayDiv.appendChild(dayHeader);

              function displayComponent(description, className) {
                let someDiv = document.createElement('div');
                someDiv.innerText = description;
                someDiv.classList.add('forecast-component');
                someDiv.classList.add(className);
                dayDiv.appendChild(someDiv);
              }

              //display daily high temp:
              let tempMax = response.daily.data[i].temperatureMax;
              displayComponent(tempMax, 'short');

              //display daily low temp:
              let tempMin = response.daily.data[i].temperatureMin;
              displayComponent(tempMin, 'short');

              //display apparent daily high temp:
              let appTempMax = response.daily.data[i].apparentTemperatureMax;
              displayComponent(appTempMax, 'short');

              //display apparent daily low temp:
              let appTempMin = response.daily.data[i].apparentTemperatureMin;
              displayComponent(appTempMin, 'short');

              //display summary:
              let summary = response.daily.data[i].summary;
              displayComponent(summary, 'long');

              //display icon:
              console.log(response.daily.data[i].icon);
              let iconImg = new Image(24, 24);

              let iconText = response.daily.data[i].icon;
              if (/partly-cloudy/i.test(iconText)) {
                iconImg.src = 'images/partly-cloudy.png';
              }
              else if (/cloudy/i.test(iconText)) {
                iconImg.src = 'images/cloudy.png';
              }
              else if (/rain/i.test(iconText)) {
                iconImg.src = 'images/rainy.png';
              }
              else if (/clear/i.test(iconText)) {
                iconImg.src = 'images/sunny.png';
              }

              iconImg.classList.add('icon');
              dayDiv.appendChild(iconImg);

              flexForecastDiv.appendChild(dayDiv);
            } // close for loop
          } // close displayDailyForecast

          displayDailyForecast(response.daily.data);



        } //close window.myCallback

        let script = document.createElement('script');
        script.src = forecastQuery + '?callback=myCallback';
        document.getElementsByTagName('head')[0].appendChild(script);
      } // close onload

      googleRequest.onerror = () => {
         console.log('googleRequest error');
      };

    } // close else stmt

  }); // close event listener


}; // close window.onload
