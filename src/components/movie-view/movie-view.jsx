import React from 'react';
import { useParams } from 'react-router';
import { Card, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

/**
 * MovieView component displays detailed information about a selected movie.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Array<Object>} props.movies - An array of movie objects available in the system.
 * @param {Function} props.toggleFavoriteMovie - Function to toggle the movie's favorite status.
 * @param {Array<string>} props.userFavorites - A list of favorite movie IDs belonging to the user.
 * @returns {JSX.Element} A detailed view of a movie with an option to mark it as a favorite.
 */
export const MovieView = ({ movies, toggleFavoriteMovie, userFavorites }) => {
  // Get the movie ID from URL parameters
  const { movieId } = useParams();

  // Find the corresponding movie from the movies list
  const movie = movies.find((m) => m.id === movieId);

  // Display a loading message if movie data is not found
  if (!movie) return <p>Loading movie information...</p>;

  /**
   * @constant {boolean} isFavorite - Determines if the movie is in the user's favorite list.
   */
  const isFavorite = userFavorites.includes(movie.id);

  /**
   * Handles toggling the favorite status of the movie.
   * Calls `toggleFavoriteMovie` to update the favorite state.
   *
   * @function
   * @returns {void}
   */
  const handleToggleFavorite = () => {
    toggleFavoriteMovie(movie.id);
  };

  return (
    <Card className="p-4 my-3 border-0" style={{ maxWidth: '700px', margin: 'auto' }}>
      <Card.Body>
        <h2 className="text-center mb-3">{movie.title}</h2>

        <Card.Img variant="top" src={movie.imagePath} alt={movie.title} />

        <hr className="my-4" />

        <Row className="mb-3">
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Year
            </p>
            <p className="text-dark">{movie.year}</p>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Genre(s)
            </p>
            <div>
              {movie.genreName &&
                movie.genreName.split(',').map((genre, index, array) => (
                  <React.Fragment key={index}>
                    <Link to={`/movies/genres/${encodeURIComponent(genre.trim())}`}>{genre.trim()}</Link>
                    {index < array.length - 1 && ', '}
                  </React.Fragment>
                ))}
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Director
            </p>
            <Link to={`/movies/directors/${encodeURIComponent(movie.directorName)}`}>{movie.directorName}</Link>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Duration
            </p>
            <p className="text-dark">{movie.duration} minutes</p>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              IMDB Rating
            </p>
            <p className="text-dark">{movie.imdb_rating}</p>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Language
            </p>
            <p className="text-dark">{movie.language}</p>
          </Col>
        </Row>

        <hr className="my-4" />

        <h5 className="text-muted mb-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>
          Description
        </h5>
        <Card.Text style={{ lineHeight: '1.6', color: '#444' }}>{movie.description}</Card.Text>

        <div className="mt-4 d-flex justify-content-center">
          <Row className="align-items-center">
            <Col xs="auto">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</Tooltip>}
              >
                <Button
                  variant="link"
                  className="p-0"
                  onClick={handleToggleFavorite}
                  style={{ color: 'var(--bs-primary)', fontSize: '1.5rem' }}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? <BsHeartFill aria-hidden="true" /> : <BsHeart aria-hidden="true" />}
                </Button>
              </OverlayTrigger>
            </Col>
            <Col xs="auto">
              <Link to={`/`}>
                <Button variant="outline-primary" className="px-4" style={{ borderRadius: '20px' }}>
                  Back
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};
