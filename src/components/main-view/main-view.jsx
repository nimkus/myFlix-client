import React, { useEffect, useState } from 'react';
import { MovieView } from '../movie-view/movie-view';
import { MovieCard } from '../movie-card/movie-card';
import { LoginView } from '../login-view/login-view';

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.title,
            year: movie.year,
            genre: movie.genre,
            director: movie.director,
            imdb_rating: movie.imdb_rating,
            duration: movie.duration,
            language: movie.language,
            description: movie.description,
            image: movie.imagePath,
            featured: movie.featured,
          };
        });

        setMovies(moviesFromApi);
      });
  }, []);

  if (!user) {
    return <LoginView onLoggedIn={(user) => setUser(user)} />;
  }

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
