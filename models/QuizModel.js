import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const QuizSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    lectureid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture"
    },
    status: {
      type: String,
      default: "Pending"
    },

    quizinfo: {
      type: Array
    },
    passingmarks: {
      type: Number
    },
    totalmarks: {
      type: Number
    },
    quizduration: {
      type: Number
    },
    startingdate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

QuizSchema.plugin(mongoosePaginate);
QuizSchema.index({ "$**": "text" });

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;
