import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const CostSettingSchema = mongoose.Schema(
  {
    audiocall: { type: Number },
    chat: { type: Number },
    videocall: { type: Number }
  },
  {
    timestamps: true
  }
);

const CostSetting = mongoose.model("CostSetting", CostSettingSchema);

export default CostSetting;
