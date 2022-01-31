import Booking from "../models/BookingModel";
import moment from "moment";
import Appointment from "../models/AppointementModel";
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
const checkAlreadyBooked = async (req, res) => {
  const { requestdate, requesttime } = req.body;
  console.log("req.bodyyyyyyy", req.body);
  try {
    const booking = await Booking.findOne();
    let date2 = moment(requestdate).format("DD/MM/YYYY");
    console.log("date2", date2);

    const date = moment(requestdate);
    console.log("date", date);
    const dow = date.day();
    console.log(dow);
    let bookingdate = [];
    booking.days.length > 0 &&
      booking.days.map((book) =>
        book == "Monday"
          ? bookingdate.push(1)
          : book == "Tuesday"
          ? bookingdate.push(2)
          : book == "Wednesday"
          ? bookingdate.push(3)
          : book == "Thursday"
          ? bookingdate.push(4)
          : book == "Friday"
          ? bookingdate.push(5)
          : book == "Saturday"
          ? bookingdate.push(6)
          : book == "Sunday"
          ? bookingdate.push(7)
          : null
      );
    console.log("booking1");
    let booking2=[]
     booking2 = await Booking.find({
      time: { $elemMatch: { time: requesttime } }
    });
    console.log("booking2", booking2.length);
    if (bookingdate.includes(dow) && booking2.length > 0) {
      console.log("includesblock");
      const appointment = await Appointment.find({
        appointmentdate: date2,
        appointmenttime: requesttime
      });
      console.log(appointment, "appointment");
      if (appointment.length > 0) {
        res.status(202).json({
          message: "Already booked"
        });
      } else {
        res.status(201).json({
          message: "You are ready to book appointment with admin"
        });
      }
    } else {
      console.log("elseblock");
      res.status(202).json({
        message: "Admin have this day off. Please select another day"
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createBooking, getBooking, editBooking, checkAlreadyBooked };
