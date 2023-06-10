const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  row: {
    type: Number,
    required: [true, "Row number is required."], 
  },
  number: {
    type: Number,
    required: [true, "Seat number is required."], 
  },
  isReserved: {
    type: Boolean,
    default: false,
  },
});

const coachSchema = new mongoose.Schema({
  seats: [seatSchema],
});

const Coach = mongoose.model("Coach", coachSchema);

module.exports = Coach;
