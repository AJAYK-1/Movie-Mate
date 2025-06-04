import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AppBar, Toolbar, Button, Typography, List, ListItem, 
  CircularProgress, Box, TextField, IconButton, 
  Select,
  MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Addmovies() {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('token');

  if (!storedToken) {
    navigate('/theaterlogin'); 
    return null;
  }

  const [movies, setMovies] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMovie, setNewMovie] = useState("");
  const [selectedShows, setSelectedShows] = useState([]);
  const token = jwtDecode(storedToken);
  const [fetchedMovie, setFetchedmovie] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9000/theater/viewProfile", {
      headers: { id: token.theater._id }
    })
    .then((res) => {
      if (Array.isArray(res.data.movies)) {
        setMovies(res.data.movies);
      } else {
        setMovies([]); 
      }
      setLoading(false);
    })
    .catch(err => {
      console.log("Error fetching movies:", err);
      setError("Failed to load movies");
      setLoading(false);
    });

    axios.get("http://localhost:9000/admin/get-movies")
    .then((res) => {
      setFetchedmovie(res.data);
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const theaterMovies = fetchedMovie.filter((movie) => movie.platform === 'Theater');
  console.log(theaterMovies);

  // Function to handle changes in show selection
  const handleShowChange = (event) => {
    const { value, checked } = event.target;
    setSelectedShows(prevShows => 
      checked ? [...prevShows, value] : prevShows.filter(show => show !== value)
    );
  };

  // Function to add a new movie with selected shows
  const handleAddMovie = () => {
    if (newMovie.trim() === "" || selectedShows.length === 0) return;

    const movieData = {
      movie: newMovie,
      theaterId: token.theater._id,
      shows: selectedShows,  // Include the selected shows
    };

    axios.post("http://localhost:9000/theater/addMovie", movieData)
    .then(res => {
      setMovies([...movies, { movieName: newMovie, shows: selectedShows }]); // Update local state
      setNewMovie(""); // Clear input
      setSelectedShows([]); // Clear selected shows
    })
    .catch(err => console.log("Error adding movie:", err));
  };

  // Function to remove a movie
  const handleRemoveMovie = (movieToRemove) => {
    axios.post("http://localhost:9000/theater/removeMovie", 
      { movie: movieToRemove.movieName, theaterId: token.theater._id }
    )
    .then((res) => {
      setMovies(movies.filter(movie => movie.movieName !== movieToRemove.movieName)); // Remove movie locally
    })
    .catch(err => console.log("Error removing movie:", err));
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to login page
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "red" }}>
            Theater Dashboard
          </Typography>
          <Box>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={() => navigate('/theaterhome/profile')}>
              Profile
            </Button>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={() => navigate('/theaterhome/bookings')}>
              Bookings
            </Button>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={() => navigate('/theaterhome/addmovies')}>
              Movies
            </Button>
            <Button sx={{ color: "white", backgroundColor: "red", mx: 1 }} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Movie List */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Movies in Theater
        </Typography>

        {/* Add Movie Section */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Select
            label="New Movie"
            value={newMovie}
            onChange={(e) => setNewMovie(e.target.value)}
            fullWidth
          >
            {theaterMovies.map((movie) => (
              <MenuItem key={movie._id} value={movie.movieName}>
                {movie.movieName}
              </MenuItem>
            ))}
          </Select>

          <Box>
            <Typography>Select Shows:</Typography>
            {[
  "Morning Show 10AM",
  "Morning Show 10:30AM",
  "Morning Show 11AM",
  "Morning Show 11:30AM",
  "Noon Show 12PM",
  "Noon Show 12:30PM",
  "Noon Show 2PM",
  "Noon Show 2:30PM",
  "Evening Show 5PM",
  "Evening Show 6PM",
  "Evening Show 7PM",
  "Night Show 9PM",
  "Late Night Show 11PM"
]
.map((show) => (
              <FormControlLabel
                key={show}
                control={
                  <Checkbox
                    value={show}
                    checked={selectedShows.includes(show)}
                    onChange={handleShowChange}
                  />
                }
                label={show}
              />
            ))}
          </Box>

          <Button 
            variant="contained" 
            sx={{ backgroundColor: "red", color: "white" }} 
            onClick={handleAddMovie}
          >
            Add Movie
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : movies.length === 0 ? (
          <Typography>No movies available.</Typography>
        ) : (
          <List>
            {movies.map((movie, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  borderBottom: "1px solid #ccc", 
                  py: 2, 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    MOVIE: {movie.movieName.toUpperCase()}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "red", mt: 1 }}>
                    SHOWS: {movie.shows.join(", ")}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleRemoveMovie(movie)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );
}
