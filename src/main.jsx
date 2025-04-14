import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Signature} from './Footer.jsx'
import Body from './Body.jsx'
import HowTo from './HowTo.jsx'
import Title from './Title.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Title title={"Wins Pool"} subTitle={"Who wins from each and every win in the NFL, NBA, and MLB"}/>
    <Body />
    <HowTo />
    <Signature />
  </StrictMode>,
)
