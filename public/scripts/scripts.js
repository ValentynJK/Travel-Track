const button = document.getElementById('button');
const cityInput = document.getElementById('city');

// submit button to be clicked by Enter

cityInput.addEventListener('keydown', event => {
    if(event.key === 'Enter') {
        event.preventDefault();
        button.click()
    }
})

// function gets information about places. Result - object

const getPlaces = async () => {
//    const cityName = document.getElementById('city').val;
   const cityName = document.getElementById('city').value;
   const data = { cityName };
//    const data = { cityName };
//    console.log(data); // to check
   const options = {
       method: 'POST', 
       headers: {
           "Content-Type": "application/json"
       },
       body: JSON.stringify(data)
   }
   const response = await fetch('/places_api', options);
   const responseData = await response.json();
//    console.log(responseData)
   return responseData
}

// function gets information about weather. Result - object

const getWeather = async () => {
    //    const cityName = document.getElementById('city').val;
       const cityName = document.getElementById('city').value;
       const data = { cityName };
    //    const data = { cityName };
    //    console.log(data); // to check
       const options = {
           method: 'POST', 
           headers: {
               "Content-Type": "application/json"
           },
           body: JSON.stringify(data)
       }
       const response = await fetch('/weather_api', options);
       const responseData = await response.json();
       return responseData
}

const getPhotos = async (places) => {
    let idList = [];
    places.forEach(place => {
        const placeId = place.fsq_id;
        idList.push(placeId)
    });
    const data = { idList }
    const options  = {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/photos_api', options);
    const responseData = await response.json();
    return responseData

}


// page query elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $placeDivs = [$("#place1"), $("#place2"), $("#place3"), $("#place4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


const renderPlaces = (places) => {
    $placeDivs.forEach(($place, index) => {
      const place = places[index];
      const placeIcon = place.categories[0].icon;
      const placeImgSource = `${placeIcon.prefix}bg_64${placeIcon.suffix}`;
      const placeId = place.fsq_id;
    //   getImage(placeId, $place);
      const placeContent = createPlaceHTML(place.name, place.location, placeImgSource)
      $place.append(placeContent);
    })
    $destination.append(`<h2>${places[0].location.locality}</h2>`)
  }
    
  const renderForecast = (forecast) => {
    const weatherContent = createWeatherHTML(forecast);
    $weatherDiv.append(weatherContent);
  };

  const executeSearch = () => {
    
    $placeDivs.forEach(place => place.empty());
    $weatherDiv.empty();
    $destination.empty();
    $container.css("visibility", "visible");
    getPlaces().then(places => {
        renderPlaces(places);
        getPhotos(places).then(photos => {
            $placeDivs.forEach((place, index) => {
                place.append(createImageHTML(photos[index]))
            })
        })
    })
    getWeather().then(forecast => renderForecast(forecast));
    return false;
  }

  $submit.click(executeSearch);