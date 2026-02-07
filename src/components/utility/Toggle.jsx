import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PropTypes from "prop-types";

export default function Toggle({ item, options, setItem }) {
  const handleChange = (_, newSport) => {
    if (newSport != null) {
      setItem(newSport);
    }
  };

  return (
    <div className="buttons">
      <ToggleButtonGroup
        value={item || null}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        {options.map((option) => (
          <ToggleButton key={option} value={option}>
            {option.toUpperCase()}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}

Toggle.propTypes = {
  item: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  setItem: PropTypes.func.isRequired,
};
