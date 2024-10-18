import React, { useEffect, useState } from 'react';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { MovieView } from '../movie-view/movie-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { DirectorsCard } from '../directors-card/directors-card.jsx';
import { DirectorsView } from '../directors-view/directors-view.jsx';
import { GenreCard } from '../genre-card/genre-card.jsx';
import { GenreView } from '../genre-view/genre-view.jsx';
import { ProfileView } from '../profile-view/profile-view.jsx';
import { NavBar } from '../nav-bar/nav-bar';
import { Row, Col } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

export const MainView = () => {
  const [auth, setAuth] = useState(() => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }));

  const { user, token } = auth;

  const handleLogout = () => {
    // Clear user-specific data.
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  };

  // State to store data fetched from the API
  const [movies, setMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  /**
   * Generalized function to fetch data from an API endpoint with authentication
   * @param {string} url - The API endpoint to fetch data from
   * @returns {Promise<object|null>} - The JSON data from the response or null if an error occurred
   */
  const fetchData = async (url) => {
    if (!auth.token) {
      console.warn('No token available. Cannot fetch data.');
      return null;
    }

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: (${response.status}) ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  };

  /**
   * Wrapper function for fetching data and updating component state
   * @param {string} url - The API endpoint
   * @param {function} setter - State setter function to update the corresponding state
   */
  const fetchAndSetState = async (url, setter) => {
    const data = await fetchData(url);
    if (data) {
      setter(data);
    }
  };

  // Function to toggle favorite Movie
  const toggleFavoriteMovie = (movieId) => {
    setUserInfo((prevUserInfo) => {
      const updatedFavMovies = prevUserInfo.favMovies.includes(movieId)
        ? prevUserInfo.favMovies.filter((id) => id !== movieId) // Remove
        : [...prevUserInfo.favMovies, movieId]; // Add

      return {
        ...prevUserInfo,
        favMovies: updatedFavMovies,
      };
    });
  };

  // Function to handle rendering a list or a fallback message
  const ListOrMessage = ({ list, renderItem, emptyMessage = 'List is loading or empty' }) => {
    return list.length > 0 ? (
      list.map((item) => {
        // Use `item.id` or `item._id` if available, otherwise log a warning about missing unique identifiers
        if (!item.id && !item._id) {
          console.warn("Item missing a unique 'id' or '_id'. Consider fixing this in the data source.");
        }

        // Only fallback to `index` if `id` or `_id` is not available, but log a warning to make the issue known
        return <React.Fragment key={item.id || item._id}>{renderItem(item)}</React.Fragment>;
      })
    ) : (
      <Col>{emptyMessage}</Col>
    );
  };

  /**
   * Route rendering
   */

  // Fetch movies, directors, genres, and user info when component mounts or auth changes
  useEffect(() => {
    if (auth.user && auth.token) {
      // fetch movies
      fetchAndSetState('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies', (data) => {
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

        setMovies(moviesFromApi);
      });

      //fetch directors
      fetchAndSetState('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies/directors/all', (data) => {
        const directorsFromApi = data.map((director) => ({
          id: director._id,
          name: director.name,
          bio: director.bio,
          birthDate: director.date_of_birth ? new Date(director.date_of_birth).toLocaleDateString() : null,
          deathDate: director.date_of_death ? new Date(director.date_of_death).toLocaleDateString() : null,
        }));

        setDirectors(directorsFromApi);
      });

      // Fetch genres
      fetchAndSetState('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies/genres/all', (data) => {
        const genresFromApi = data.map((genre) => ({
          id: genre._id,
          name: genre.name,
          description: genre.description,
        }));

        setGenres(genresFromApi);
      });

      // Fetch info of current user
      fetchAndSetState(`https://nimkus-movies-flix-6973780b155e.herokuapp.com/users/${auth.user.username}`, (data) => {
        const userInfoFromApi = {
          id: data._id,
          username: data.username,
          password: data.password,
          email: data.email,
          birthday: data.birthday ? new Date(data.birthday).toLocaleDateString() : null,
          favMovies: data.favMovies,
        };

        setUserInfo(userInfoFromApi);
      });
    }
  }, [auth.user, auth.token]);

  // Signup
  const renderSignup = () => (
    <Col md={5}>
      <SignupView />
    </Col>
  );

  // Login
  const renderLogin = () => (
    <Col md={5}>
      <LoginView
        onLoggedIn={(newUser, newToken) => {
          setAuth({ user: newUser, token: newToken });
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('token', newToken);
        }}
      />
    </Col>
  );

  // Render ALL movies, directors, genres
  const renderMovies = () => (
    <>
      <NavBar user={auth.user} onLogout={handleLogout} />
      <ListOrMessage
        list={movies}
        renderItem={(movie) => {
          const isFavorite = userInfo.favMovies.includes(movie.id);
          return (
            <Col className="mb-4" md={4}>
              <MovieCard movie={movie} isFavorite={isFavorite} onToggleFavorite={toggleFavoriteMovie} />
            </Col>
          );
        }}
      />
    </>
  );

  const renderDirectors = () => (
    <>
      <NavBar user={auth.user} onLogout={handleLogout} />
      <ListOrMessage
        list={directors}
        renderItem={(director) => (
          <Col className="mb-4" xs={12}>
            <DirectorsCard director={director} />
          </Col>
        )}
      />
    </>
  );

  const renderGenres = () => (
    <>
      <NavBar user={auth.user} onLogout={handleLogout} />
      <ListOrMessage
        list={genres}
        renderItem={(genre) => (
          <Col className="mb-4" xs={12}>
            <GenreCard genres={genre} />
          </Col>
        )}
      />
    </>
  );

  // Render SINGLE movie, director, genre, user
  const renderSingleMovie = () => (
    <Col md={8}>
      <MovieView movies={movies} toggleFavoriteMovie={toggleFavoriteMovie} userFavorites={userInfo.favMovies} />
    </Col>
  );

  const renderSingleDirector = () => {
    if (directors.length === 0) {
      return <p>Loading director information...</p>;
    }
    return (
      <Col md={8}>
        <DirectorsView directors={directors} />
      </Col>
    );
  };

  const renderSingleGenre = () => {
    if (genres.length === 0) {
      return <p>Loading genre information...</p>;
    }
    return (
      <Col md={8}>
        <GenreView genres={genres} />
      </Col>
    );
  };

  const renderSingleUserInfo = () => {
    if (userInfo.length === 0) {
      return <p>Loading user information...</p>;
    }
    return (
      <Col md={8}>
        <ProfileView userInfo={userInfo} movies={movies} toggleFavoriteMovie={toggleFavoriteMovie} />
      </Col>
    );
  };

  // ProtectedRoute component to handle authentication
  const ProtectedRoute = React.memo(({ children }) => {
    return auth.user ? children : <Navigate to="/login" replace />;
  });

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
          {/* Login and Signup Routes */}
          <Route path="/signup" element={auth.user ? <Navigate to="/" /> : renderSignup()} />
          <Route path="/login" element={auth.user ? <Navigate to="/" /> : renderLogin()} />

          {/* Movies Routes */}
          <Route path="/" element={<ProtectedRoute>{renderMovies()}</ProtectedRoute>} />
          <Route path="/movies/:movieId" element={<ProtectedRoute>{renderSingleMovie()}</ProtectedRoute>} />
          <Route path="/movies/directors" element={<ProtectedRoute>{renderDirectors()}</ProtectedRoute>} />
          <Route
            path="/movies/directors/:directorName"
            element={<ProtectedRoute>{renderSingleDirector()}</ProtectedRoute>}
          />
          <Route path="/movies/genres" element={<ProtectedRoute>{renderGenres()}</ProtectedRoute>} />
          <Route path="/movies/genres/:genreName" element={<ProtectedRoute>{renderSingleGenre()}</ProtectedRoute>} />

          {/* User Profile Routes */}
          <Route path="/users/:username" element={<ProtectedRoute>{renderSingleUserInfo()}</ProtectedRoute>} />

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
