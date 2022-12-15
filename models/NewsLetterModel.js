import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const NewsLetterSchema = mongoose.Schema(
  {
    email: { type: Array },
    msg: { type: String },
    subject: { type: String }
  },
  {
    timestamps: true
  }
);
NewsLetterSchema.plugin(mongoosePaginate);
NewsLetterSchema.index({ "$**": "text" });

const NewsLetter = mongoose.model("NewsLetter", NewsLetterSchema);

export default NewsLetter;
