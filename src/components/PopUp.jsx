import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const PopUp = ({display}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const label = isPopupOpen ? "Collapse" : "Expand";

  return (
    <div>
      <button onClick={togglePopup}>{label}</button>
      
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{display}</p>
          </div>
        </div>
      )}
    </div>
  );
};

PopUp.propTypes = {
    display: PropTypes.string
}

export {PopUp};
