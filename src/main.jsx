import { useState, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Standings from './Standings.jsx'
import {Signature, Likes} from './Footer.jsx'
import {PopUp} from './PopUp.jsx'
import LogoTable from './LogoTable';
import HeadtoHead from './HeadToHead.jsx'
import ColorToggleButton from './Toggle.jsx'

const Body = () => {
  const [sport, setSport] = useState('nfl');
  return (
    <>
      <ColorToggleButton sport={sport} setSport={setSport}/>
      <h2>Current Standings</h2>
      <LogoTable sport={sport}/>
      <h2>Head to Head</h2>
      <HeadtoHead />
      <h2>Full Draft</h2>
      <Standings sport={sport}/>
    </>
)}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Wins Pool</h1>
    <p>{`Last updated: ${new Date().toISOString().slice(0, 10)}`}</p>
    <Body />
    <Signature />
    <PopUp display={"Pop-Up"}/>
    <Likes multiplier={2} />
  </StrictMode>,
)
