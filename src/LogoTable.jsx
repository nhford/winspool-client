import { useState, useEffect } from 'react'

function LogoTable(){
    const [data,setData] = useState([]);
    const [sorted,setSorted] = useState({key:null,dir:"asc"});
    const [winsDict,setWinsDict] = useState([]);
    const [maxWins, setMaxWins] = useState(0);

    useEffect(() => {
        // Fetch teams data from the API
        fetch('http://localhost:5001/api/standings')
          .then(response => response.json())
          .then(data => data.sort((a,b) => a.pick - b.pick))
          .then(data => {
                let max = 0;
                let temp = {};
                const newData = data.reduce((acc, team) => {
                    temp[team.abbrev] = team.wins;
                    if (!acc[team.owner]) {
                        acc[team.owner] = { wins: 0, teams: [] };
                    }
                    let w = parseInt(team.wins)
                    max = Math.max(w,max);
                    acc[team.owner].wins += w;  // Sum the wins
                    acc[team.owner].teams.push(team.abbrev);        // Collect team names
                    return acc;
                }, {});
                setMaxWins(max);
                setWinsDict(temp);
                return newData;
            })
          .then(data => Object.entries(data).map(([owner, { wins, teams }]) => ({
                owner,
                wins,
                teams: teams.join(' ')
            })))
          .then(data => data.sort((a,b) => b.wins - a.wins))
          .then(data => setData(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);


    function handleSort(key){
        let dir = "desc";
        if(sorted.key == key && sorted.dir == "desc"){
          dir = "asc";
        } 
        setSorted({key,dir});
        let i = dir == "asc" ? 1 : -1;
        setData([...data].sort((a,b) => a[key] < b[key] ? i : -i));
      }

    return (
        <>
        <table className="LogoTable">
            <thead>
                <tr>
                    <th onClick={() => handleSort("owner")}>Owner</th>
                    <th onClick={() => handleSort("wins")}>Wins</th>
                    <th>Teams</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item,index) => (
                    <tr key={index}>
                        <td>{item.owner}</td>
                        <td>{item.wins}</td>
                        <td>{item.teams.split(' ').map((abbrev,idx) => 
                            <img key={idx} src={imgPath(abbrev)} alt={abbrev + " Logo"} width={50*winsDict[abbrev]/maxWins}></img>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    )
}

function imgPath(abbrev,year=2024){
    return `/logos/${abbrev.toLowerCase()}-${year}.png`;
}

export default LogoTable;