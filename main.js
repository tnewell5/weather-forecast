window.onload = function(){
  console.log('window has loaded!');

  const submitButton = document.querySelector('#submit-button');
  submitButton.addEventListener('click', () => {
    //console.log('submit button was clicked!');
    // capture zip code value, convert to coordinates, make API call
    let userZip = document.querySelector('#user-zip').value;
    //console.log('userZip: ', userZip);

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
        //loop over response and call displayDay() for each day

        function displayDailyForecast(object) {
          for (let i = 0; i < 7; i += 1) {
            //set up daily div:
            let flexForecastDiv = document.querySelector('#flex-forecast');
            let dayDiv = document.createElement('div');
            dayDiv.classList.add("daily-forecast-div");

            //display date:
            let dayHeader = document.createElement('h3');
            let day = new Date(response.daily.data[i].time * 1000);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let formattedDay = day.toLocaleDateString('en-US', options);
            dayHeader.innerText = formattedDay;
            dayDiv.appendChild(dayHeader);

            //display daily high temp:
            let tempMaxDiv = document.createElement('div');
            let tempMax = response.daily.data[i].temperatureMax;
            tempMaxDiv.innerText = 'Daily High: ' + tempMax;
            tempMaxDiv.classList.add('bottom-padding');
            dayDiv.appendChild(tempMaxDiv);

            //display daily low temp:
            let tempMinDiv = document.createElement('div');
            let tempMin = response.daily.data[i].temperatureMin;
            tempMinDiv.innerText = 'Daily Low: ' + tempMin;
            tempMinDiv.classList.add('bottom-padding');
            dayDiv.appendChild(tempMinDiv);

            //display apparent daily high temp:
            let appTempMaxDiv = document.createElement('div');
            let appTempMax = response.daily.data[i].apparentTemperatureMax;
            appTempMaxDiv.innerText = 'Apparent Daily High: ' + appTempMax;
            appTempMaxDiv.classList.add('bottom-padding');
            dayDiv.appendChild(appTempMaxDiv);

            //display apparent daily low temp:
            let appTempMinDiv = document.createElement('div');
            let appTempMin = response.daily.data[i].apparentTemperatureMin;
            appTempMinDiv.innerText = 'Apparent Daily Low: ' + appTempMin;
            appTempMinDiv.classList.add('bottom-padding');
            dayDiv.appendChild(appTempMinDiv);

            flexForecastDiv.appendChild(dayDiv);
          } // close for loop
        } // close displayDailyForecast

        displayDailyForecast(response.daily.data);

        // let appTempMax = response.daily.data[0].apparentTemperatureMax;
        // let appTempMin = response.daily.data[0].apparentTemperatureMin;
        // let summary = response.daily.data[0].summary;
        // let icon = response.daily.data[0].icon;
        // console.log('tempMax: ', tempMax);
        // console.log('tempMin: ', tempMin);
        // console.log('appTempMax: ', appTempMax);
        // console.log('appTempMin: ', appTempMin);
        // console.log('summary: ', summary);
        // console.log('icon: ', icon);



      }

      let script = document.createElement('script');
      script.src = forecastQuery + '?callback=myCallback';
      document.getElementsByTagName('head')[0].appendChild(script);
    } // close onload

    googleRequest.onerror = () => {
       console.log('googleRequest error');
    };



  }); // close event listener


}; // close window.onload
