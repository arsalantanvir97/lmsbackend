import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String
    },

    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    status: {
      type: Boolean,
      default: true
    },
    subscribed: {
      type: Boolean,
      default: false
    },
    userImage: { type: String },
    enterpriseid: {
      type: String
    },
    type: { type: String }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.plugin(mongoosePaginate);
UserSchema.index({ "$**": "text" });

const User = mongoose.model("User", UserSchema);

export default User;
