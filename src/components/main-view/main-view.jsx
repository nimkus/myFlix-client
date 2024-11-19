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
import { Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

export const MainView = () => {
  // User Authentication
  const [auth, setAuth] = useState(() => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }));

  const { user, token } = auth;

  // State to store data fetched from the API
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const handleLogout = () => {
    // Clear user-specific data.
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  };

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
   * Fetches data from an API endpoint and updates component state.
   * Optionally handles pagination if applicable.
   *
   * @param {string} url - The API endpoint.
   * @param {function} setData - State setter function to update the component's data (array or object).
   * @param {function} [handlePagination=null] - Optional pagination handler function to update pagination state (totalPages, currentPage).
   */
  const fetchAndSetState = async (url, setData, handlePagination = null) => {
    try {
      const result = await fetchData(url);

      if (result) {
        // Check if the response contains pagination info (totalPages, currentPage)
        if (result.totalPages && result.currentPage) {
          const { data: list, totalPages, currentPage } = result;
          setData(list); // Set the array data (movies, genres, etc.)

          // If pagination is needed, call the pagination handler
          if (handlePagination) {
            handlePagination(totalPages, currentPage); // Update pagination data
          }
        } else {
          // If there is no pagination info, treat it as a single entry
          setData(result); // Set the single data object (even if it contains arrays)
        }
      } else {
        console.warn('No data received from fetch');
      }
    } catch (error) {
      console.error('Error fetching data from:', url, error);
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

  useEffect(() => {
    if (auth.user && auth.token) {
      // MOVIES, FETCH ALL
      fetchAndSetState(
        `https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies?page=${page}&limit=9`,
        (data) => {
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
            imagePath: movie.imagePath,
            featured: movie.featured,
          }));

          setMovies(moviesFromApi);
        },
        (totalPages, currentPage) => {
          setTotalPages(totalPages); // Set the total number of pages
          setPage(currentPage); // Set the current page
        }
      );

      // DIRECTORS, FETCH ALL
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

      // GENRES, FETCH ALL
      fetchAndSetState('https://nimkus-movies-flix-6973780b155e.herokuapp.com/movies/genres/all', (data) => {
        const genresFromApi = data.map((genre) => ({
          id: genre._id,
          name: genre.name,
          description: genre.description,
        }));

        setGenres(genresFromApi);
      });

      // USER, FETCH CURRENT USER INFO
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
        setFavoriteMovies(userInfoFromApi.favMovies);
      });
    } else {
      console.warn('Error fetching data.');
    }
  }, [auth.user, auth.token, page]);

  /**
   * Route rendering
   */

  const renderSignup = () => (
    <Col md={5}>
      <SignupView />
    </Col>
  );

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
      <Row className="d-flex justify-content-center mb-4">
        {/* Conditionally render the "Previous page" button */}
        {page > 1 && (
          <Button
            variant="outline-primary"
            className="px-4 rounded-pill mx-2 w-auto"
            aria-label="Go to previous page"
            onClick={() => setPage((prevPage) => prevPage - 1)}
          >
            Previous Page
          </Button>
        )}
        {/* Conditionally render the "Next page" button */}
        {page < totalPages && totalPages > 1 && (
          <Button
            variant="outline-primary"
            className="px-4 rounded-pill mx-2 w-auto"
            aria-label="Go to next page"
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Next Page
          </Button>
        )}
      </Row>
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
        <ProfileView userData={userInfo} toggleFavoriteMovie={toggleFavoriteMovie} />
      </Col>
    );
  };

  // ProtectedRoute component to handle authentication
  const ProtectedRoute = React.memo(({ children }) => {
    return auth.user ? children : <Navigate to="/login" replace />;
  });

  // Unmatched routes
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
