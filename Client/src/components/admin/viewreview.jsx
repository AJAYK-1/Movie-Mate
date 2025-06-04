import { useEffect, useState } from 'react';
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
import { Add as AddIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ViewReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    AXIOS.get('http://localhost:9000/admin/get-review')
      .then((response) => {
        const extractedReviews = response.data.flatMap(movie => 
          movie.review.map(review => ({
            ...review,
            movieName: movie.movieName
          }))
        );
        setReviews(extractedReviews);
        setFilteredReviews(extractedReviews);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load reviews');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredReviews(reviews);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = reviews.filter(
        (review) =>
          review.userId.name.toLowerCase().includes(lowercasedSearchTerm) ||
          review.movieName.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredReviews(filtered);
    }
  }, [searchTerm, reviews]);

  const handleDelete = (id) => {
    AXIOS.delete(`http://localhost:9000/admin/delete-review/${id}`)
      .then(() => {
        setReviews(reviews.filter((review) => review._id !== id));
        setFilteredReviews(filteredReviews.filter((review) => review._id !== id));
      })
      .catch(() => alert(''));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
      <Typography variant="h4" noWrap sx={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
        REVIEW LIST
      </Typography>

        <Box mb={3}>
          <TextField
            label="Search by User or Movie"
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
                <TableCell><strong>User Name</strong></TableCell>
                <TableCell><strong>Movie Name</strong></TableCell>
                <TableCell><strong>Review</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>{review.userId.name}</TableCell>
                  <TableCell>{review.movieName}</TableCell>
                  <TableCell>{review.reviewText}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(review._id)}
                    >
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

      <Link to="/admin/add-review-form">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
          }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </Container>
  );
};

export default ViewReviews;