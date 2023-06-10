const Coach = require("../models/seat-booking.model");

//service for add seats
const addSeats = async (seats) => {
  try {
    const coach = await Coach.create({ seats });
    return coach;
  } catch (error) {
    throw new Error("Failed to add seats");
  }
};



//**service for get all seats**
const getAllSeats = async () => {
  try {
    const coach = await Coach.find();
    const seats = coach.flatMap((coach) => coach.seats);
    return seats;
  } catch (error) {
    throw new Error("Failed to retrieve seats");
  }
};



//service for booking the status of seats 
const updateSeatStatus = async (seats) => {
  const alreadyBookedSeats = [];
  const unavailableSeats = [];

  try {
    // Check if the booking exceeds the maximum number of seats per row
    if (seats.length > 7) {
      return {
        success: false,
        errorType: "validation",
        message: "Cannot book more than 7 seats in a row",
      };
    }

    // Check if the booking spans multiple rows
    const distinctRows = new Set(seats.map((seat) => seat.row));
    if (distinctRows.size > 1) {
      return {
        success: false,
        errorType: "validation",
        message: "Please book seats in a single row",
      };
    }

    // Check if the booking exceeds the maximum number of seats overall
    const coach = await Coach.findOne();
    const totalBookedSeats = coach.seats.reduce((count, seat) => {
      if (seat.isReserved) {
        return count + 1;
      }
      return count;
    }, 0);
    if (totalBookedSeats + seats.length > 80) {
      return {
        success: false,
        errorType: "validation",
        message: "Cannot book more than 80 seats",
      };
    }

    // Update the seat reservation status
    seats.forEach((seat) => {
      const targetSeat = coach.seats.find(
        (s) => s.row === seat.row && s.number === seat.number
      );
      if (targetSeat) {
        if (targetSeat.isReserved) {
          alreadyBookedSeats.push({ row: seat.row, number: seat.number });
        } else {
          targetSeat.isReserved = true;
        }
      } else {
        unavailableSeats.push({ row: seat.row, number: seat.number });
      }
    });

    // Check if seats are booked consecutively within a row
    const sortedSeats = seats.sort((a, b) => a.number - b.number);
    for (let i = 1; i < sortedSeats.length; i++) {
      if (sortedSeats[i].number !== sortedSeats[i - 1].number + 1) {
        return {
          success: false,
          errorType: "validation",
          message:
            "Seats must be booked consecutively within a row. Please select seats that are adjacent to each other in the same row.",
        };
      }
    }

    if (alreadyBookedSeats.length > 0) {
      return {
        success: false,
        errorType: "booking",
        message: "Some seats are already booked",
        alreadyBookedSeats: alreadyBookedSeats,
      };
    }

    if (unavailableSeats.length > 0) {
      return {
        success: false,
        errorType: "validation",
        message: "Some seats are not available",
        unavailableSeats,
      };
    }

    await coach.save();

    return {
      success: true,
      data: coach,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};





module.exports = {
  addSeats,
  getAllSeats,
  updateSeatStatus,
};
