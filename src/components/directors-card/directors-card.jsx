import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

/**
 * Component for displaying a director's card with their name and birth/death dates.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.director - The director object.
 * @param {string} props.director.name - The name of the director.
 * @param {string} props.director.bio - The biography of the director.
 * @param {string} props.director.birthDate - The birth date of the director.
 * @param {string} [props.director.deathDate] - The death date of the director (if applicable).
 * @returns {JSX.Element} A card component displaying director details.
 */
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

/**
 * Defines the prop types for the DirectorsCard component.
 * @type {Object}
 */
DirectorsCard.propTypes = {
  director: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    birthDate: PropTypes.string,
    deathDate: PropTypes.string,
  }).isRequired,
};
