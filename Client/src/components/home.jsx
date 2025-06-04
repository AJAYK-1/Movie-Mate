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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import MovieIcon from '@mui/icons-material/Movie';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Sentiment from 'sentiment'

import spiderman from '../assets/spidey.avif';
import johnwick from '../assets/johnwick1.jpg';
import civilwar from '../assets/civilwar.jpg';
import avengers from '../assets/avengers.jpg';
import { useNavigate } from 'react-router-dom';
import { Gradient } from '@mui/icons-material';


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
const HomePage = () => {
  const staticPosters = [spiderman, avengers, johnwick, civilwar];

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendedGenres, setRecommendedGenres] = useState([]);
  const [filteredMovie, setFilteredMovies] = useState([])
  const navigate = useNavigate();

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

  const hollywoodMovies = movies.filter((movie) => movie.industry === 'Hollywood');
  const bollywoodMovies = movies.filter((movie) => movie.industry === 'Bollywood');
  const mollywoodMovies = movies.filter((movie) => movie.industry === 'Mollywood');
  const otherMovies = movies.filter((movie) => !['Hollywood', 'Bollywood', 'Mollywood'].includes(movie.industry));

  const redirectToTheaterLogin = () => {
    navigate('/theaterlogin');
  };


  const handleSearch = () => {
    const result = sentiment.analyze(searchTerm);
    console.log(result)
    const matchingGenres = [];
    for (const genre in genreScores) {
      if (genreScores[genre] == result.score) {
        matchingGenres.push(genre);
      }
    }
    console.log(matchingGenres)
    setRecommendedGenres(matchingGenres);

    const filtered = movies.filter((movie) => {
      const movieGenres = movie.genre.split(',');
      return movieGenres.some((genre) => matchingGenres.includes(genre.trim()));
    });

    setFilteredMovies(filtered);
    console.log(filtered)
    navigate(`/search/${result.score}`)

  };


  return (
    <Box>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "red" }}>
            <MovieIcon style={{ fontSize: 25, color: 'white' }} /> Movie Mate
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={redirectToTheaterLogin}
          >
            Theater Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Static Slideshow */}
      <Box sx={{ position: "relative", overflow: "hidden", height: "600px" }}>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
        >
          {staticPosters.map((poster, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  backgroundImage: `url(${poster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "600px",
                  width: "100%",
                  position: "relative",
                  filter: "brightness(0.8) contrast(1.2)",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Search Box */}
        <Box
          sx={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: '80%',
            maxWidth: '500px',
            height: '140px', // Increased height to accommodate the additional text
            display: 'flex',
            flexDirection: 'column', // Ensures items stack vertically
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(3, 92, 236, 0.61), rgba(246, 12, 12, 0.61))',
            borderRadius: '30px',
            padding: '10px',
          }}
        >
          <Typography variant="h5" noWrap sx={{ color: " rgb(199, 244, 243)", fontWeight: "bold", textAlign: "center" }}>
            How are you feeling today...
          </Typography> <br />
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter 'I am feeling Excited'"
            sx={{ backgroundColor: 'rgba(255, 245, 245, 0.7)', border: 'none', borderRadius: '20px' }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSearch}
            sx={{ marginTop: '10px' }}
          >
            Search
          </Button>
        </Box>

      </Box>

      {/* Movie Cards Section */}
      <Container sx={{ mt: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* Hollywood Movies */}
            {hollywoodMovies.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Hollywood Movies
                </Typography>
                <Grid container spacing={4}>
                  {hollywoodMovies.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} onClick={() => { handleCardClick(movie._id) }}>
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
                          <Typography variant="h6">{movie.movieName}</Typography>
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

            {bollywoodMovies.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Bollywood Movies
                </Typography>
                <Grid container spacing={4}>
                  {bollywoodMovies.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} onClick={() => { handleCardClick(movie._id) }}>
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
                          <Typography variant="h6">{movie.movieName}</Typography>
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

            {/* Mollywood Movies */}
            {mollywoodMovies.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Mollywood Movies
                </Typography>
                <Grid container spacing={4}>
                  {mollywoodMovies.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} onClick={() => { handleCardClick(movie._id) }}>
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
                          sx={{ width: "100%", height: "350px", objectFit: "fit" }}
                        />
                        <Box sx={{ padding: 2 }}>
                          <Typography variant="h6">{movie.movieName}</Typography>
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

            {/* Other Industry Movies */}
            {/* Other Industry Movies */}
            {otherMovies.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Other Industry Movies
                </Typography>
                <Grid container spacing={4}>
                  {otherMovies.map((movie, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index} onClick={() => { handleCardClick(movie._id) }}>
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
                          <Typography variant="h6">{movie.movieName}</Typography>
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
      <Box component="footer" sx={{ backgroundColor: "black", color: "white", textAlign: "center", py: 3, mt: 4 }}>
        <Typography variant="h6">Movie Mate</Typography>
        <Typography variant="body2">Your ultimate destination for the latest movies and reviews.</Typography>
        <Typography variant="body2">© {new Date().getFullYear()} Movie Hub. All rights reserved.</Typography>
      </Box>


    </Box>
  );
};

export default HomePage;
