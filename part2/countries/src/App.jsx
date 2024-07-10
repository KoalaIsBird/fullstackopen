import { useState, useEffect } from 'react'
import axios from 'axios'

const WEATHER_KEY = import.meta.env.VITE_SOME_KEY


const Countries = ({ countries, handleShow }) => {
  if (countries.length > 10) {
    return (
      <p>
        Too many matches, specify another filter
      </p>
    )
  } else if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country =>
          <li>
            {country.name.common}
            <button onClick={() => handleShow(country.name.common)}>show</button>
          </li>)}
      </ul>
    )
  } else if (countries.length === 1) {
    return (
      <CountryPage country={countries[0]} />
    )
  } else {
    return (
      <p>No match available, specify another filter</p>
    )
  }
}


const CountryPage = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital[0]
  const capitalLatlng = country.capitalInfo.latlng
  if (!weather) {
    console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${capitalLatlng[0]}&lon=${capitalLatlng[1]}&appid=${WEATHER_KEY}&units=metric`);
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${capitalLatlng[0]}&lon=${capitalLatlng[1]}&appid=${WEATHER_KEY}&units=metric`)
      .then(data => setWeather(data.data))
  }
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        capital {capital} <br />
        area {country.area}
      </p>
      <h2>languages:</h2>
      <ul>
        {Object.entries(country.languages).map(languagePair => <li>{languagePair[1]}</li>)}
      </ul>
      <img src={country.flags.png} />
      <Weather city={capital} data={weather} />
    </div>
  )
}


const Weather = ({ city, data }) => {
  if (!data) {
    return (
      <div>
        <h2>Weather in {city}</h2>
        <p>weather data has not been retrieved yet</p>
      </div>
    )
  }
  else {
    return (
      <div>
        <h2>Weather in {city}</h2>
        <p>temperature {data.main.temp} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} />
        <p>wind {data.wind.speed} m/s</p>
      </div>
    )
  }
}



const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(data => setCountries(data.data))
  }, [])


  const handleChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleShow = countryName => {
    setSearchQuery(countryName)
  }

  const matchingCountries = countries.filter(country => (
    country.name.common.toLowerCase()
      .includes(searchQuery.toLowerCase())
  ))

  return (
    <div>
      find countries
      <input onChange={handleChange} />
      <Countries countries={matchingCountries} handleShow={handleShow} />
    </div>
  )
}

export default App
