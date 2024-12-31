export function handleSort(key,[sorted,setSorted,data,setData],natural="desc"){
    let dir = natural;
    if(sorted.key == key && sorted.dir == natural){
      dir = natural == "desc" ? "asc" : "desc";
    } 
    setSorted({key,dir});
    let i = dir == "asc" ? 1 : -1;
    setData([...data].sort((a,b) => a[key] < b[key] ? i : -i));
}