const data = [
    { abbrev: 'KAN', team: 'Kansas City Chiefs', pick: '1', owner: 'Keshav', wins: '15' },
    { abbrev: 'NWE', team: 'New England Patriots', pick: '2', owner: 'Noah', wins: '12' },
    { abbrev: 'SFO', team: 'San Francisco 49ers', pick: '3', owner: 'Ajay', wins: '10' },
    { abbrev: 'RAI', team: 'Las Vegas Raiders', pick: '4', owner: 'Jake', wins: '8' },
    { abbrev: 'CIN', team: 'Las Vegas Raiders', pick: '4', owner: 'Rikhav', wins: '8' }
];

function LogoTable(){

    if(data.length == 0) return;

    // Step 1: Sort the data by "pick"
    data.sort((a, b) => a.pick - b.pick);

    // Step 2: Group by "owner"
    const grouped = data.reduce((acc, team) => {
        if (!acc[team.owner]) {
            acc[team.owner] = { wins: 0, teams: [] };
        }
        acc[team.owner].wins += parseInt(team.wins);  // Sum the wins
        acc[team.owner].teams.push(team.abbrev);        // Collect team names
        return acc;
    }, {});

    // Step 3: Convert the grouped data into an array
    const result = Object.entries(grouped).map(([owner, { wins, teams }]) => ({
        owner,
        wins,
        teams: teams.join(' ')
    }));

    // Step 4: Sort by "wins" in descending order
    result.sort((a, b) => b.wins - a.wins);
        
    console.log("Result:");
    console.log(result);
    return (
        <>
        <table className="LogoTable">
            <thead>
                <tr>
                    <th>Owner</th>
                    <th>Wins</th>
                    <th>Teams</th>
                </tr>
            </thead>
            <tbody>
                {result.map((item,index) => (
                    <tr key={index}>
                        <td>{item.owner}</td>
                        <td>{item.wins}</td>
                        <td>{item.teams.split(' ').map((abbrev,idx) => <img key={idx} src={imgPath(abbrev)} alt={abbrev + " Logo"} width={50}></img>)}</td>
                        {/* <td>{item.record}</td> */}
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