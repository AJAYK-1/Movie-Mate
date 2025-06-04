const movieModel = require('../models/movieModel');
const artistModel = require('../models/artistModel')
const theaterModel = require('../models/theaterModel')
const userModel = require('../models/userModel')
const path = require('path')

// Add a new movie
// const addMovie = async (req, res) => {
//   try {
//     // Extract data from the request body
//     const {
//       movieName,
//       releaseDate,
//       budget,
//       storyline,
//       actors,
//       rating,
//       platform,
//       platformLink,
//       trailerLink,
//       genre,
//     } = req.body;

//     // Create a new movie document
//     const newMovie = new movieModel({
//       movieName,
//       releaseDate,
//       budget,
//       storyline,
//       actors,
//       rating,
//       platform,
//       platformLink,
//       trailerLink,
//       genre,
//       poster: req.file ? req.file.path : null, 
//     });

//     // Save to database
//     const savedMovie = await newMovie.save();
//     console.log(savedMovie)
//     // Respond with success message
//     res.status(201).json({
//       message: 'Movie added successfully',
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding movie', error: error.message });
//     console.log(error)
//   }
// };
const addMovie = async (req, res) => {
  try {
    // Extract data from the request body
    let {
      movieName,
      releaseDate,
      budget,
      storyline,
      actors,
      rating,
      platform,
      video,
      trailerLink,
      genre,
      language,
      industry
    } = req.body;

    // Ensure actors is an array (split if it's a comma-separated string)
    if (typeof actors === "string") {
      actors = actors.split(",").map(actor => actor.trim());
    }

    // Create a new movie document
    const newMovie = new movieModel({
      movieName,
      language,
      industry,
      releaseDate,
      budget,
      storyline,
      actors,
      rating,
      platform,
      poster: req.files['poster'] ? req.files['poster'][0].path : null,
      video: req.files['video'] ? req.files['video'][0].path : null,
      trailerLink,
      genre,

    });

    // Save to database
    const savedMovie = await newMovie.save();
    console.log(savedMovie);

    // Respond with success message
    res.status(201).json({
      message: "Movie added successfully",
      movie: savedMovie,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding movie", error: error.message });
    console.log(error);
  }
};



const addArtist = async (req, res) => {
  try {
    // Destructure the data from the request body
    const { name, birthPlace, dob, firstMovie, awards, netWorth, role, stagename } = req.body;
    let image = ''
    if (req.file) {
      image = req.file.path
    }
    const newArtist = new artistModel({
      name,
      stagename,
      birthPlace,
      dob,
      firstMovie,
      awards,
      netWorth,
      role,
      image
    });

    // Save the artist to the database
    await newArtist.save();

    // Respond with success message
    res.status(201).json({ message: 'Artist added successfully', artist: newArtist });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to add artist', error: err.message });
  }
}

const getArtist = async (req, res) => {

  // Find the artist by ID
  const artist = await artistModel.find({})

  if (!artist) {
    return res.status(404).json({ message: "Artist not found" });
  }
  res.status(200).json(artist);

};

const getMovies = async (req, res) => {
  const movie = await movieModel.find({})

  if (!movie) {
    return res.status(404).json({ message: "Movies not found" });
  }
  res.status(200).json(movie);

};


const viewTheaters = async (req, res) => {
  const theaters = await theaterModel.find()
  const users = await userModel.find()
  res.json({ theaters: theaters, users: users })
}

const updateVerification = async (req, res) => {
  try {
    const { userId, status } = req.body;

    // Find the user by ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = status;
    await user.save();

    res.json({ message: "Status Updated", user });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteMovie = async (req, res) => {
  id = req.headers.id
  await movieModel.findByIdAndDelete(id)
  res.json("Movie deleted successfully")
}


const deleteArtist = async (req, res) => {
  id = req.headers.id
  await artistModel.findByIdAndDelete(id)
  res.json("Artist deleted successfully")
}


const getReview = async (req, res) => {

  // Find the movie by ID
  const review = await movieModel.find({}).populate("review.userId")
  console.log(review)
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  res.status(200).json(review);

};


const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the movie that contains the review
    const movie = await movieModel.findOne({ "review._id": id });
    if (!movie) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Remove the review from the movie's review array
    movie.review = movie.review.filter(review => review._id.toString() !== id);
    await movie.save();

    // Delete the review from the Review collection if stored separately
    await Review.findByIdAndDelete(id);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};


module.exports = { addMovie, addArtist, getArtist, getMovies, viewTheaters, updateVerification, deleteMovie, deleteArtist, getReview, deleteReview };
