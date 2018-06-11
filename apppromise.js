//AIzaSyDHBZs81IgMexrdlRa2w3ZoxhXJdmwKouA
const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
    a: {
        demand: true,
        alias: 'address',
        describe: 'Address to fetch weather for',
        string: true
    }
})
    .help()
    .alias("help", 'h')
    .argv;
var objData = {
    address: "",
    latitude: "",
    longitude: "",
    weather: ""
}
var encodeCmd = encodeURIComponent(argv.a);
var geocodLink = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeCmd}&key=AIzaSyDHBZs81IgMexrdlRa2w3ZoxhXJdmwKouA`;
axios
    .get(geocodLink)
    .then((response) => {
        if (response.data.status === "ZERO_RESULTS") {
            throw new Error("unable to find that address.")
        }
        var address = response.data.results["0"].formatted_address;
        var lat = response.data.results["0"].geometry.location.lat;
        var long = response.data.results["0"].geometry.location.lng
        var weatherLink = `https://api.darksky.net/forecast/4a887e83d8315445575f12c9f8ec533c/${lat},${long}`
        objData.address = address;
        objData.latitude = lat;
        objData.longitude = long;
        return axios.get(weatherLink);
    })
    .then((response) => {
        var temprature = response.data.currently.temperature;
        objData.weather = temprature;
        console.log(objData);
    })
    .catch((err) => {
        if (err.code === "ENOTFOUND") {
            console.log("unable to connect to api : ", err)
        } else {
            console.log("reading error",err.message)
        }
    });