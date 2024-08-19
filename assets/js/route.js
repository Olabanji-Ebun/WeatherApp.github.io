'use strict';

import { updateWeather, error404 } from "../js/app.js";
const defaultLocation = "#/weather?lat=51.5073219&lon=0.1276474" // London

const currentLocation = function () {

}

const searchedLocation = query => {

}

const routes = new Map([
    ["*/current-location", currentLocation],
    ["*/weather", searchedLocation]
]);

const checkHash = function () {

}

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
    
});