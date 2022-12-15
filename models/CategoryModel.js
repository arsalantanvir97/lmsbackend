import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CategorySchema = mongoose.Schema(
  {
    name: {
      type: String
    },
    status: {
      type: Boolean,
      default: true
    },
    coursecount:
    {
      type: Number,default:0
    },
  },
  {
    timestamps: true
  }
);

CategorySchema.plugin(mongoosePaginate);
CategorySchema.index({ "$**": "text" });

const Category = mongoose.model("Category", CategorySchema);

export default Category;
