import './App.css';
import Select from "react-select";
import { useEffect, useState } from 'react';
import { City, Country } from 'country-state-city';
import { AreaChart, Card } from '@tremor/react';
import { Metric } from '@tremor/react';
import { Title } from '@tremor/react';

import { blue, green } from '@mui/material/colors';
// import AreaChartCard from './components/AreaChartCard';
// import LineChartCard from './components/LineChartCard';
function App() {
  const [allCountries, setAllCountries]=useState([]);
  const [selectedCountry, setSelectedCountry]=useState({});
  const [selectedCity, setSelectedCity]=useState([]);
  const [weatherDetails, setWeatherDetails]=useState([]);
  useEffect(() => {
    setAllCountries(
      Country.getAllCountries().map((country) =>({
        value: {
          latitude: country.latitude,
          longitude: country.longitude,
          isoCode: country.isoCode,
        },
        label: country.name,

      }))
    );
    },[]);
const handleSelectedCountry=(option) => {
  setSelectedCountry(option);
  setSelectedCity(null);
};
const handleSelectedCity=(option) =>{
  setSelectedCity(option);
};
const getWeatherDetails=async(e) =>{
e.preventDefault();


const fetchWeather = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.value?.latitude}&longitude=${selectedCity?.value?.longitude}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,wind_speed_180m,temperature_180m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,wind_speed_10m_max&timezone=GMT`
);


const data=await fetchWeather.json();
setWeatherDetails(data);
};
console.log(weatherDetails);
  return (
    <div className="flex max-w-7xl mx-auto space-x-1">
      {        /* Sidebar */ }
        <div className="flex flex-col space-y-3 h-screen bg-blue-950 p-3 w-[25%]">
          {/* form */}
          <Select 
          options={allCountries}
          value={selectedCountry}
          onChange={handleSelectedCountry}
          />
          <Select options={City.getCitiesOfCountry(selectedCountry?.value?.isoCode)
            .map((city) => ({
              value: { 
                latitude:city.latitude,
                longitude:city.longitude,
              },
              label:city.name,
            })
          )}
          value={selectedCity}
          onChange={handleSelectedCity}
          />

          <button onClick={getWeatherDetails} className="bg-green-400 w-full py-3 text-white text-sm font-hover:scale-105 
          transition-all duration-200 ease-in-out">
            Get Weather
          </button>
          
          
          <div className="flex flex-col space-y-2 text-white font-semibold">
            <p>
              {selectedCountry?.label} | {selectedCity?.label}
            </p>
            <p>
              Coordinates: {selectedCity?.value?.latitude} |{" "}
              {selectedCity?.value?.longitude}
              </p>
          </div>
          <div> { /* sunrise  / sunset */} </div>
          </div>
          {/* Body */}
          <div className="w-[75%] h-screen">

            <div className="flex items-center space-x-2" >
              <Card decoration="top" decorationColor="red" className="bg-gray-100 text-center">
                <Title> Temperature </Title>
                <Metric>{weatherDetails?.daily?.temperature_2m_max[0]} &#x2103;</Metric>
              </Card>

              <Card decoration="top" decorationColor="green" className="bg-gray-100 text-center">
                <Title> Wind Speed </Title>
                <Metric>{weatherDetails?.daily?.wind_speed_10m_max[0]} km/hr</Metric>
              </Card>

              <Card decoration="top" decorationColor="blue" className="bg-gray-100 text-center">
                <Title> UV Index </Title>
                <Metric>{weatherDetails?.daily?.uv_index_max[0]}</Metric>
              </Card>      
            </div>

            <div>
              {/* <AreaChartCard weatherDetails={weatherDetails}/> */}
              {/* <LineChartCard weatherDetails={weatherDetails}/> */}
            </div>
          </div>
          </div>
           
  );
}

export default App;
