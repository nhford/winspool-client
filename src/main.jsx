import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Signature, Likes} from './Footer.jsx'
import Body from './Body.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <h1>Wins Pool</h1>
    <p>{`Last updated: ${new Date().toISOString().slice(0, 10)}`}</p>
    <Body />
    <Signature />
    <Likes multiplier={1} />
  </StrictMode>,
)
