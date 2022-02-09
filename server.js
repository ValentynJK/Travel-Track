import express from 'express'
const app = express(); // creates Express.js app
import fetch from 'node-fetch'
import 'dotenv/config' // for env vars 

// console.log(process.env)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public')); // shows public folder;
app.use(express.json({limit: '1mb' })); // converts request data to json object


// Foursquare API Info

const foursquareKey = process.env.foursquareKey;
const placeUrl = 'https://api.foursquare.com/v3/places/search?near='; // url to GET the place
const placeImgUrl = 'https://api.foursquare.com/v3/places/' // url for to GET the photo

// OpenWeather Info
const openWeatherKey = process.env.openWeatherKey;
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Foursquare request params

const FoursquareParams = {
    method: 'GET',
    headers: {
        Authorization: foursquareKey,
        Accept: 'application/json',
    }
};

// Post places object to client



app.post('/places_api', async (request, response) => {
    // console.log(request.body);
    const requestData = request.body;
    const inputCity = requestData.cityName;
    
    getPlaces(inputCity).then(places => {
        const placesArr = places;
        // console.log(placesArr);
        response.json(places); 
        
    })
})




// Post weather data to client

app.post('/weather_api', async (request, response) => {
    const requestData = request.body;
    const inputCity = requestData.cityName;
    getForecast(inputCity).then(places => response.json(places))
})



// GET request to Foursquare

const getPlaces = async (city) => {
    // const city = $input.val();
    const urlEndpoint = `${placeUrl}${city}&limit=4`;
    try {
        const response = await fetch(urlEndpoint, FoursquareParams);
        if (response.ok) {
            const jsonResponse = await response.json();
            const places = jsonResponse.results;
            return places
        }
    }
    catch(error) {
        console.log(error)
    }
}


// GET request to OpenWeather

const getForecast = async (city) => {
    const urlToFetch = `${weatherUrl}?q=${city}&appid=${openWeatherKey}`;
    console.log(urlToFetch)
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
      }
    }
    catch(error) {
        console.log(error)
    }
};

  // GET async request to Foursquare to get place image
  
const getImage = async (placeIdsObj) => {
    const placeIds = placeIdsObj.idList;
    
    let linkArray = [];
    for (const id of placeIds) {
            // console.log(placeIds.length) 
            const endPoint = `${placeImgUrl}${id}/photos?limit=5&sort=POPULAR`;
            // console.log(endPoint)
            const response = await fetch(endPoint, FoursquareParams);
            const jsonResponse = await response.json();
            const link = renderPhoto(jsonResponse[0]);
            linkArray.push(link)
    }
    return linkArray
}


// Post photos of object to client


app.post('/photos_api', async (request, response) => {
    const requestData = request.body;
    // console.log(requestData);
    getImage(requestData).then(result => response.json(result))
})


    // Creating photo link from place object

const renderPhoto = (photo) => {
    return (`${photo.prefix}original${photo.suffix}`)
}
