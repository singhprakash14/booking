const httpStatus = require("http-status");
const Coach = require("../models/seat-booking.model");
const SeatService =require('../services/seat-booking.service')
// Controller function for adding seats to the coach
const addSeats = async (req, res) => {
  const { seats } = req.body;

  try {
    const coach = await SeatService.addSeats(seats);

    return res.status(httpStatus.CREATED).json({
      success: true,
      message: "Seats added successfully",
      data: coach,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to add seats",
      error: error.message,
    });
  }
};
// Controller function for retrieving all seats
const getAllSeats = async (req, res) => {
  try {
    const seats = await SeatService.getAllSeats();

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Seats retrieved successfully",
      data: seats,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve seats",
      error: error.message,
    });
  }
};


// Controller function for updating seat reservation status
const updateSeatStatus = async (req, res) => {
  const { seats } = req.body;

  try {
    const result = await SeatService.updateSeatStatus(seats);

    if (result.success) {
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Seat reservation status updated successfully",
        data: result.data,
      });
    } else if (result.errorType === "validation") {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: result.message,
        errors: result.errors,
      });
    } else if (result.errorType === "booking") {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Some seats are already booked",
        alreadyBookedSeats: result.alreadyBookedSeats,
       
      });
    } else {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update seat reservation status",
        error: result.error.message,
      });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update seat reservation status",
      error: error.message,
    });
  }
};






module.exports = { addSeats, getAllSeats, updateSeatStatus };
