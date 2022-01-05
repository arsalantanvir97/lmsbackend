import Booking from "../models/BookingModel";

const createBooking = async (req, res) => {
  const { time, days } = req.body;
  console.log("req.body", req.body);
  try {
    const booking = new Booking({
      time,
      days
    });
    console.log("booking", booking);

    const createdbooking = await booking.save();
    console.log("createdbooking", createdbooking);
    if (createdbooking) {
      res.status(201).json({
        createdbooking
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne();
    if (booking) {
      console.log("booking", booking);
      res.status(201).json({
        booking
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const editBooking = async (req, res) => {
  const { id, time, saturdayoff, sundayoff } = req.body;
  console.log("req.body", req.body);

  const booking = await Booking.findOne({ _id: id });
  console.log("booking", booking);
  booking.time = time ? time : booking.time;
  console.log("block1");
  booking.days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    saturdayoff ? null : "Saturday",
    sundayoff ? null : "Sunday"
  ];

  await booking.save();
  await res.status(201).json({
    booking
  });
};
export { createBooking, getBooking, editBooking };
