import { useParams } from 'react-router';
import Button from 'react-bootstrap/button';
import { Link } from 'react-router-dom';

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m.id === movieId);
  return (
    <div>
      <div>
        <img src={movie.image} alt="" width="100%" />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Year: </span>
        <span>{movie.year}</span>
      </div>
      <div>
        <span>Genre(s): </span>
        <span>{movie.genreName}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.directorName}</span>
      </div>
      <div>
        <span>Duration: </span>
        <span>{movie.duration}</span>
      </div>
      <div>
        <span>IMDB-Rating: </span>
        <span>{movie.imdb_rating}</span>
      </div>
      <div>
        <span>Language: </span>
        <span>{movie.language}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      <Link to={`/`}>
        <Button className="mt-3">Back</Button>
      </Link>
    </div>
  );
};
