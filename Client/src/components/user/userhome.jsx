import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Rating,
  TextField,
  MenuItem,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Button,
} from '@mui/material';
import axios from 'axios';
import MovieIcon from '@mui/icons-material/Movie';
import Sentiment from 'sentiment'; // Import Sentiment library

const sentiment = new Sentiment(); // Initialize sentiment analysis

const UserHome = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchText, setSearchText] = useState(''); // State to store search box input
  const navigate = useNavigate();

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

  const handleMovieClick = (movie) => {
    navigate(`/user/movie/${movie._id}`, { state: { movie } });
  };

  const handleMyBookings = () => {
    navigate('/user/mybooking'); // Navigate to My Bookings page
  };

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };

  // Filter movies based on selected criteria
  const filteredMovies = movies.filter((movie) => (
    (!selectedGenre || movie.genre.split(',').some((genre) =>
      selectedGenre.toLowerCase().includes(genre.trim().toLowerCase())
    )) &&
    (!selectedRating || movie.rating.toString().includes(selectedRating.toString()))
  ));

  // Handle Search Button Click
  const handleSearchClick = () => {
    const result = sentiment.analyze(searchText);
    const score = result.score; // Get the sentiment score (positive or negative)

    // Redirect to the search page with sentiment score
    if (searchText.trim()) {
      navigate(`/user/search/${score}`);
    }
  };

  return (
    <Box>
      {/* AppBar with My Bookings Button */}
      <AppBar position="sticky" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end", gap: "25px" }}>
          <Typography variant="h6" sx={{ color: "red" }}>
            <MovieIcon style={{ fontSize: 25, color: 'white' }} /> Movie Mate
          </Typography>
          <Button variant="contained" color="error" onClick={handleMyBookings}>
            My Bookings
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 10, gap: 20, backgroundColor: "white",width:"100%",height: "200px" }}>

        {/* Floating Search Box */}
        <Box
          sx={{
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            width: '80%',
            maxWidth: '500px',
            height: '200px', // Increased height to accommodate the additional text
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


          {/* Search Box for Sentiment Analysis */}
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter 'I am feeling Excited'"
            sx={{ backgroundColor: 'rgba(250, 255, 245, 0.7)', border: 'none', borderRadius: '20px' }}
          /> <br />


          {/* Search Button */}
          <Button variant="contained" color="primary" onClick={handleSearchClick} >
            Search
          </Button>
        </Box>
        <br />

      </Container>




      {/* Filters Section */}
      <Container sx={{ mt: 2, display: "flex", gap: 2, backgroundColor: "white" }}>

        <TextField
          select
          label="Genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Action">Action</MenuItem>
          <MenuItem value="Adventure">Adventure</MenuItem>
          <MenuItem value="Thriller">Thriller</MenuItem>
          <MenuItem value="Family">Family</MenuItem>
          <MenuItem value="Animation">Animation</MenuItem>
          <MenuItem value="Comedy">Comedy</MenuItem>
          <MenuItem value="Fantasy">Fantasy</MenuItem>
        </TextField>

        <TextField
          select
          label="Rating"
          value={selectedRating}
          onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
          variant="outlined"
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={4}>4 </MenuItem>
          <MenuItem value={3}>3</MenuItem>
        </TextField>

      </Container>

      {/* Movie List */}
      <Container sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
                  <Card
                    sx={{ maxWidth: 300, cursor: 'pointer', border: "1px solid red" }}
                    onClick={() => handleMovieClick(movie)}
                  >
                    <CardMedia
                      component="img"
                      height="350"
                      image={`http://localhost:9000/${movie.poster}`}
                      alt={movie.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{movie.movieName}</Typography>
                      <Typography variant="body2">Genre: {movie.genre}</Typography>
                      <Typography variant="body2">Artist: {movie.actors}</Typography>
                      <Rating value={movie.rating} readOnly precision={0.5} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" align="center" sx={{ width: "100%", mt: 2 }}>
                No movies found.
              </Typography>
            )}
          </Grid>
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

export default UserHome;
