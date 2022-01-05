import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const BookingSchema = mongoose.Schema(
  {
    time: { type: Array },
    days: { type: Array },

  },
  {
    timestamps: true
  }
);
BookingSchema.plugin(mongoosePaginate);
BookingSchema.index({ "$**": "text" });

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
