import Appointment from "../models/AppointementModel";

const createAppointment = async (req, res) => {
  const { userid, courseid, type, cost, appointmentdate, appointmenttime } =
    req.body;
  console.log("req.body", req.body);
  try {
    const appointment = new Appointment({
      userid,
      courseid,
      type,
      cost,
      appointmentdate,
      appointmenttime
    });
    console.log("appointment", appointment);

    const createdappointment = await appointment.save();
    console.log("createdappointment", createdappointment);
    if (createdappointment) {
      res.status(201).json({
        createdappointment
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const appointmentlogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              name: { $regex: `${req.query.searchString}`, $options: "i" }
            }
          ]
        }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};

    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day")
        }
      };

    const appointment = await Appointment.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid"
      }
    );
    await res.status(200).json({
      appointment
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const appointmentDetails = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const appointment = await Appointment.findById(req.params.id).populate(
      "userid courseid"
    );
    await res.status(201).json({
      appointment
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndRemove(req.params.id);
    return res.status(201).json({ message: "Appointment Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updatestatus = async (req, res) => {
  const { status, id } = req.body;
  console.log('updatestatusreq.body',req.body)
  try {
    const appointment = await Appointment.findOne({ _id: id });
    console.log("appointment", appointment);

    appointment.status = status;

    await appointment.save();
    await res.status(201).json({
      message: "Appointment Status Updated Successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
// const editBooking = async (req, res) => {
//   const { id, time, saturdayoff, sundayoff } = req.body;
//   console.log("req.body", req.body);

//   const booking = await Booking.findOne({ _id: id });
//   console.log("booking", booking);
//   booking.time = time ? time : booking.time;
//   console.log("block1");
//   booking.days = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     saturdayoff ? null : "Saturday",
//     sundayoff ? null : "Sunday"
//   ];

//   await booking.save();
//   await res.status(201).json({
//     booking
//   });
// };
export {
  createAppointment,
  appointmentlogs,
  appointmentDetails,
  deleteAppointment,
  updatestatus
};
