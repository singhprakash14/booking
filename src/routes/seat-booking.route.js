const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seat-booking.controller");

router
  .route("/seats")
  .post(seatController.addSeats)
  .get(seatController.getAllSeats)
  .put(seatController.updateSeatStatus)

module.exports = router;
