export function handleSort(key,[sorted,setSorted,data,setData],natural="desc"){
    let dir = natural;
    if(sorted.key == key && sorted.dir == natural){
      dir = natural == "desc" ? "asc" : "desc";
    } 
    setSorted({key,dir});
    let i = dir == "asc" ? 1 : -1;
    setData([...data].sort((a,b) => a[key] < b[key] ? i : -i));
}

export const leagueYear = {
  'mlb' : 2025,
  'nba' : 2024,
  'nfl' : 2024
}

export function imgPath(sport,abbrev){
  const year = leagueYear[sport];
  return `/logos/${sport}/${abbrev.toLowerCase()}-${year}.png`;
}