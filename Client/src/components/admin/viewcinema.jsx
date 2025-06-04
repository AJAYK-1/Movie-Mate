import React, { useEffect, useState } from 'react';
import AXIOS from 'axios';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Fab,
  TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material'; // Import AddIcon for the button
import { Link } from 'react-router-dom'; // Import Link for navigation

const ViewMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    AXIOS.get('http://localhost:9000/admin/get-movies')
      .then((response) => {
        setMovies(response.data);
        setFilteredMovies(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load movie details');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMovies(movies);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = movies.filter((movie) =>
        movie.movieName.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  const handleDelete = (id) => {
    AXIOS.delete("http://localhost:9000/admin/deleteMovie", { headers: { id: id } })
      .then((res) => {
        alert(res.data);
        setMovies(movies.filter(movie => movie._id !== id));
      }).catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container maxWidth="xl">
      <Box mt={4}>
        <Typography variant="h4" noWrap sx={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          MOVIES LIST
        </Typography>

        <Box mb={3}>
          <TextField
            label="Search by Movie Name"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Movie Name</strong></TableCell>
                <TableCell><strong>Release Date</strong></TableCell>
                <TableCell><strong>Budget</strong></TableCell>
                <TableCell><strong>Actors</strong></TableCell>
                <TableCell><strong>Rating</strong></TableCell>
                <TableCell><strong>Platform</strong></TableCell>
                <TableCell><strong>Poster</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow key={movie._id}>
                  <TableCell>{movie.movieName}</TableCell>
                  <TableCell>{new Date(movie.releaseDate).toLocaleDateString()}</TableCell>
                  <TableCell>${movie.budget} million</TableCell>
                  <TableCell>{movie.actors.join(', ')}</TableCell>
                  <TableCell>{movie.rating}</TableCell>
                  <TableCell>{movie.platform}</TableCell>
                  <TableCell>
                    {movie.poster && (
                      <img
                        src={`http://localhost:9000/${movie.poster}`}
                        alt={movie.movieName}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '10px' }} onClick={() => handleDelete(movie._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={2}>
          <Button variant="contained" color="primary" href="/admin/dashboard">
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      <Link to="/admin/add-movie-form">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </Container>
  );
};

export default ViewMovies;
