import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const LectureSchema = mongoose.Schema(
  {
    courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    lecturecode: {
      type: String
    },
    lecturetitle: {
      type: String
    },
    status: {
      type: Boolean,
      default: true
    },
    videoduration: {
      type: String
    },
    ad_video: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

LectureSchema.plugin(mongoosePaginate);
LectureSchema.index({ "$**": "text" });

const Lecture = mongoose.model("Lecture", LectureSchema);

export default Lecture;
