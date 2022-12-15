import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CertificationSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    enterpriseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

CertificationSchema.plugin(mongoosePaginate);
CertificationSchema.index({ "$**": "text" });

const Certification = mongoose.model("Certification", CertificationSchema);

export default Certification;
