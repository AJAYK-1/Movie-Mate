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

const ViewArtists = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    AXIOS.get('http://localhost:9000/admin/get-artist')
      .then((response) => {
        setArtists(response.data);
        setFilteredArtists(response.data); // Initially set filteredArtists to all artists
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load artist details');
        setLoading(false);
      });
  }, []);

  // Filter artists based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredArtists(artists);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = artists.filter(
        (artist) =>
          artist.name.toLowerCase().includes(lowercasedSearchTerm) ||
          artist.firstMovie.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredArtists(filtered);
    }
  }, [searchTerm, artists]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  const handleDelete = (id) => {
    AXIOS.delete("http://localhost:9000/admin/deleteArtist", { headers: { id: id } })
      .then((res) => {
        alert(res.data)
      }).catch((err) => {
        console.log(err)
      })
  }

  // if (filteredArtists.length === 0) {
  //   return <Typography>No artists found</Typography>;
  // }

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
      <Typography variant="h4" noWrap sx={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
        ARTIST LIST
      </Typography>

        {/* Search bar to filter artists */}
        <Box mb={3}>
          <TextField
            label="Search by Name or Cinema"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Table to display artists information */}
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Birth Place</strong></TableCell>
                <TableCell><strong>Date of Birth</strong></TableCell>
                <TableCell><strong>Debut Movie</strong></TableCell>
                <TableCell><strong>Awards</strong></TableCell>
                <TableCell><strong>Net Worth</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredArtists.map((artist) => (
                <TableRow key={artist._id}>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>{artist.birthPlace}</TableCell>
                  <TableCell>{new Date(artist.dob).toLocaleDateString()}</TableCell>
                  <TableCell>{artist.firstMovie}</TableCell>
                  <TableCell>{artist.awards || 'N/A'}</TableCell>
                  <TableCell>{artist.netWorth} Million</TableCell>
                  <TableCell>{artist.role}</TableCell>
                  <TableCell>
                    {artist.image && (
                      <img
                        src={`http://localhost:9000/${artist.image}`}
                        alt={artist.name}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '10px' }} onClick={()=>handleDelete(artist._id)}>
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

      <Link to="/admin/add-artist-form">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            '@media (max-width: 600px)': {
              bottom: 16,
              right: 16,
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </Container>
  );
};

export default ViewArtists;
