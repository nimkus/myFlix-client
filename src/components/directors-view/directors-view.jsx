import { useParams } from 'react-router';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const DirectorsView = ({ directors }) => {
  const { directorName } = useParams();
  const director = directors.find((d) => d.name === directorName);

  if (!director) return <p>Loading director information...</p>;

  return (
    <Card className="p-4 my-3 border-0" style={{ maxWidth: '700px', margin: 'auto' }}>
      <Card.Body>
        <h2 className="text-center mb-3">{director.name}</h2>

        <hr className="my-4" />

        <Row className="mb-4">
          <Col>
            <h5 className="text-muted mb-2" style={{ fontSize: '1rem', fontWeight: 'normal' }}>
              Biography
            </h5>
            <Card.Text style={{ lineHeight: '1.6', color: '#444' }}>{director.bio}</Card.Text>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Date of Birth
            </p>
            <p className="text-dark">{new Date(director.birthDate).toLocaleDateString()}</p>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
              Date of Death
            </p>
            <p className="text-dark">{director.deathDate ? new Date(director.deathDate).toLocaleDateString() : ' -'}</p>
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
