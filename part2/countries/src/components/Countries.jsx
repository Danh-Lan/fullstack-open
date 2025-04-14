import Country from "./Country";

const Countries = ({ filteredCountries, setFilteredCountries }) => {
  if (!filteredCountries) { return null; }

  if (filteredCountries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    );
  }

  if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
    return (
      <div>
        {filteredCountries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => setFilteredCountries([country])}>Show</button>
            </div>
        ))}
      </div>
    );
  }

  if (filteredCountries.length == 1) {
    return (
      <Country country={filteredCountries[0]} />
    );
  }
};

export default Countries;