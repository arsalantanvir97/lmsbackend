import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const SubscriptionSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    subscriptionname:{type: String},
    subscriptionprice:{type: Number},
  },
  {
    timestamps: true
  }
);

SubscriptionSchema.plugin(mongoosePaginate);
SubscriptionSchema.index({ "$**": "text" });

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
