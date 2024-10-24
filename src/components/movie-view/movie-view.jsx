import React from 'react';
import { useParams } from 'react-router';
import { Card, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

export const MovieView = ({ movies, toggleFavoriteMovie, userFavorites }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) return <p>Loading movie information...</p>;

  // Determine if the movie is a favorite
  const isFavorite = userFavorites.includes(movie.id);

  const handleToggleFavorite = () => {
    toggleFavoriteMovie(movie.id);
  };

  return (
    <Card className="p-4 my-3 border-0" style={{ maxWidth: '700px', margin: 'auto' }}>
      <Card.Body>
        <h2 className="text-center mb-3">{movie.title}</h2>

        <Card.Img variant="top" src={movie.image} alt={movie.title} />

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
            {/* Iterate through genres and create separate links for each genre */}
            <div>
              {movie.genreName &&
                movie.genreName.map((genre, index) => (
                  <Link key={index} to={`/movies/genres/${encodeURIComponent(genre)}`}>
                    {genre}
                  </Link>
                ))}
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Director
            </p>
            <p className="text-dark">{movie.directorName}</p>
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
