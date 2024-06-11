import Appointment from "../models/AppointementModel"
import Payment from "../models/PaymentModel"
import Notification from "../models/NotificationModel"

import Mongoose from "mongoose"
import moment from "moment"
import CreateNotification from "../utills/notification.js"

const createAppointment = async (req, res) => {
  const {
    userid,
    courseid,
    cost,
    type,
    appointmentdate,
    appointmenttime,
    description,
  } = req.body
  console.log("req.body", req.body)
  try {
    const appointment = new Appointment({
      userid,
      courseid,
      type,
      cost,
      appointmentdate,
      appointmenttime,
      description,
    })
    console.log("appointment", appointment)

    const createdappointment = await appointment.save()
    console.log("createdappointment", createdappointment)
    const payment = new Payment({
      courseid,
      userid,
      type: "Appointment Booked",
      cost: Number(cost),
      appointmentid: appointment._id,
    })
    console.log("payment", payment)
    const createdpayment = await payment.save()

    if (createdappointment) {
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: `Appointment Request`,
        body: `A user have requested for an appointment type of ${type} with you on ${appointmentdate} ${appointmenttime}`,
        payload: {
          type: "USER",
          id: userid,
        },
      }
      CreateNotification(notification)
      res.status(201).json({
        createdappointment,
      })
    }
  } catch (err) {
    console.log("err", err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const appointmentlogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              name: { $regex: `${req.query.searchString}`, $options: "i" },
            },
          ],
        }
      : {}
    const status_filter = req.query.status ? { status: req.query.status } : {}
    const courseid_filter = req.query.courseidfilter
      ? { courseid: Mongoose.mongo.ObjectId(req.query.courseidfilter) }
      : {}

    const from = req.query.from
    const to = req.query.to
    let dateFilter = {}
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day"),
        },
      }

    const appointment = await Appointment.paginate(
      { ...courseid_filter, ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid",
      }
    )
    await res.status(200).json({
      appointment,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const appointmentDetails = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id)
    const appointment = await Appointment.findById(req.params.id).populate(
      "userid courseid"
    )
    await res.status(201).json({
      appointment,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndRemove(req.params.id)
    return res.status(201).json({ message: "Appointment Deleted" })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
const updatestatus = async (req, res) => {
  const { appointmentid, status, id, adminid } = req.body
  console.log("updatestatusreq.body", req.body)
  try {
    const appointment = await Appointment.findOne({ _id: appointmentid })
    console.log("appointment", appointment)

    appointment.status = status

    if (status == "Accepted") {
    }
    if (status == "Reschedule Request") {
      const notification = {
        notifiableId: appointmentid,
        notificationType: "User",
        title: `Appointment Reschedule`,
        body: `Admin has requested appointment reschedule. Please reselect time.`,
        payload: {
          type: "USER",
          id: id,
        },
      }
      CreateNotification(notification)
    }
    await appointment.save()

    await res.status(201).json({
      message: "Appointment Status Updated Successfully",
    })
  } catch (err) {
    console.log("err", err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const updatetime = async (req, res) => {
  const { notificationid, time, appointmentid } = req.body
  console.log("updatestatusreq.body", req.body)
  try {
    const appointment = await Appointment.findOne({ _id: appointmentid })
    console.log("appointment", appointment)

    appointment.appointmenttime = time
    appointment.status = "Pending"

    await appointment.save()
    await Notification.findByIdAndRemove(notificationid)

    await res.status(201).json({
      message: "Appointment Time Updated Successfully",
    })
  } catch (err) {
    console.log("err", err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}

const userAppointmentlogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              name: { $regex: `${req.query.searchString}`, $options: "i" },
            },
          ],
        }
      : {}
    const status_filter = req.query.status ? { status: req.query.status } : {}

    const from = req.query.from
    const to = req.query.to
    let dateFilter = {}
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day"),
        },
      }

    const appointment = await Appointment.paginate(
      {
        userid: Mongoose.mongo.ObjectId(req.query.userid),
        ...searchParam,
        ...status_filter,
        ...dateFilter,
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid",
      }
    )
    await res.status(200).json({
      appointment,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: err.toString(),
    })
  }
}

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
  updatestatus,
  userAppointmentlogs,
  updatetime,
}
