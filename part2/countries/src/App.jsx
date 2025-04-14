import { useState, useEffect } from "react"
import axios from "axios"
import Countries from "./components/Countries"

const App = () => {
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'

  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(null)

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/all`)
      .then(response => {
        setCountries(response.data)
      })
  }
  , []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setFilteredCountries(countries.filter(country => {
      return country.name.common.toLowerCase().includes(event.target.value.toLowerCase());
    }))
  }

  if (!countries) {
    return null;
  }

  return (
    <div>
      <div>find countries <input value={search} onChange={handleSearchChange}/></div>
      <Countries filteredCountries={filteredCountries} setFilteredCountries={setFilteredCountries} />
    </div>
  )
}

export default App
