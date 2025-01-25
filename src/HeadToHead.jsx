import React, { useState, useEffect } from 'react'
import { handleSort } from './utils';
import PropTypes from 'prop-types';

function HeadtoHead({sport}){
    const [data,setData] = useState([]);
    const [sorted,setSorted] = useState({key:"vs_Noah",dir:"desc"}); // TODO: change to be best team
    const [headers,setHeaders] = useState([]);
    const [labels,setLabels] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [loading,setLoading] = useState(true);

    const [teamData, setTeamData] = useState([]);
    const [sort_key, setSort_Key] = useState({key: "vs_Noah",dir:"desc"}) // TODO: change to be best team

    const connection = 'api/fetch';

    useEffect(() => {
        // Fetch teams data from the API
        setLoading(true);
        fetch(connection)
          .then(response => response.json())
          .then(data => data[`${sport}_h2h`])
          .then(data => {
                        // split off team data
                        const teams = data
                            .filter(item => item.role == 'team');
                        setTeamData(teams);
                        const ret = data
                            .filter(item => item.role === 'owner')
                            .map(item => {const {...rest} = item; delete rest.abbrev; delete rest.role; return rest;})
                        return ret;
        })
          .then(data => {
                        const headers = Object.keys(data[0]);
                        setHeaders(headers);
                        setLabels(headers.map((x,i) => {
                            if(i === 0) return x.replace(/\b\w/g, char => char.toUpperCase());
                            return 'vs ' + x.split('_')[1];
                        }));
                        setData(data);})
          .then(() => setLoading(false))
          .catch(error => console.error('Error fetching data:', error));
      }, [sport]);

    const sortingUtil = [sorted,setSorted,data,setData];
    const sortingTeams = [sort_key,setSort_Key,teamData,setTeamData];

    function recordSort(key,[sorted,setSorted,stateData,setState]){
        let dir = "desc";
        if(sorted.key == key && sorted.dir == "desc"){
          dir = "asc";
        } 
        setSorted({key,dir});
        let i = dir == "asc" ? 1 : -1;
        setState([...stateData].sort((a,b) => {
            const records = [a,b].map(row => row[key].split('-').map(x => parseInt(x,10)));
            const rest = records.map(record => record.slice(1).reduce((acc,e) => acc + e, 0));
            const games = records.map((r,i) => r[0] + rest[i]);
            const [pct1,pct2] = records.map((record,i) => (record[0] + rest[i]) > 0 ? (record[0] / (record[0] + rest[i])) : 0);
            console.log(a['abbrev'] + pct1 + " and " + b['abbrev'] + pct2);
            // three cases: not tied, tied >= .500, or tied < .500 
            return pct1 == pct2 ? 
                        pct1 >= .5 ? 
                            games[0] > games[1] ? i : -i : games[1] < games[0] ? -i : i
                        :
                        pct1 > pct2 ? i : -i
        }));
      }

    const toggleExpand = (rowIndex) => {
        setExpandedRow(expandedRow === rowIndex ? null : rowIndex); // Toggle expanded row
    };

    return (
        <>
            {loading ? <p>Loading..</p> : 
                <table className="HeadtoHeadTable">
                    <thead>
                        <tr>
                            {labels.map((label,i) => <th key={i} onClick={() => i == 0 ? handleSort(headers[i],sortingUtil) : recordSort(headers[i],sortingUtil)}>{label}</th>)}
                            <th style={{cursor:'default'}}>+/-</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <React.Fragment key={row.owner}>
                                <tr key={row.owner} style={{ cursor: "pointer" }} onClick={() => toggleExpand(row.owner)}>
                                    {
                                        headers.map((col,i) => (<td key={i}>{row[col]}</td>))
                                    }
                                    <td>
                                    <button className='expand' onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the row click
                                            toggleExpand(row.owner);
                                        }}>
                                        {expandedRow === row.owner ? "-" : "+"}
                                    </button>
                                    </td>
                                </tr>
                                {expandedRow === row.owner && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "0", backgroundColor: "black" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse", borderColor:'black' }}>
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => handleSort('abbrev', sortingTeams)}>Team</th>
                                                        {labels.map((label, i) => i > 0 && (
                                                            <th key={i} onClick={() => recordSort(headers[i], sortingTeams)}>
                                                                {label}
                                                            </th>
                                                        ))}
                                                        <th style={{cursor:'default'}}>{"+/-"}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {teamData.filter(team => team.owner === expandedRow).map((team, i) => (
                                                        <tr key={i}>
                                                            <td>
                                                                <img
                                                                    key={i}
                                                                    src={imgPath(sport, team.abbrev)}
                                                                    alt={`${team.abbrev} Logo`}
                                                                    className='standingsLogo'
                                                                />
                                                            </td>
                                                            {headers.map((col, i) => i > 0 && (<td key={i}>{team[col]}</td>))}
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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

HeadtoHead.propTypes = {
    sport : PropTypes.string.isRequired,
  }

function imgPath(sport,abbrev,year=2024){
    return `/logos/${sport}/${abbrev.toLowerCase()}-${year}.png`;
}

export default HeadtoHead;