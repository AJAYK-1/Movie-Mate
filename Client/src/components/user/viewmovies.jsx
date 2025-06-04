import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, Paper, Divider, Rating, TextField, IconButton } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import AXIOS from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ViewMovie = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  const token = jwtDecode(localStorage.getItem("token"));
  const [review, setReview] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false); // State to toggle review visibility

  const userId = token.user._id;
  if (!movie) {
    return <Typography variant="h6">No movie data found.</Typography>;
  }

  const handleBookTickets = () => {
    navigate(`/user/book-movie/${movie._id}`);
  };

  const handleSubmitReview = () => {
    console.log("Review submitted:", { review, userId, movieId: movie._id });
    AXIOS.post("http://localhost:9000/user/review", { review, userId, movieId: movie._id })
      .then((res) => {
        alert("Review added successfully");
        window.location.reload()
      }).catch((err) => {
        console.log(err);
      });
    setReview('');
  };

  const handleShowMore = () => {
    setShowAllReviews((prev) => !prev); // Toggle the state to show more/less reviews
  };

  const reviewsToDisplay = showAllReviews ? movie.review : movie.review.slice(0, 5);

  return (
    <Box>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {movie.name}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={`http://localhost:9000/${movie.poster}`}
              alt={movie.name}
              sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
            />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
              Reviews:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {reviewsToDisplay && reviewsToDisplay.length > 0 ? (
                reviewsToDisplay.map((actor, index) => (
                  <Box
                    key={index}
                    sx={{ p: 2, borderRadius: 2, backgroundColor: 'background.paper', boxShadow: 1 }}
                  >
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      • {actor.reviewText} {/* Display the review text */}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" sx={{ textAlign: 'right', color: 'text.secondary' }}>
                      {actor.actorName} {/* Display actor name */}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No reviews available.
                </Typography>
              )}
            </Box>
            {movie.review && movie.review.length > 5 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <IconButton onClick={handleShowMore}>
                  <ExpandMoreIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  onClick={handleShowMore}
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                >
                  {showAllReviews ? 'Show Less' : 'Show More'}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>
                Release Date: {movie.releaseDate}
              </Typography>
              <Rating value={movie.rating} readOnly precision={0.1} size="small" />

              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Description:</strong> {movie.description}
              </Typography>

              <Typography variant="body2" sx={{ mt: 2 }}>
                <strong>Storyline:</strong> {movie.storyline}
              </Typography>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Cast:
              </Typography>

              {movie.actors && movie.actors.length > 0 ? (
                movie.actors.map((actor, index) => (
                  <Typography key={index} variant="body2">
                    • {actor}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No cast information available</Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 1 }}>
                Watch the Trailer:
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Watch the Trailer:</Typography>
                <iframe
                  width="100%"
                  height="315"
                  src={movie.trailerLink.replace("watch?v=", "embed/")}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>

              {/* Booking Button */}
              {movie.platform === "Theater" ? (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBookTickets}
                    fullWidth
                  >
                    Book Tickets
                  </Button>
                </Box>
              ) : movie.video ? (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Available for Streaming:
                  </Typography>
                  <video
                    src={`http://localhost:9000/${movie.video}`}
                    controls
                    width="100%"
                    style={{ maxWidth: "600px" }}
                  />
                </Box>
              ) : null}

              {/* Add review section */}
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Leave a Review:
              </Typography>
              <TextField
                label="Your Review"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitReview}
                disabled={!review}
              >
                Submit Review
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ViewMovie;



// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Box, Container, Typography, Grid, Button, Paper, Divider, Rating, TextField } from '@mui/material';
// import { jwtDecode } from 'jwt-decode';
// import AXIOS from 'axios'

// const ViewMovie = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const movie = location.state?.movie;
//   const token=jwtDecode(localStorage.getItem("token"))
//   const [review, setReview] = useState('');
//   const userId = token.user._id;  
//   if (!movie) {
//     return <Typography variant="h6">No movie data found.</Typography>;
//   }

//   const handleBookTickets = () => {
//     navigate(`/user/book-movie/${movie._id}`);
//   };

//   const handleSubmitReview = () => {
//     console.log("Review submitted:", { review, userId, movieId: movie._id });
//     AXIOS.post("http://localhost:9000/user/review",{ review, userId, movieId: movie._id })
//     .then((res)=>{
//       alert("Review added successfully")
//     }).catch((err)=>{
//       console.log(err)
//     })
//     setReview('');
//   };

//   return (
//     <Box>
//       <Container sx={{ mt: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           {movie.name}
//         </Typography>
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={4}>
//             <Box
//               component="img"
//               src={`http://localhost:9000/${movie.poster}`}
//               alt={movie.name}
//               sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
//             />
//           </Grid>

//           <Grid item xs={12} md={8}>
//             <Paper sx={{ padding: 3, boxShadow: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Release Date: {movie.releaseDate}
//               </Typography>
//               <Rating value={movie.rating} readOnly precision={0.1} size="small" />

//               <Typography variant="body1" sx={{ mt: 2 }}>
//                 <strong>Description:</strong> {movie.description}
//               </Typography>

//               <Typography variant="body2" sx={{ mt: 2 }}>
//                 <strong>Storyline:</strong> {movie.storyline}
//               </Typography>

//               <Divider sx={{ my: 3 }} />
//               <Typography variant="h6" sx={{ mb: 1 }}>
//                 Cast:
//               </Typography>

//               {movie.actors && movie.actors.length > 0 ? (
//                 movie.actors.map((actor, index) => (
//                   <Typography key={index} variant="body2">
//                     • {actor}
//                   </Typography>
//                 ))
//               ) : (
//                 <Typography variant="body2">No cast information available</Typography>
//               )}

//               <Divider sx={{ my: 3 }} />

//               <Typography variant="h6" sx={{ mb: 1 }}>
//                 Watch the Trailer:
//               </Typography>
//               <Box sx={{ mt: 3 }}>
//                 <Typography variant="h6" sx={{ mb: 1 }}>Watch the Trailer:</Typography>
//                 <iframe
//                   width="100%"
//                   height="315"
//                   src={movie.trailerLink.replace("watch?v=", "embed/")}
//                   title="YouTube video player"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 ></iframe>
//               </Box>

//               {/* Booking Button */}
//               {movie.platform === "Theater" ? (
//                 <Box sx={{ mt: 3 }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleBookTickets}
//                     fullWidth
//                   >
//                     Book Tickets
//                   </Button>
//                 </Box>
//               ) : movie.video ? (
//                 <Box sx={{ mt: 3 }}>
//                   <Typography variant="h6" sx={{ mb: 1 }}>
//                     Available for Streaming:
//                   </Typography>
//                   <video
//                     src={`http://localhost:9000/${movie.video}`}
//                     controls
//                     width="100%"
//                     style={{ maxWidth: "600px" }}
//                   />
//                 </Box>
//               ) : null}

//               {/* Add review section */}
//               <Divider sx={{ my: 3 }} />
//               <Typography variant="h6" sx={{ mb: 1 }}>
//                 Leave a Review:
//               </Typography>
//               <TextField
//                 label="Your Review"
//                 variant="outlined"
//                 fullWidth
//                 multiline
//                 rows={4}
//                 value={review}
//                 onChange={(e) => setReview(e.target.value)}
//                 sx={{ mb: 2 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmitReview}
//                 disabled={!review}
//               >
//                 Submit Review
//               </Button>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default ViewMovie;
