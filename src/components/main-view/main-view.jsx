import React, { useState } from 'react';
import { MovieView } from '../movie-view/movie-view';
import { MovieCard } from '../movie-card/movie-card';

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      _id: { $oid: '66a776245e370b651b8dabe0' },
      title: 'Inception',
      year: 2010,
      genre: [
        { $oid: '66a778495e370b651b8dabf2' },
        { $oid: '66a778495e370b651b8dabf3' },
        { $oid: '66a778495e370b651b8dabf4' },
      ],
      director: { $oid: '66a777e35e370b651b8dabea' },
      imdb_rating: 8.8,
      duration: 148,
      language: 'English',
      description:
        'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      imagePath: '/images/inception.jpg',
      featured: true,
    },
    {
      _id: { $oid: '66a776245e370b651b8dabe1' },
      title: 'The Dark Knight',
      year: 2008,
      genre: [
        { $oid: '66a778495e370b651b8dabf2' },
        { $oid: '66a778495e370b651b8dabf5' },
        { $oid: '66a778495e370b651b8dabf6' },
      ],
      director: { $oid: '66a777e35e370b651b8dabea' },
      imdb_rating: 9,
      duration: 152,
      language: 'English',
      description:
        'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
      imagePath: '/images/the_dark_knight.jpg',
      featured: true,
    },
    {
      _id: { $oid: '66a776245e370b651b8dabe2' },
      title: 'The Shawshank Redemption',
      year: 1994,
      genre: [{ $oid: '66a778495e370b651b8dabf6' }],
      director: { $oid: '66a777e35e370b651b8dabeb' },
      imdb_rating: 9.3,
      duration: 142,
      language: 'English',
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      imagePath: '/images/shawshank_redemption.jpg',
      featured: true,
    },
  ]);

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  const [selectedMovie, setSelectedMovie] = useState(null);
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
