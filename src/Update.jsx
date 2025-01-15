import { useState, useEffect } from 'react'

async function fetchTime(){
    const connection = 'api/fetch';
    const response = await fetch(connection);
    const data = await response.json();
    console.log(data['updated'][0].time)
    return data['updated'][0].time;
}

function useFetch(key, fetchFunction){
    const [updated,setUpdated] = useState(null);

    useEffect(() => {
        const checkTime = async () => {
            const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
            const cachedData = JSON.parse(localStorage.getItem(key));

            // If data exists and was fetched today, use it
            if (cachedData && cachedData.date === today) {
                setUpdated(cachedData.value);
            } else {
                // Fetch new data and update the cache
                const fetchedValue = await fetchFunction();
                setUpdated(fetchedValue);
                localStorage.setItem(key, JSON.stringify({ date: today, value: fetchedValue }));
            }
        };

        checkTime();
      },[key,fetchFunction]);

      return updated;
}

export default function Update(){
    const lastUpdated = useFetch("updated",fetchTime)

    if(!lastUpdated) return <p>Loading...</p>

    return (
        <p>{`Last updated: ${lastUpdated}`}</p>
        );
}