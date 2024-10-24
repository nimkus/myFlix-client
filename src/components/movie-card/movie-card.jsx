import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const [isCompact, setIsCompact] = useState(false);
  const cardRef = useRef(null);

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
      console.log(response);
      onToggleFavorite(movie.id); // Update the favorites list in the parent component
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <Card ref={cardRef} className="h-100 bg-light rounded-3 position-relative shadow-sm" style={{ border: 'none' }}>
      <Card.Img variant="top" src={movie.image} className="bg-secondary" />
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

// Define prop constraints
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
    image: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};
