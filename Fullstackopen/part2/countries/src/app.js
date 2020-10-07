import './index.css';

import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'

import Input from '@material-ui/core/Input';
import IconLabelButtons from './iconbuttonlib';
import VisibilityIcon from '@material-ui/icons/Visibility';

const IconButton = (props) => {
  return(
    <span>
      {IconLabelButtons(props.variant, props.type, props.color, props.text, props.icon, props.handleClick)}
    </span>
  )
}

const WeatherIcons = (props) => {
  if(props.icons) {
    return(props.icons.map((icon, idx) => {
      return <img key={idx} src={icon} alt="Weather Icon" />
    }));
  } else {
    return null;
  }
}

const Weather = (props) => {
  const request = `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${props.query}`;

  const [weather, setWeather] = useState({});

  const hook = () => {
    axios
      .get(request)
      .then(response => {
        setWeather(response.data.current);
      })
  }

  useEffect(hook, []);

  return(
    <div>
      <h2>Weather in {props.query}</h2>
      <p><strong>temperature:</strong> {weather.temperature} Celsius</p>
      <WeatherIcons icons={weather.weather_icons} />
      <p><strong>wind:</strong> {weather.wind_speed} mph direction {weather.wind_dir}</p>
    </div>
  )
}

const Search = (props) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const getSearchResults = (countries, searchTerm) => {
    return countries.filter((country) => {
      return country.name.toUpperCase().includes(searchTerm.toUpperCase());
    });
  }

  const updateSearchInput = (event) => {
    setSearchTerm(event.target.value);
    setSearchResults(getSearchResults(props.countries, event.target.value));
  }

  const showDetails = (country) => {
    return(
      <Fragment>
        <h1>{country.name}</h1>
        <p>capital: {country.capital}</p>
        <p>population: {numberWithCommas(country.population)}</p>
        <h2>languages</h2>
        {country.languages.map((language) => {
          return (
            <li 
              key={language.iso639_2}>{language.name}
            </li>)
          })}
        <br></br>
        <img src={country.flag} alt="Flag" style={{width: 150, height: 100}}/>
        <Weather query={country.capital} />
      </Fragment>
    )
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function handleShowClick(identifier) {
    const country = props.countries.filter((country) => {
      return country.numericCode === identifier;
    });

    setSearchResults(country);
  }

  const showResults = (results) => {
    if(results.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if(results.length > 1 && results.length <= 10) {
      return results.map((country) => {
        return (
          <li 
            key={country.numericCode}>{country.name} <IconButton variant="contained" type="button" color="primary" text="show" icon={<VisibilityIcon/>} handleClick={() => handleShowClick(country.numericCode)} />
          </li>)
      })
    } else if(results.length === 1) {
      return showDetails(results[0]);
    }
  }

  return(
    <Fragment>
      <div>
        <Input name='Search' value={searchTerm} type="text" placeholder='enter a country' onInput={updateSearchInput}/>
      </div>
      <br></br>
     <div>
       {showResults(searchResults)}
     </div>
    </Fragment>
  )
}

const App = () => {

  const [countries, setCountries] = useState([]);

  const hook = () => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      })
  }

  useEffect(hook, []);

  return (
    <div>
      <Search countries={countries} />
    </div>
  )
}

export default App