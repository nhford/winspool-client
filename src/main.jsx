import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Signature, Likes} from './Footer.jsx'
import {PopUp} from './PopUp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Signature />
    <PopUp display={"Pop-Up"}/>
    <Likes multiplier={2} />
  </StrictMode>,
)
