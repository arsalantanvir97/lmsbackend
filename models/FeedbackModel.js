import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const FeedbackSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: { type: String },
    subject: { type: String },
    message: { type: String },
    courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    rating: { type: Number },
    review: { type: String }
  },
  {
    timestamps: true
  }
);
FeedbackSchema.plugin(mongoosePaginate);
FeedbackSchema.index({ "$**": "text" });

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;
