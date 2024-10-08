import React, { useEffect, useState } from 'react';
import { MovieView } from '../movie-view/movie-view';
import { MovieCard } from '../movie-card/movie-card';
import { LoginView } from '../login-view/login-view';
import { NavBar } from '../nav-bar/nav-bar';
import { SignupView } from '../signup-view/signup-view';
import { Button, Row, Col } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Network response was not ok: (${res.status}) ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.title,
            year: movie.year,
            genre: movie.genre,
            genreName:
              movie.genre && movie.genre.length > 0
                ? movie.genre.map((genre) => genre.name).join(', ')
                : 'No genre available',
            director: movie.director,
            directorName:
              movie.director && movie.director.length > 0
                ? movie.director.map((director) => director.name).join(', ')
                : 'No director available',
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
  }, [token]);

  return (
    <BrowserRouter>
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                    />
                    <Link to={`/signup`}>Sign up</Link>
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>List is empty!</Col>
                ) : (
                  <Col md={8}>
                    <MovieView movies={movies} />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>List is empty!</Col>
                ) : (
                  <>
                    <NavBar />

                    {movies.map((movie) => (
                      <Col className="mb-4" md={4} key={movie.id}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))}

                    <Button
                      onClick={() => {
                        setUser(null);
                        setToken(null);
                        localStorage.clear();
                      }}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
