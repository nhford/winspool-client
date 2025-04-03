import React, { useState, useEffect } from 'react'
import './App.css'
import { handleSort, imgPath } from './utils';
import PropTypes from 'prop-types';

function Standings({sport}) {
  const [data,setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sorted,setSorted] = useState({key:"pct",dir:"asc"});
  const [loading,setLoading] = useState(true);

  const connection = 'api/fetch'
  useEffect(() => {
    // Fetch teams data from the API
    setLoading(true);
    fetch(connection)
      .then(response => response.json())
      .then(data => {
        data = data[`${sport}_standings`];
        data.sort((a,b) => a['pick_int'] < b['pick_int'] ? -1 : 1);
        setData(data);
      })
      .then(() => setLoading(false))
      .catch(error => console.error('Error fetching data:', error));
  }, [sport]);


  const sortingUtil = [sorted,setSorted,data,setData];

  const toggleExpand = (rowIndex) => {
    setExpandedRow(expandedRow === rowIndex ? null : rowIndex); // Toggle expanded row
  };

  return (
    <>
      {loading ? <p>Loading..</p> : 
        <table>
          <thead>
            <tr>
              <th colSpan={2} onClick={() => handleSort("team",sortingUtil)}>Team</th>
              <th onClick={() => handleSort("pick_int",sortingUtil)}>Pick</th>
              <th onClick={() => handleSort("owner",sortingUtil)}>Owner</th>
              <th onClick={() => handleSort("pct",sortingUtil,"asc")}>Record</th>
              <th style={{cursor:'default'}}>+/-</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row,index) => (
              <React.Fragment key={row.abbrev}>
                <tr style={{ cursor: "pointer" }} onClick={() => toggleExpand(index)}>
                  <td><img className='standingsLogo' src={imgPath(sport,row.abbrev)} alt={row.abbrev + " Logo"}></img></td>
                  <td className='teamName'>{row.team}</td>
                  <td>{parseInt(row.pick)}</td>
                  <td className='ownerName'>{row.owner}</td>
                  <td>{row.record}</td>
                  <td>
                    <button className='expand' onClick={(e) => {
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
                      <p>Current Wins Pace: {row.wins_pace}</p>
                      <p>Preseason Over/Under: {row.ou}</p>
                      <p>Expected Wins by Draft Slot: {row.wins_exp}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          </tbody>
        </table>
      }
    </>
  )
}

Standings.propTypes = {
  sport : PropTypes.string.isRequired,
}

export default Standings
