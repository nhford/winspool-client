import { useState, useEffect } from 'react'
import './App.css'
import { handleSort } from './utils';
// import jsonData from "../test.json"

function Standings() {
  const [data,setData] = useState([]);

  const connection = 'api/fetch'

  useEffect(() => {
    // Fetch teams data from the API
    fetch(connection)
      .then(response => response.json())
      .then(data => setData(data.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const [sorted,setSorted] = useState({key:null,dir:"asc"});
  const [count, setCount] = useState(0);

  const sortingUtil = [sorted,setSorted,data,setData];

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={2} onClick={() => handleSort("team",sortingUtil)}>Team</th>
            <th onClick={() => handleSort("pick_int",sortingUtil)}>Pick</th>
            <th onClick={() => handleSort("owner",sortingUtil)}>Owner</th>
            <th onClick={() => handleSort("pct",sortingUtil,"asc")}>Record</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item,index) => (
          <tr key={index}>
              <td><img src={imgPath(item.abbrev)} alt={item.abbrev + " Logo"} width={50}></img></td>
              <td>{item.team}</td>
              <td>{parseInt(item.pick)}</td>
              <td>{item.owner}</td>
              <td>{item.record}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

function imgPath(abbrev,year=2024){
    return `/logos/${abbrev.toLowerCase()}-${year}.png`;
}

export default Standings
