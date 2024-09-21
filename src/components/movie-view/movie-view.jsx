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
        {movie.genre && movie.genre.length > 0
          ? movie.genre.map((genre) => genre.name).join(', ')
          : 'No genre available'}
      </div>
      <div>
        <span>Director: </span>
        {movie.director && movie.director.length > 0
          ? movie.director.map((director) => director.name).join(', ')
          : 'No director available'}
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
      <div>
        <img src={movie.image} alt="" />
        <span>{movie.image}</span>
        <span>{movie.imagePath}</span>
      </div>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};
