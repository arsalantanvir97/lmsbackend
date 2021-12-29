import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CourseSchema = mongoose.Schema(
  {
    coursecode: {
      type: String
    },
    coursetitle: {
      type: String
    },
    startingdate: {
      type: Date
    },
    status: {
      type: Boolean
    },
    coursecategory: {
      type: String
    },
    courseduration: {
      type: Object
    },
    images: {
      type: Array
    },
    coursedescription: {
      type: String
    },
    coursefeature: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

CourseSchema.plugin(mongoosePaginate);
CourseSchema.index({ "$**": "text" });

const Course = mongoose.model("Course", CourseSchema);

export default Course;
