import { useState } from "react"
import PropTypes from "prop-types"; // Import PropTypes
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function VenmoIcon({ size = 30 }) {
    return (
        <>
        <a href="https://venmo.com/Noah-Ford-57" style={{color: 'black'}} target="_blank" rel="noopener noreferrer">
        <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 512 512"
                className="icon"
            >
                <path
                fill="currentColor"
                d="M444.17 32H70.28C49.85 32 32 46.7 32 66.89V441.6c0 20.31 17.85 38.4 38.28 38.4h373.78c20.54 0 35.94-18.2 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32M278 387H174.32l-41.57-248.56l90.75-8.62l22 176.87c20.53-33.45 45.88-86 45.88-121.87c0-19.62-3.36-33-8.61-44l82.63-16.72c9.56 15.78 13.86 32 13.86 52.57c-.01 65.5-55.92 150.59-101.26 210.33"
                />
            </svg>
        </a>
        </>
    );
  }
  

  export function Signature() {
    const iconSize = 30;
  
    return (
      <>
        <p className="signature" style={{marginTop: '30px', marginBottom: '0px'}}>Created by Noah Ford, UMass CICS &apos;26</p>
        <a href="https://github.com/NFordUMass" target="_blank" rel="noopener noreferrer">
          <GitHubIcon className="icon" style={{ color: "black", width: iconSize, height: iconSize }} />
        </a>
        <a href="https://www.linkedin.com/in/nhford/" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon className="icon" style={{ color: "black", width: iconSize, height: iconSize }} />
        </a>
        <VenmoIcon size={iconSize} />
      </>
    );
  }
  

export function Likes({multiplier}){
    const[count,setCount] = useState(0);
    
    const increment = (delta) => () => setCount(count + delta*parseInt(multiplier));

    return (
        <div>
            <p>Thank you for the {count} page likes!</p>
            <button onClick={increment(1)}>Like</button>
            <button onClick={increment(-1)}>Unlike</button>
        </div>
    )
}

VenmoIcon.propTypes = {
    size: PropTypes.number
}

Likes.propTypes = {
    multiplier: PropTypes.number
}