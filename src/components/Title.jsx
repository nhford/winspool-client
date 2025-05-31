import PropTypes from "prop-types"; // Import PropTypes

function Trophy() {
  return (
    <img
      src="/basketball.png"
      alt="trophy"
      style={{ height: "calc(2 * 2rem)", width: "auto" }} // Dynamically set height
    />
  );
}

export default function Title({title, subTitle}) {
  return (
    <div>
      <div className="title_logos">
        <Trophy />
        <h1>
          {title}
        </h1>
        <Trophy />
      </div>
      <p>{subTitle}</p>
    </div>

  );
}

Title.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string
}