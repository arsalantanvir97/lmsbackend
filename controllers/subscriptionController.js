import moment from "moment";
import Subscription from "../models/SubscriptionModel";
import Mongoose from "mongoose";

const subscriptionlogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              type: { $regex: `${req.query.searchString}`, $options: "i" }
            }
          ]
        }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};

    const from = req.query.from;
    const to = req.query.to;
    let dateFilter = {};
    if (from && to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(from)).startOf("day"),
          $lte: moment.utc(new Date(to)).endOf("day")
        }
      };

    const subscriptionpackage = await Subscription.paginate(
      {
        userid: Mongoose.mongo.ObjectId(req.query.userid),
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid"
      }
    );
    await res.status(200).json({
      subscriptionpackage
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
export { subscriptionlogs };
