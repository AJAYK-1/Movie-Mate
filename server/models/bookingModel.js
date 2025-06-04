const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'movie', required: true },
    theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    date: { type: Date, required: true },
    time:{type:String},
    seats: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
}, { timestamps: true });

 const bookingModel=mongoose.model('Booking', bookSchema);

 module.exports=bookingModel
