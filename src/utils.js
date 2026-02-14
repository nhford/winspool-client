export function handleSort(key,sorted,setSorted,data,setData,natural="desc",setExpandedRows,secondary="team"){
    let dir = natural;
    if(sorted.key == key && sorted.dir == natural){
      dir = natural == "desc" ? "asc" : "desc";
    } 
    setSorted({key,dir});
    let i = dir == "asc" ? 1 : -1;
    setData([...data].sort((a,b) => a[secondary] < b[secondary] ? i : -i).sort((a,b) => a[key] < b[key] ? i : -i));

    if(setExpandedRows){
      setExpandedRows(prev =>
        Object.fromEntries(Object.keys(prev).map(k => [k, false]))
      );
    }
}

export const leagueYear = {
  'mlb' : 2025,
  'nba' : 2024,
  'nfl' : 2024
}

export function imgPath(sport,abbrev){
  const year = leagueYear[sport];
  return `/team_logos/${sport}/${abbrev.toLowerCase()}-${year}.png`;
}

export function defaultSport(){
  const current_date = new Date();
  /* getMonth() returns 0-indexed month (0-11) */
  const month = current_date.getMonth() + 1;

  /* getDate() returns day (1-31) */
  const day = current_date.getDate();
  if(month <= 1 && day <= 10){
    return 'nfl';
  }
  else if(month <= 5){
    return 'nba';
  }
  else if(month <= 9 && day <= 17){
    return 'mlb';
  }
  else {
    return 'nfl';
  }
}