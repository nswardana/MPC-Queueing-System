var axios = require('axios');
var cron = require('node-cron');

var data = JSON.stringify({
  "api_key": "EEUDILXK3RUHSV76",
  "number_key": "9dTTQgeOm7rjrcKg",
  "phone_no": "0818223304",
  "message": "YOUR-MESSAGE"
});


cron.schedule('* * * * *', () => {
    axios.get('http://localhost:4002/message/sendwa')
  .then(function (response) {
    // handle success
    //console.log(response);
  })
  .catch(function (error) {
    // handle error
    //console.log(error);
  })
  .finally(function () {
    // always executed
  });
});