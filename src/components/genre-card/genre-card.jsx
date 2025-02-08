import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

/**
 * Component for displaying a genre card.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.genres - The genre object.
 * @param {string} props.genres.name - The name of the genre.
 * @param {string} [props.genres.description] - The description of the genre.
 * @returns {JSX.Element} A card component displaying genre details.
 */
export const GenreCard = ({ genres }) => {
  return (
    <Link
      to={`/movies/genres/${encodeURIComponent(genres.name)}`}
      className="card-link" // class for hover effect
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card className="h-100 my-2 bg-light rounded-2">
        <Card.Body className="text-center d-flex flex-column justify-content-center">
          <h5 style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333', margin: '0' }}>{genres.name}</h5>
        </Card.Body>
      </Card>
    </Link>
  );
};

/**
 * Defines the prop types for the GenreCard component.
 * @type {Object}
 */
GenreCard.propTypes = {
  genres: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};
