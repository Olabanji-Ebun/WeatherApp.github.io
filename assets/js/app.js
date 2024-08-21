'use strict';

console.log('JavaScript file loaded!');

import { fetchData, url } from '../js/api.js';
import * as module from "../js/module.js";

/**
 * Add event listener on multiple elements
 * @param {NodeList} elements Elements node array
 * @param {string} eventType Event type e.g: "click", "mouseover"
 * @param {Function} callback Callback function
 */
const addEventOnElements = function(elements, eventType, callback) {
    for (const element of elements) element.addEventListener(eventType, callback);
}

/**
 * Toggle search in mobile devices
 */
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);

/**
 * SEARCH INTEGRATION
 */
const searchFeild = document.querySelector("[data-search-feild]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchFeild.addEventListener("input", function(){

    searchTimeout ?? clearTimeout(searchTimeout);

    if (!searchFeild.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchFeild.classList.remove("searching");
    } else {
        searchFeild.classList.add("searching");
    }

    if (searchFeild.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchFeild.value), function (locations) {
                searchFeild.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>
                `;

                const /** {NodeList} | []*/ items = [];

                for (const { name, lat, lon, country, state} of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");

                    searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>

                        <div>
                            <p class="item-title">${name}</p>

                            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                        </div> 

                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name}" data-search-toggler></a>
                    `;

                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler"));
                }
            });
        }, searchTimeoutDuration);
    }

});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html
 * @param {number} lat latitude
 * @param {number} lon longtitude
 */
export const updateWeather = function (lat, lon) {

    loading.computedStyleMap.display = "grid";
    container.computedStyleMap.overflow = "hidden";
    container.classList.contains("fade-in") ?? container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]")
    const forecastSection = document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    if (window.location.hash === "#/current-location") {
        currentLocationBtn.setAttribute("disabled", "");
    } else {
        currentLocationBtn.removeAttribute("disabled");
    }

    /**
     * CURRENT WEATHER SECTION
     */
    fetchData(url.currentWeather(lat, lon), function(currentWeather) {

        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather
        const [{ description, icon }] = weather;
    });

}

