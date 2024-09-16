import React, { useEffect, useState } from 'react';
import { MovieView } from '../movie-view/movie-view';
import { MovieCard } from '../movie-card/movie-card';

export const MainView = () => {
  const [movies, setMovies] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies')
      .then((res) => res.json())
      .then((data) => {
        const moviesFromApi = data.docs.map((doc) => {
          return {
            /* id: doc._id,
            title: doc.title,
            year: doc.year,
            //genre: doc.genre,
            //director: doc.director,
            imdb_rating: doc.imdb_rating,
            duration: doc.duration,
            language: doc.language,
            description: doc.description,
            //image: doc.imagePath,
            featured: doc.featured, */
          };
        });

        setMovies(moviesFromApi);
      });
  }, []);

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  if (selectedMovie) {
    return <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};
