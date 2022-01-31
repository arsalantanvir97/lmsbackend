import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PaymentSchema = mongoose.Schema(
  {
    courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    appointmentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },
    type: { type: String },
    cost: { type: Number }
  },
  {
    timestamps: true
  }
);

PaymentSchema.plugin(mongoosePaginate);
PaymentSchema.index({ "$**": "text" });

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
