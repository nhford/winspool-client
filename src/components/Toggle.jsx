import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PropTypes from 'prop-types';


export default function ColorToggleButton({item, options, setItem}) {

  const handleChange = (event, newSport) => {
    if(newSport != null){
      setItem(newSport);
    }
  };

  return (
    <div className='buttons'>
      <ToggleButtonGroup
        value={item || null}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        {
        options.map(option => (
          <ToggleButton key={option} value={option}>{option.toUpperCase()}</ToggleButton>
        ))
      }
      </ToggleButtonGroup>
    </div>
  );
}

ColorToggleButton.propTypes = {
    item: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    setItem: PropTypes.func.isRequired,
};