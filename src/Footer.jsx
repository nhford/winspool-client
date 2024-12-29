import { useState } from "react"
import PropTypes from "prop-types"; // Import PropTypes

export function Signature() {
    return <p className="signature">Created with love and care by Noah Ford.</p>
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
Likes.propTypes = {
    multiplier: PropTypes.number
}