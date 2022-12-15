import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const SubscriptionSettingSchema = mongoose.Schema(
  {
    silvertitle: { type: String },
    silverfee: { type: Number },
    silverdescription: { type: String },
    goldtitle: { type: String },
    goldfee: { type: Number },
    golddescription: { type: String },
    platiniumtitle: { type: String },
    platiniumfee: { type: Number },
    platiniumdescription: { type: String }
  },
  {
    timestamps: true
  }
);

const SubscriptionSetting = mongoose.model(
  "SubscriptionSetting",
  SubscriptionSettingSchema
);

export default SubscriptionSetting;
