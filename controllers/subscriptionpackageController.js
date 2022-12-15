import moment from "moment";
import SubscriptionPackage from "../models/SubscriptionPackageModel";

const createSubscriptionPackage = async (req, res) => {
  const { type, userid, title, fee, description, duration } = req.body;
  console.log("req.body", req.body);

  try {
    const subscriptionpackage =await new SubscriptionPackage({
      type,
      userid,
      title,
      fee,
      description,
      duration
    });
    console.log("subscriptionpackage", subscriptionpackage);
    subscriptionpackage.expiryDate = moment(subscriptionpackage.createdAt).add(
      duration,
      "M"
    );
    const createdsubscriptionpackage = await subscriptionpackage.save();
    console.log("createdsubscriptionpackage", createdsubscriptionpackage);
    if (createdsubscriptionpackage) {
      res.status(201).json({
        createdsubscriptionpackage
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const subscriptionpackagelogs = async (req, res) => {
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

    const subscriptionpackage = await SubscriptionPackage.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
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
const subscriptionpackageDetails = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const subscriptionpackage = await SubscriptionPackage.findById(
      req.params.id
    ).populate("userid");
    await res.status(201).json({
      subscriptionpackage
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
export {
  createSubscriptionPackage,
  subscriptionpackageDetails,
  subscriptionpackagelogs
};
