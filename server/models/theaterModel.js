const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name: { type: String },
    license: { type: String },
    email: { type: String },
    place: { type: String },
    movies: [
        {
            movieName: { type: String },
            shows: { type: [String] } 
        }
    ],
    password: { type: String }
}, { timestamps: true });

const TheaterModel = mongoose.model("Theater", theaterSchema);

module.exports = TheaterModel;
