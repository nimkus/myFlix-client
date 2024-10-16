import React, { useEffect, useState } from 'react';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { MovieView } from '../movie-view/movie-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { DirectorsCard } from '../directors-card/directors-card.jsx';
import { DirectorsView } from '../directors-view/directors-view.jsx';
import { GenreCard } from '../genre-card/genre-card.jsx';
import { GenreView } from '../genre-view/genre-view.jsx';
import { NavBar } from '../nav-bar/nav-bar';
import { Row, Col } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

export const MainView = () => {
  // Get the user from local storage, if existing, and store it in state
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser ? storedUser : null);

  // Get the token from local storage, if existing, and store it in state
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = useState(storedToken ? storedToken : null);

  // State to store data fetched from the API
  const [movies, setMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);

  /**
   * Reusable function to fetch data from an API endpoint
   * @param {string} url - API endpoint to fetch data from
   * @param {function} setter - State setter function to update the corresponding state
   */
  const FetchDataFromAPI = async (url, setter) => {
    // If no token, exit early
    if (!token) return;

    try {
      // Fetch data from the API with authorization header
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if the response is successful, throw an error if not
      if (!response.ok) {
        throw new Error(`Network response was not ok: (${response.status}) ${response.statusText}`);
      }

      // Parse the JSON data and call the setter function to update state
      const data = await response.json();
      setter(data);
    } catch (error) {
      // Log any errors encountered during the fetch
      console.error('Fetch error:', error);
    }
  };

  // Fetch movies when the component mounts or when the token changes
  useEffect(() => {
    FetchDataFromAPI('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies', (data) => {
      // Map through the movie data and format it before updating the state
      const moviesFromApi = data.map((movie) => ({
        id: movie._id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        genreName: movie.genre?.length > 0 ? movie.genre.map((g) => g.name).join(', ') : 'No genre available',
        director: movie.director,
        directorName:
          movie.director?.length > 0 ? movie.director.map((d) => d.name).join(', ') : 'No director available',
        imdb_rating: movie.imdb_rating,
        duration: movie.duration,
        language: movie.language,
        description: movie.description,
        image: movie.imagePath,
        featured: movie.featured,
      }));
      // Update the movies state with formatted data
      setMovies(moviesFromApi);
    });
  }, [token]);

  // Fetch directors when the component mounts or when the token changes
  useEffect(() => {
    FetchDataFromAPI('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies/directors/all', (data) => {
      // Map through the director data and format it before updating the state
      const directorsFromApi = data.map((director) => ({
        id: director._id,
        name: director.name,
        bio: director.bio,
        birthDate: director.date_of_birth,
        deathDate: director.date_of_death,
      }));
      // Update the directors state with formatted data
      setDirectors(directorsFromApi);
    });
  }, [token]);

  // Fetch directors when the component mounts or when the token changes
  useEffect(() => {
    FetchDataFromAPI('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies/genres/all', (data) => {
      // Map through the director data and format it before updating the state
      const genresFromApi = data.map((genre) => ({
        id: genre._id,
        name: genre.name,
        description: genre.description,
      }));
      // Update the directors state with formatted data
      setGenres(genresFromApi);
    });
  }, [token]);

  // Function to handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // Route render functions
  const renderSignup = () => (
    <Col md={5}>
      <SignupView />
    </Col>
  );

  const renderLogin = () => (
    <Col md={5}>
      <LoginView
        onLoggedIn={(user, token) => {
          setUser(user);
          setToken(token);
        }}
      />
    </Col>
  );

  const renderMovies = () => (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <ListOrMessage
        list={movies}
        renderItem={(movie) => (
          <Col className="mb-4" md={4} key={movie.id}>
            <MovieCard movie={movie} />
          </Col>
        )}
      />
    </>
  );

  const renderSingleMovie = () => (
    <Col md={8}>
      <MovieView movies={movies} />
    </Col>
  );

  const renderDirectors = () => (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <ListOrMessage
        list={directors}
        renderItem={(director) => (
          <Col className="mb-4" xs={12} key={director.id}>
            <DirectorsCard directors={director} />
          </Col>
        )}
      />
    </>
  );

  const renderSingleDirector = () => {
    if (directors.length === 0) {
      // Directors data is still loading or empty
      return <p>Loading director information...</p>;
    }

    // Proceed to render DirectorsView once directors data is loaded
    return (
      <Col md={8}>
        <DirectorsView directors={directors} />
      </Col>
    );
  };

  const renderGenres = () => (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <ListOrMessage
        list={genres}
        renderItem={(genre) => (
          <Col className="mb-4" xs={12} key={genre.id}>
            <GenreCard genres={genre} />
          </Col>
        )}
      />
    </>
  );

  const renderSingleGenre = () => {
    if (genres.length === 0) {
      // Genres data is still loading or empty
      return <p>Loading genre information...</p>;
    }

    // Proceed to render GenreView once genre data is loaded
    return (
      <Col md={8}>
        <GenreView genres={genres} />
      </Col>
    );
  };

  // Component to handle rendering a list or a fallback message
  const ListOrMessage = ({ list, renderItem, emptyMessage = 'List is loading or empty' }) => {
    return list.length > 0 ? list.map(renderItem) : <Col>{emptyMessage}</Col>;
  };

  // ProtectedRoute component to handle authentication
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  // Component to handle unmatched routes
  const NotFound = () => (
    <Col>
      <h2>Page Not Found</h2>
      <Link to="/">Return to Home</Link>
    </Col>
  );

  return (
    <BrowserRouter>
      <Row className="justify-content-md-center">
        <Routes>
          <Route path="/signup" element={user ? <Navigate to="/" /> : renderSignup()} />
          <Route path="/login" element={user ? <Navigate to="/" /> : renderLogin()} />
          <Route path="/movies/:movieId" element={<ProtectedRoute>{renderSingleMovie()}</ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute>{renderMovies()}</ProtectedRoute>} />
          <Route path="/movies/directors" element={<ProtectedRoute>{renderDirectors()}</ProtectedRoute>} />
          <Route
            path="/movies/directors/:directorName"
            element={<ProtectedRoute>{renderSingleDirector()}</ProtectedRoute>}
          />
          <Route path="/movies/genres" element={<ProtectedRoute>{renderGenres()}</ProtectedRoute>} />
          <Route path="/movies/genres/:genreName" element={<ProtectedRoute>{renderSingleGenre()}</ProtectedRoute>} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 Not Found */}
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
