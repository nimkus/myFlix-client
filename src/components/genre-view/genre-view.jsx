import { useParams } from 'react-router';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const GenreView = ({ genres }) => {
  const { genreName } = useParams();
  const genre = genres.find((g) => g.name === genreName);

  if (!genre) return <p>Loading genre information...</p>;

  return (
    <Card className="p-4 my-3 border-0" style={{ maxWidth: '700px', margin: 'auto' }}>
      <Card.Body>
        <h2 className="text-center mb-3">{genre.name}</h2>

        <hr className="my-4" />

        <Row className="mb-4">
          <Col>
            <h5 className="text-muted mb-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>
              Description
            </h5>
            <Card.Text style={{ lineHeight: '1.6', color: '#444' }}>{genre.description}</Card.Text>
          </Col>
        </Row>
        <hr className="my-4" />

        <div className="text-center">
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
