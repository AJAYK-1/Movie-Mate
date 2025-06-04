const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  releaseDate: { type: String, required: true },
  budget: { type: Number, required: true },
  storyline: { type: String, required: true },
  actors: { type: [String], required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  platform: { type: String, required: true },
  video: { type: String },
  trailerLink: { type: String, required: true },
  genre: { type: String, required: true },
  poster: { type: String, required: false },
  language:{type:String},
  industry:{type:String},
  review: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
      },
      reviewText: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });
const movieModel = mongoose.model('movie', movieSchema);
module.exports = movieModel
