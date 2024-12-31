import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PropTypes from 'prop-types';


export default function ColorToggleButton({sport, setSport}) {

  const handleChange = (event, newSport) => {
    setSport(newSport);
  };

  return (
    <ToggleButtonGroup
    //   color="primary"
      value={sport}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="nfl">NFL</ToggleButton>
      <ToggleButton value="nba">NBA</ToggleButton>
    </ToggleButtonGroup>
  );
}

ColorToggleButton.propTypes = {
    sport: PropTypes.string.isRequired,
    setSport: PropTypes.func.isRequired,
};