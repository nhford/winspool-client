import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Signature} from './Footer.jsx'
import Body from './Body.jsx'
import HowTo from './HowTo.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Wins Pool Tracker</h1>
    <h3>Who wins from each and every win in the NFL and NBA</h3>
    <p>{`Last updated: ${new Date().toLocaleDateString().slice(0, 10)} 2:00 AM`}</p>
    <Body />
    <HowTo />
    <Signature />
  </StrictMode>,
)
