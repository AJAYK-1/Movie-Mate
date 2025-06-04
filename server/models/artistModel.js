const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthPlace: { type: String, required: true },
  dob: { type: Date, required: true },
  firstMovie: { type: String, required: true },
  awards: { type: String },
  netWorth: { type: Number, required: true },
  role: { type: String, required: true},
  image: { type: String }, // Store image path or URL
});

const artistModel = mongoose.model('Artist', artistSchema);
module.exports=artistModel
