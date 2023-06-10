const { connectToMongoDB } = require("./db/connection");
const colors = require("colors");
const express = require("express");
 const bookingRoutes = require("./routes/seat-booking.route");
const morgan = require("morgan");
require("dotenv").config({ path: "./.env" });

const app = express();

// for Cross-Origin Resource Sharing (CORS)
const cors = require("cors");
app.use(cors());
app.options("*", cors());

// for Parsing incoming JSON data
app.use(express.json());

// to Log HTTP requests in the console
app.use(morgan("dev"));

 app.use("/v1", bookingRoutes);

// for Starting the server
app.listen(process.env.PORT, async () => {
  // Connect to MongoDB
  await connectToMongoDB();
  console.log(`Server is listening on port ${process.env.PORT}`.bgBlue.white);
});

// {
//   "seats": [
//     {"row":2, "number": 1},
//     {"row":2, "number": 2},
//     {"row":2, "number": 3},
//      {"row":2, "number": 4},
//      {"row":2, "number": 5},
//      {"row":2 ,"number": 6},
//      {"row":2 ,"number": 7}
//   ]}