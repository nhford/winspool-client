import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Signature} from './Footer.jsx'
import Body from './Body.jsx'
import HowTo from './HowTo.jsx'
import Update from './Update.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Wins Pool Tracker</h1>
    <h3>Who wins from each and every win in the NFL and NBA</h3>
    <Update />
    <Body />
    <HowTo />
    <Signature />
  </StrictMode>,
)
