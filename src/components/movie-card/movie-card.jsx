import PropTypes from 'prop-types';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div
      onClick={() => {
        onMovieClick(movie);
      }}
    >
      {movie.title}
    </div>
  );
};

// define prop constraints
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    year: PropTypes.number,
    genre: PropTypes.array,
    director: PropTypes.object,
    imdb_rating: PropTypes.number,
    duration: PropTypes.number,
    language: PropTypes.string,
    description: PropTypes.string,
    imagePath: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};
