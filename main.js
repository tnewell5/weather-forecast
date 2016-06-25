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
    let weatherRequest = new XMLHttpRequest();
    weatherRequest.open('GET', googleQuery);
    weatherRequest.send(null);

    weatherRequest.onreadystatechange = () => {
      let DONE = 4, OK = 200;
      // console.log('DONE: ', DONE);
      // console.log('OK: ', OK);
      if (weatherRequest.readyState === DONE) {
        if (weatherRequest.status === OK) {
          //console.log(weatherRequest.responseText);
          let response = JSON.parse(weatherRequest.responseText);
          const lat = response.results[0].geometry.location.lat;
          const lng = response.results[0].geometry.location.lng;
          console.log('lat: ', lat);
          console.log('lng: ', lng);

          // https://api.forecast.io/forecast/8a4792098133e39137a3a5426aa457bd/40.75368539999999,-73.9991637
          let forecastQuery = 'https://api.forecast.io/forecast/' + FORECAST_API_KEY + '/' + lat + ',' + lng;
          console.log('forecastQuery: ', forecastQuery);
        }
        else {
          console.log('request error');
        }
      }
    } // close onreadystatechange




  }); // close event listener






}; // close window.onload
