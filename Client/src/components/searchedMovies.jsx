import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Rating,
  CircularProgress,
  Button,
  TextField
} from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Sentiment from 'sentiment'

import spiderman from '../assets/spidey.avif';
import johnwick from '../assets/johnwick1.jpg';
import civilwar from '../assets/civilwar.jpg';
import avengers from '../assets/avengers.jpg';
import { useNavigate, useParams } from 'react-router-dom';

const genreScores = {
  Action: 1,         // Excitement, but can be violent
  Comedy: 4,         // Often positive, light-hearted
  Drama: 1,          // Mixed emotion, often heavy
  Horror: -4,        // Fear, tension, negative
  Romance: 5,        // Love, positive
  "Sci-Fi": 2,       // Often exciting, adventurous, sometimes dystopian
  Thriller: -1,      // Tense, anxious
  Animation: 4,      // Often light, positive (but varies)
  Documentary: 0,    // Neutral, fact-based
  Adventure: 3,      // Positive excitement
  Fantasy: 3,        // Imaginative, often uplifting
  Mystery: 0,        // Curious, neutral
  Crime: -2,         // Often dark, violent
  Historical: 1,     // Mixed tone
  Biography: 2,      // Usually inspiring
  Family: 5,         // Positive, wholesome
  Musical: 4,        // Joyful, uplifting
  War: -3,           // Violent, emotional
  Western: 1,        // Can be neutral or action-based
  Superhero: 3       // Positive, heroic
};

const sentiment = new Sentiment()

const SearchedMovies = () => {
  const staticPosters = [spiderman, avengers, johnwick, civilwar];

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendedGenres, setRecommendedGenres] = useState([]);
  const [filteredMovie, setFilteredMovies] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  console.log(params.id);
  // score passed in URL params

  const handleCardClick = (movieId) => {
    navigate(`/movie-details/${movieId}`);
  };

  useEffect(() => {
    axios.get('http://localhost:9000/user/viewmovie')
      .then((res) => {
        setMovies(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);

  // Use the score from URL params to filter movies
  useEffect(() => {
    if (params.id) {
      const score = parseInt(params.id, 10); // Parse the score from params
      const filtered = movies.filter((movie) => {
        const movieGenres = movie.genre.split(',');
        return movieGenres.some((genre) => genreScores[genre.trim()] === score);
      });
      setFilteredMovies(filtered);
    }
  }, [movies, params.score]);



  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "red" }}>
            Movie Hub
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate('/theaterlogin')}
          >
            Theater Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Static Slideshow */}


      {/* Movie Cards Section */}
      <Container sx={{ mt: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* Filtered Movies */}
            {filteredMovie.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Filtered Movies 
                  {/* (Score: {params.score}) */}
                </Typography>
                <Grid container spacing={4}>
                  {filteredMovie.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} onClick={() => handleCardClick(movie._id)}>
                      <Box
                        sx={{
                          border: "1px solid red",
                          borderRadius: "8px",
                          overflow: "hidden",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.7)",
                          backgroundColor: "white",
                        }}
                      >
                        <Box
                          component="img"
                          src={`http://localhost:9000/${movie.poster}`}
                          alt={movie.name}
                          sx={{ width: "100%", height: "350px", objectFit: "cover" }}
                        />
                        <Box sx={{ padding: 2 }}>
                          <Typography variant="h6">{movie.name}</Typography>
                          <Typography variant="body2">Genre: {movie.genre}</Typography>
                          <Typography variant="body2">Cast: {movie.actors.join(', ')}</Typography>
                          <Rating value={movie.rating} readOnly precision={0.5} />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default SearchedMovies;
