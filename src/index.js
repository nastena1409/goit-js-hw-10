import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    const searchQuery = e.target.value.trim();
    if (!searchQuery) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    }

    fetchCountries(searchQuery)
        .then(checkData)
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            refs.countryList.innerHTML = '';
            refs.countryInfo.innerHTML = '';
        })
}


function checkData(data) {
    if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';

        return;
    } if (data.length >= 2 && data.length <= 10) {
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = renderCountiesList(data);

        return;
    }  if (data.length === 1) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = renderCountryInfo(data);
        return;
    }   
} 

function renderCountiesList(countries) {
    return countries
        .map((country) => {
            return `
            <li class="country-list-item">
                <img width="40" height="30" class="country-flag" src="${country.flags.svg}" alt="${country.name.official}">
                <p class="country-list-name">${country.name.official}</p>
            </li>`;
        })
        .join("");
};

function renderCountryInfo(country) {
    return country
        .map(
            ({
                name: { official },
                capital,
                population,
                flags: { svg },
                languages,
            }) => {
                return `
    <div class="country-data">
        <img class="country-flag" src="${svg}" alt="${official}" width ="50" height="30">
        <p class="country-name">${official}</p>
    </div>
    <ul class="country-info-list">
        <li>
            <p class="country-info-name">Capital:
                <span class="country-info-value">${capital}</span>
            </p>   
        </li>
        <li class="country-info-item">
            <p class="country-info-name">Population:
                <span class="country-info-value">${population}</span>
            </p>   
        </li>
        <li class="country-info-item">
            <p class="country-info-name">Languages:
                <span class="country-info-value">${Object.values(
                    languages).join(', ')}</span>
            </p>   
        </li>
    </ul>`}).join('')
}