const Country = ({ country }) => {
  if (!country) { return null; }

  return (
    <div>
      <div key={country.name.common}>
        <h1>{country.name.common}</h1>
        Capital
        <ul>
          {country.capital.map(capital => (
            <li key={capital}>{capital}</li>
          ))}
        </ul>
        <div>Area {country.area}</div>
        <h2>Languages</h2>
        <ul>
          {Object.keys(country.languages).map((key) => (
            <li key={key}>{country.languages[key]}</li>
          ))}
        </ul>
        <img src={country.flags.svg} alt={country.flags.alt} width={200} />
      </div>
    </div>
  )
};

export default Country;