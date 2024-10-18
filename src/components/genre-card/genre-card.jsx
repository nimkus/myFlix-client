import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

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

// define prop constraints
GenreCard.propTypes = {
  genres: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};
