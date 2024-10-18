import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export const DirectorsCard = ({ director }) => {
  return (
    <Link
      to={`/movies/directors/${encodeURIComponent(director.name)}`}
      className="card-link" // class hover effect
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Card className="h-100 my-2 bg-light rounded-2">
        <Card.Body className="p-3 text-center d-flex flex-column justify-content-center">
          <h5 style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>{director.name}</h5>

          <Card.Text className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
            <strong>Born:</strong> {director.birthDate}
          </Card.Text>

          {director.deathDate && (
            <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
              <strong>Died:</strong> {director.deathDate}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Link>
  );
};

// define prop constraints
DirectorsCard.propTypes = {
  directors: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    birthDate: PropTypes.string,
    deathDate: PropTypes.string,
  }).isRequired,
};
