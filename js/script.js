//My KEY at weatherbit
const KEY = `8044628603484ccfaabc63fb293bb638`;

//get the button and inputs
const btn_search_weather = document.querySelector('button');
const inp_city = document.querySelector('input');

//starting point of the application is when clicking the searchbutton
btn_search_weather.addEventListener('click', e => removeOldSearch()); //clear old search results
btn_search_weather.addEventListener('click', e => getCurrentWeater(inp_city.value, KEY));
btn_search_weather.addEventListener('click', e => get5dayForecast(inp_city.value, KEY));


// Embed the api call in a function and pass args text and size
function getCurrentWeater(city, key){
  
    const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${key}&lang=sv`;

    fetch(url) //Send a request to the API
    .then(responseFunction) //When the promise is fulfilled, run the function responseFunction 
    .then(getWeather) //When that promise is fulfilled, run the function getWeather 
    .catch(errorFunction); // If the promises are not fulfilled then catch it with calling the errorFunction
}

function get5dayForecast(city, key){
  
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}&lang=sv`;

    fetch(url) //Send a request to the API
    .then(responseFunction) //When the promise is fulfilled, run the function responseFunction 
    .then(getForecast) //When that promise is fulfilled, run the function getWeather 
    .catch(errorFunction); // If the promises are not fulfilled then catch it with calling the errorFunction
}


// Checks if the response http response is ok (eg 200-299)
// If it is a good response then parse it to json format with the .json()-method
// If not, write a message to the console
function responseFunction(response){
    //console.log(response);

    if(response.status>=200 && response.status<300){
        return response.json();
    }
    else{
        displayErrorMsg(response.status);
        throw 'Something went wrong. :(';
    }
}

//Put together the URL for the image and get the result in the response from the API
function getWeather(data){
  
    const res_desc = document.querySelector('#current-description');
    const res_temperature = document.querySelector('#current-temp');
    const res_wind = document.querySelector('#current-wind');
    const res_humidity = document.querySelector('#current-humidity');
    const img_icon = document.querySelector('#current-weather div img');

    res_desc.innerText = 'Dagens väder: ' + data.data[0].weather.description;
    res_temperature.innerText = "Temperatur " + Math.round(data.data[0].temp) + " °C";
    res_wind.innerText = "Vindhastighet " + Math.round(data.data[0].wind_spd) + " m/s";
    res_humidity.innerText = "Luftfuktighet " + Math.round(data.data[0].rh) + " %";

    img_icon.src = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
    img_icon.alt = 'ikon kan inte laddas';
    
}

function getForecast(data){
    const forecastDiv = document.querySelectorAll('#forecast-weather > div');
    const forecast = document.querySelectorAll('#forecast-weather');

    for (let i = 0; i < forecast[0].children.length; i++) {
        forecast[0].children[i].children[0].src = `https://www.weatherbit.io/static/img/icons/${data.data[i+1].weather.icon}.png`;
        forecast[0].children[i].children[0].alt = "ikon kan inte laddas";
        forecast[0].children[i].children[1].innerText = data.data[i+1].weather.description;
        forecast[0].children[i].children[2].innerText = Math.round(data.data[i+1].temp) + " °C";

        //add weekday
        const p = document.createElement('p');
        p.className = 'weekday';
        p.innerText = getDayOfWeek(data.data[i+1].datetime);
        forecastDiv[i].insertBefore(p, forecastDiv[i].firstChild);
    }

    
}


// Accepts a Date object or date string that is recognized by the Date.parse() method
function getDayOfWeek(date) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : 
      ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'][dayOfWeek];
  }

//remove old searchresult and errormessages before new search is executed
function removeOldSearch(){
    console.log('remove');
    const res_desc = document.querySelector('#current-description');
    const res_temperature = document.querySelector('#current-temp');
    const res_wind = document.querySelector('#current-wind');
    const res_humidity = document.querySelector('#current-humidity');
    const img_icon = document.querySelector('#current-weather div img');
    const forecast = document.querySelectorAll('#forecast-weather');
    const forecast_weekday = document.querySelectorAll('.weekday');
    console.log(forecast[0].children);
    console.log(forecast[0].children.length);

    res_desc.innerText = "";
    res_temperature.innerText = "";
    res_wind.innerText = "";
    res_humidity.innerText = "";

    img_icon.src = "";
    img_icon.alt = "";

    //remove the added weekday
    for (let i = 0; i < forecast_weekday.length; i++) {
        forecast_weekday[i].remove();  
    }

    //clear forecast
    for (let i = 0; i < forecast[0].children.length; i++) {

        forecast[0].children[i].children[0].src = ``;
        forecast[0].children[i].children[0].alt = "";
        forecast[0].children[i].children[1].innerText = "";
        forecast[0].children[i].children[2].innerText = "";
    }

    

    displayErrorMsg(""); //reset error messages
}

// this function displays search-error to the user and print the catch-error to the console
function errorFunction(error){
    console.log('Error: ' , error);
    displayErrorMsg('Ändra din sökning eller kolla din anslutning');
}

  //function to add error messages to the error section on the website
function displayErrorMsg(errorText){
    const errorMsg = document.querySelector('#error-message');
    errorMsg.innerText = errorText;
  }