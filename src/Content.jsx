import Standings from './components/Standings.jsx'
import LogoTable from './components/LogoTable.jsx';
import HeadtoHead from './components/HeadToHead.jsx'
import PropTypes from 'prop-types';

export default function Content({sport,year}){
    return (
      <>
        <h2>Current Standings</h2>
        <LogoTable sport={sport} year={parseInt(year)}/>
        <h2>Head to Head</h2>
        <HeadtoHead sport={sport} year={parseInt(year)}/>
        <h2>Full Draft</h2>
        <Standings sport={sport} year={parseInt(year)}/>
      </>
  )}

Content.propTypes = {
    sport : PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
}