import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Signature} from './components/Footer.jsx'
import Body from './Body.jsx'
import HowTo from './components/HowTo.jsx'
import Title from './components/Title.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Title title={"Wins Pool"} subTitle={"Who wins from each and every win in the NFL, NBA, and MLB"}/>
    <Body />
    <HowTo />
    <Signature />
  </StrictMode>,
)
