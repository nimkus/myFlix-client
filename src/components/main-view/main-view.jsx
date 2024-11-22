import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Button, Form, Dropdown, Card } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';
import { MovieView } from '../movie-view/movie-view.jsx';
import { MovieCard } from '../movie-card/movie-card.jsx';
import { DirectorsCard } from '../directors-card/directors-card.jsx';
import { DirectorsView } from '../directors-view/directors-view.jsx';
import { GenreCard } from '../genre-card/genre-card.jsx';
import { GenreView } from '../genre-view/genre-view.jsx';
import { ProfileView } from '../profile-view/profile-view.jsx';
import { NavBar } from '../nav-bar/nav-bar.jsx';

export const MainView = () => {
  // User Authentication
  const [auth, setAuth] = useState(() => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }));

  const { user, token } = auth;

  // State: Data from API
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [directors, setDirectors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // State: Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');

  const handleLogout = () => {
    // Clear user-specific data.
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuth({ user: null, token: null });
  };

  // Debounce effect to update debouncedSearchTerm after delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler); // Cleanup on unmount or searchTerm change
    };
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update immediately but debounce for actual search
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleDirectorChange = (director) => {
    setSelectedDirector(director);
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
      const isMoviesEndpoint = /^https?:\/\/[^/]+\/movies(\?.*)?$/.test(url);

      if (isMoviesEndpoint) {
        // Append search term, genre, and director filters only for the movies endpoint
        if (debouncedSearchTerm) {
          url += `&title=${encodeURIComponent(debouncedSearchTerm)}`;
        }
        if (selectedGenre) {
          url += `&genre=${encodeURIComponent(selectedGenre)}`;
        }
        if (selectedDirector) {
          url += `&director=${encodeURIComponent(selectedDirector)}`;
        }
      }

      const result = await fetchData(url);

      if (result) {
        // Check if response contains the "No results found" message
        if (result.message === 'No results found for the specified filters.') {
          setData([]); // Set an empty list to clear existing data
          setTotalPages(1); // Reset pagination
          setPage(1); // Reset current page
          return; // Exit early since there are no results
        }

        // Check if response contains pagination info (totalPages, currentPage)
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
    if (list.length === 0) {
      return <Col className="text-center my-5">{emptyMessage}</Col>;
    }

    return list.map((item) => {
      // Use `item.id` or `item._id` if available, otherwise log a warning about missing unique identifiers
      if (!item.id && !item._id) {
        console.warn("Item missing a unique 'id' or '_id'. Consider fixing this in the data source.");
      }

      // Only fallback to `index` if `id` or `_id` is not available, but log a warning to make the issue known
      return <React.Fragment key={item.id || item._id}>{renderItem(item)}</React.Fragment>;
    });
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
    }
  }, [auth.user, auth.token, debouncedSearchTerm, selectedGenre, selectedDirector, page]);

  useEffect(() => {
    if (auth.user && auth.token) {
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
  }, [auth.user, auth.token]);

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

  // Render search and filter options
  const renderFilters = () => (
    <>
      <Row className="mb-4" style={{ height: 350 }}>
        <Card style={{ position: 'relative' }}>
          <Card.Img
            src="https://i.postimg.cc/NFZyyZTZ/bunbuster-wallpaper3.webp"
            alt="Bunbuster Wallpaper"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
            }}
          />
          <Card.ImgOverlay></Card.ImgOverlay>
          <Card.ImgOverlay className="d-flex justify-content-center align-items-center text-primary">
            <Card.Text style={{ fontSize: '1.2em', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Hop into the Bunnyverse: discover your favorite blockbusters in a world ruled by bunnies!
            </Card.Text>
          </Card.ImgOverlay>
        </Card>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search movies by title"
            value={searchTerm}
            onChange={handleSearch}
            className="mb-3"
          />
        </Col>
        <Col md={3}>
          <Dropdown onSelect={(selectedId) => setSelectedGenre(selectedId || '')}>
            <Dropdown.Toggle variant="outline-primary" className="w-100">
              {selectedGenre
                ? genres.find((g) => g.id === selectedGenre)?.name || 'Filter by Genre'
                : 'Filter by Genre'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="">
                <i>All Genres</i>
              </Dropdown.Item>
              {genres.map((genre) => (
                <Dropdown.Item key={genre.id} eventKey={genre.id}>
                  {genre.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={3}>
          <Dropdown onSelect={(selectedId) => setSelectedDirector(selectedId || '')}>
            <Dropdown.Toggle variant="outline-primary" className="w-100">
              {selectedDirector
                ? directors.find((d) => d.id === selectedDirector)?.name || 'Filter by Director'
                : 'Filter by Director'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="">
                <i>All Directors</i>
              </Dropdown.Item>
              {directors.map((director) => (
                <Dropdown.Item key={director.id} eventKey={director.id}>
                  {director.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </>
  );

  const renderMovies = () => (
    <>
      <NavBar user={auth.user} onLogout={handleLogout} />
      {renderFilters()}
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
        emptyMessage="No results found for the specified filters. Try adjusting your search or filters."
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
