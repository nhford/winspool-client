import { useState, useEffect } from 'react'

function HeadtoHead(){
    const [data,setData] = useState([]);
    const [sorted,setSorted] = useState({key:null,dir:"desc"});
    const [headers,setHeaders] = useState([]);
    const [labels,setLabels] = useState([]);

    const connection = 'api/fetch';

    useEffect(() => {
        // Fetch teams data from the API
        fetch(connection)
          .then(response => response.json())
          .then(data => data.h2h)
        //   .then(data => {
        //         data.forEach(row => {
        //             const cols = Object.keys(row);
        //             cols.forEach((col,i) => {
        //                 if(i > 0){
        //                     const record = row[col];
        //                     if(record.slice(-1) != '0') setTies(true)
        //                 }
        //             })
        //         });
        //         return data;
        //     })
        //   .then(data => Object.entries(data).map(([_, { owner, vs_Ajay, vs_Keshav, vs_Noah, vs_Rikhav }]) => ({
        //         owner,
        //         vs_Ajay,
        //         vs_Keshav,
        //         vs_Noah,
        //         vs_Rikhav
        //     })))
        //   .then(data => data.sort((a,b) => b.wins - a.wins))
          .then(data => {
                        const headers = Object.keys(data[0]); 
                        setHeaders(headers);
                        setLabels(headers.map((x,i) => {
                            if(i === 0) return x.replace(/\b\w/g, char => char.toUpperCase());
                            return 'vs ' + x.split('_')[1];
                        }));
                        setData(data);})
          .catch(error => console.error('Error fetching data:', error));
      }, []);


    function handleSort(key){
        let dir = "desc";
        if(sorted.key == key && sorted.dir == "desc"){
          dir = "asc";
        } 
        setSorted({key,dir});
        let i = dir == "asc" ? 1 : -1;
        setData([...data].sort((a,b) => {
            const records = [a,b].map(row => row[key].split('-').map(x => parseInt(x,10)));
            const rest = records.map(record => record.slice(1).reduce((acc,e) => acc + e, 0));
            const [pct1,pct2] = records.map((record,i) => rest[i] > 0 ? (record[0] / (record[0] + rest[i])) : 0)
            return pct1 > pct2 ? i : -i
        }));
      }


    return (
        <>
            <table className="HeadtoHeadTable">
                <thead>
                    <tr>
                        {labels.map((label,i) => <th key={i} onClick={() => handleSort(headers[i])}>{label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row,index) => (
                        <tr key={index}>
                            {
                                headers.map((col,i) => (<td key={i}>{row[col]}</td>))
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

// function imgPath(abbrev,year=2024){
//     return `/logos/${abbrev.toLowerCase()}-${year}.png`;
// }

export default HeadtoHead;