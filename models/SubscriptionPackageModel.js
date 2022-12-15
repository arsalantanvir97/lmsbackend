import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const SubscriptionPackageSchema = mongoose.Schema(
  {
    type: { type: String },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    expiryDate: {
      type: Date
    },
    title: { type: String },
    fee: { type: Number },
    description: { type: String },
    duration: { type: Number }
  },
  {
    timestamps: true
  }
);
SubscriptionPackageSchema.plugin(mongoosePaginate);
SubscriptionPackageSchema.index({ "$**": "text" });

const SubscriptionPackage = mongoose.model(
  "SubscriptionPackage",
  SubscriptionPackageSchema
);

export default SubscriptionPackage;
