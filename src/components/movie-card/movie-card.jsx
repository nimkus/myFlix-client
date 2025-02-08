import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

/**
 * MovieCard component displays information about a movie.
 * It includes a title, year, genre, rating, and an option to mark it as a favorite.
 *
 * @component
 * @param {Object} props - The component properties.
 * @param {Object} props.movie - The movie object containing details about the movie.
 * @param {string} props.movie.title - The title of the movie.
 * @param {number} props.movie.year - The release year of the movie.
 * @param {Array} props.movie.genre - The genre(s) of the movie.
 * @param {string} props.movie.genreName - The primary genre name of the movie.
 * @param {Array} props.movie.director - The director(s) of the movie.
 * @param {number} props.movie.imdb_rating - The IMDb rating of the movie.
 * @param {number} props.movie.duration - The duration of the movie in minutes.
 * @param {string} props.movie.language - The primary language of the movie.
 * @param {string} props.movie.description - A brief description of the movie.
 * @param {string} props.movie.imagePath - The URL path to the movie's poster image.
 * @param {boolean} props.movie.featured - Indicates whether the movie is featured.
 * @param {boolean} props.isFavorite - Indicates if the movie is marked as a favorite.
 * @param {Function} props.onToggleFavorite - Callback function to toggle the movie's favorite status.
 * @returns {JSX.Element} A card component displaying movie details.
 */
export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  /**
   * Reference to the card element for resize observation.
   * @type {React.RefObject<HTMLDivElement>}
   */
  const [isCompact, setIsCompact] = useState(false);

  /**
   * Reference to the card element for resize observation.
   * @type {React.RefObject<HTMLDivElement>}
   */
  const cardRef = useRef(null);

  /**
   * Observes the card's width and switches to a compact mode if below 250px.
   * Adjusts `isCompact` state accordingly.
   */
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width < 250) {
          setIsCompact(true);
        } else {
          setIsCompact(false);
        }
      }
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        resizeObserver.unobserve(cardRef.current);
      }
    };
  }, []);

  /**
   * Handles toggling the favorite status of the movie.
   * Sends a request to the API to add or remove the movie from the user's favorites.
   *
   * @async
   * @function
   * @returns {void}
   */
  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).username;
      if (!token || !username) {
        console.error("You're not logged in");
        return;
      }

      const url = `https://nimkus-movies-flix-6973780b155e.herokuapp.com/users/${username}/${movie.id}`;
      const method = isFavorite ? 'DELETE' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update favorites: ${response.statusText}`);
      }
      onToggleFavorite(movie.id); // Update the favorites list in the parent component
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <Card ref={cardRef} className="h-100 bg-light rounded-3 position-relative shadow-sm" style={{ border: 'none' }}>
      <Card.Img variant="top" src={movie.imagePath} className="bg-secondary" />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>

        {!isCompact && (
          <Card.Text>
            Year: {movie.year} <br />
            Genre: {movie.genreName} <br />
            IMDB-Rating: {movie.imdb_rating}
          </Card.Text>
        )}

        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button className="p-0" variant="link">
            Open
          </Button>
        </Link>
      </Card.Body>

      {/* Minimalist heart icon */}
      <div
        className="position-absolute bottom-0 end-0 m-2"
        style={{
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: 'var(--bs-primary)',
        }}
        onClick={handleToggleFavorite}
      >
        {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </div>
    </Card>
  );
};

/**
 * Defines the prop types for the MovieCard component.
 * @type {Object}
 */
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    year: PropTypes.number,
    genre: PropTypes.array,
    genreName: PropTypes.string,
    director: PropTypes.array,
    imdb_rating: PropTypes.number,
    duration: PropTypes.number,
    language: PropTypes.string,
    description: PropTypes.string,
    imagePath: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};
