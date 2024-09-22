import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <Card className="h-100 bg-light rounded-0">
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>
          Year: {movie.year} <br />
          Genre: {movie.genreName} <br />
          IMDB-Rating: {movie.imdb_rating}
        </Card.Text>
        <Button className="p-0" onClick={() => onMovieClick(movie)} variant="link">
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

// define prop constraints
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    year: PropTypes.number,
    genre: PropTypes.array,
    director: PropTypes.array,
    imdb_rating: PropTypes.number,
    duration: PropTypes.number,
    language: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};
