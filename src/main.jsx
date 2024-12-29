import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Standings from './Standings.jsx'
import {Signature, Likes} from './Footer.jsx'
import {PopUp} from './PopUp.jsx'
import LogoTable from './LogoTable';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Wins Pool</h1>
    <h2>Current Standings</h2>
    <LogoTable />
    <h2>Full Draft</h2>
    <Standings />
    <Signature />
    <PopUp display={"Pop-Up"}/>
    <Likes multiplier={2} />
  </StrictMode>,
)
