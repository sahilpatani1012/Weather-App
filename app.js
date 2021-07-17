require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');

const https = require("https");

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(__dirname + "/public"));

const weatherDetails = [];

app.get("/", function (req, res) {
    res.render("homepage");
})

app.post("/", function (req, res) {
    console.log("Post request recieved");
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    https.get("https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const country = weatherData.sys.country;
            const description = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.render("WeatherPage", { country: country, city: query, desc: description, temp: temp, img: imgURL });
        })
    })
})

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server started at port 3000");
});