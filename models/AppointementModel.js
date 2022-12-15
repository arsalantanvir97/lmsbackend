import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AppointmentSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    type: { type: String },
    cost: { type: Number },
    appointmentdate: { type: String },
    description: { type: String },
    appointmenttime: { type: String },
    status: { type: String, default: "Pending" }
  },
  {
    timestamps: true
  }
);

AppointmentSchema.plugin(mongoosePaginate);
AppointmentSchema.index({ "$**": "text" });

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
