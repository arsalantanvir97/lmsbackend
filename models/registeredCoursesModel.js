import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const RegisteredCourseSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    lecture: {
      type: Array
    },
    expiryDate: {
      type: Date
    },
    duration: {
      type: Number
    },
    cost: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

RegisteredCourseSchema.plugin(mongoosePaginate);
RegisteredCourseSchema.index({ "$**": "text" });

const RegisteredCourse = mongoose.model(
  "RegisteredCourse",
  RegisteredCourseSchema
);

export default RegisteredCourse;
