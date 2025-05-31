import { useState } from 'react';
import Standings from './components/Standings.jsx'
import LogoTable from './components/LogoTable.jsx';
import HeadtoHead from './components/HeadToHead.jsx'
import ColorToggleButton from './components/Toggle.jsx'
import Update from './components/Update.jsx';

export default function Body(){
    const [sport, setSport] = useState('mlb');
    return (
      <>
        <ColorToggleButton sport={sport} setSport={setSport}/>
        <Update sport={sport}/>
        <h2>Current Standings</h2>
        <LogoTable sport={sport}/>
        <h2>Head to Head</h2>
        <HeadtoHead sport={sport}/>
        <h2>Full Draft</h2>
        <Standings sport={sport}/>
      </>
  )}