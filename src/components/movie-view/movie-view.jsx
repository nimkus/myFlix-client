import { useParams } from 'react-router';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) return <p>Loading movie information...</p>;

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
            <p className="text-dark">{movie.genreName}</p>
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

        <div className="text-center mt-4">
          <Link to={`/`}>
            <Button variant="outline-primary" className="px-4" style={{ borderRadius: '20px' }}>
              Back
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
