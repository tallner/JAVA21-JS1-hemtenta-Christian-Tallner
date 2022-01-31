//My KEY at weatherbit
const KEY = `8044628603484ccfaabc63fb293bb638`;

//get the button and inputs
const btn_search_weather = document.querySelector('button');
const inp_city = document.querySelector('input');

//starting point of the application is when clicking the searchbutton
btn_search_weather.addEventListener('click', e => removeOldSearch()); //clear old search results
btn_search_weather.addEventListener('click', e => getCurrentWeater(inp_city.value, KEY));
btn_search_weather.addEventListener('click', e => get5dayForecast(inp_city.value, KEY));

//btn_forecast.addEventListener('click', e => removeOldSearch());
//btn_forecast.addEventListener('click', e => get16dayForecast(inp_city.value, KEY)); //
// btn_search.addEventListener('click', e => getImages(//get images
//     inp_search_string.value,//add searchstring
//     inp_img_size.value,//add size
//     inp_nr_img.value)); //add number of objects
//btn_current_weather.addEventListener('click', e => btn_current_weather.disabled = true);//disable the button during search so you cannot doublepress it
//btn_forecast.addEventListener('click', e => btn_forecast.disabled = true);//disable the button during search so you cannot doublepress it


// Embed the api call in a function and pass args text and size
function getCurrentWeater(city, key){
  
    const url = `https://api.weatherbit.io/v2.0/current?city=${city}&key=${key}&lang=sv`;

    fetch(url) //Send a request to the API
    .then(responseFunction) //When the promise is fulfilled, run the function responseFunction 
    .then(getWeather) //When that promise is fulfilled, run the function getWeather 
    .catch(errorFunction); // If the promises are not fulfilled then catch it with calling the errorFunction
}

function get5dayForecast(city, key){
  
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;

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
    console.log(data);
    const res_desc = document.querySelector('#current-description');
    const res_temperature = document.querySelector('#current-temp');
    const res_wind = document.querySelector('#current-wind');
    const res_humidity = document.querySelector('#current-humidity');
    const img_icon = document.querySelector('#current-weather div img');

    res_desc.innerText = data.data[0].weather.description;
    res_temperature.innerText = "Temperatur " + Math.round(data.data[0].temp) + " °C";
    res_wind.innerText = "Vindhastighet " + Math.round(data.data[0].wind_spd) + " m/s";
    res_humidity.innerText = "Luftfuktighet " + Math.round(data.data[0].rh) + " %";

    img_icon.src = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
    img_icon.alt = 'ikon kan inte laddas';
    
}

function getForecast(data){
    console.log(data);

    const description = document.querySelector('#current-description');
    const temperature = document.querySelector('#current-temp');
    const wind = document.querySelector('#current-wind');
    const humidity = document.querySelector('#current-humidity');


    const main = document.createElement('main'); 
    const h2_city = document.createElement('h2'); 
    const ul = document.createElement('ul');

    h2_city.innerText = "Location: "+ data.city_name;

    document.body.appendChild(main);
    main.appendChild(h2_city);
    main.appendChild(ul);

    
    for (const iterator of data.data) {
        console.log(iterator.temp);
        console.log(iterator.datetime);

        const li = document.createElement('li');
        const icon = document.createElement('img');
        icon.src = `https://www.weatherbit.io/static/img/icons/${iterator.weather.icon}.png`;

        li.innerHTML = 
            iterator.datetime +
            " " +
            iterator.weather.description +
            ", Temp: " + iterator.temp + "°C" +
            ", Wind: " + iterator.wind_spd + "m/s " +
            //icon;
           `<img src='${icon.src}' width='35' alt='no img'> </img>`;

        icon.addEventListener("error", imgError);
        
        ul.appendChild(li);
    }
   
}



//remove old searchresult and errormessages before new search is executed
function removeOldSearch(){
    const res_desc = document.querySelector('#current-description');
    const res_temperature = document.querySelector('#current-temp');
    const res_wind = document.querySelector('#current-wind');
    const res_humidity = document.querySelector('#current-humidity');
    const img_icon = document.querySelector('#current-weather div img');

    res_desc.innerText = "";
    res_temperature.innerText = "";
    res_wind.innerText = "";
    res_humidity.innerText = "";

    img_icon.src = "";
    img_icon.alt = "";

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