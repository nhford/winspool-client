import React, { useState, useEffect } from 'react'
import './App.css'
import { handleSort } from './utils';
import PropTypes from 'prop-types';
// import jsonData from "../test.json"

function Standings({sport}) {
  const [data,setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const connection = 'api/fetch'

  useEffect(() => {
    // Fetch teams data from the API
    fetch(connection)
      .then(response => response.json())
      .then(data => setData(data[`${sport}_standings`]))
      .catch(error => console.error('Error fetching data:', error));
  }, [sport]);

  const [sorted,setSorted] = useState({key:"pct",dir:"asc"});

  const sortingUtil = [sorted,setSorted,data,setData];

  const toggleExpand = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId); // Toggle expanded row
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th colSpan={2} onClick={() => handleSort("team",sortingUtil)}>Team</th>
            <th onClick={() => handleSort("pick_int",sortingUtil)}>Pick</th>
            <th onClick={() => handleSort("owner",sortingUtil)}>Owner</th>
            <th onClick={() => handleSort("pct",sortingUtil,"asc")}>Record</th>
            <th>+/-</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row,index) => (
            <React.Fragment key={index}>
              <tr style={{ cursor: "pointer" }} onClick={() => toggleExpand(index)}>
                <td><img src={imgPath(sport,row.abbrev)} alt={row.abbrev + " Logo"} width={50}></img></td>
                <td>{row.team}</td>
                <td>{parseInt(row.pick)}</td>
                <td>{row.owner}</td>
                <td>{row.record}</td>
                <td>
                  <button onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the row click
                    toggleExpand(index);
                  }}>
                    {expandedRow === index ? "-" : "+"}
                  </button>
                </td>
            </tr>
            {expandedRow === index && (
              <tr>
                <td colSpan="6" style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
                  <div>
                    <strong>Details for {row.team}</strong>
                    <p>Over/Under: </p>
                    <p>Expected Slot Wins: </p>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
        </tbody>
      </table>
    </>
  )
}

Standings.propTypes = {
  sport : PropTypes.string.isRequired,
}

function imgPath(sport,abbrev,year=2024){
    return `/logos/${sport}/${abbrev.toLowerCase()}-${year}.png`;
}

export default Standings
