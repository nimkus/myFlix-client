export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
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
        <span>{movie.genre}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director}</span>
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
        <span>IMDB-Rating: </span>
        <span>{movie.imdb_rating}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <img src={movie.imagePath} alt="" />
      </div>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};
