import Feedback from "../models/FeedbackModel.js";
import moment from "moment";
import CreateNotification from "../utills/notification.js";

const createFeedback = async (req, res) => {
  const { userid, type, subject, message, courseid, rating, review } = req.body;
  console.log("req.body", req.body);
  const data = req.body;
  console.log("data", data);
  try {
    const feedback = new Feedback(data);
    console.log("feedback", feedback);

    const feedbackcreated = await feedback.save();
    console.log("feedbackcreated", feedbackcreated);
    if (feedbackcreated) {
      res.status(201).json({
        feedbackcreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const Feedbacklogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? {
          $or: [
            { type: { $regex: `${req.query.searchString}`, $options: "i" } }
          ]
        }
      : {};
    const status_filter = req.query.status ? { type: req.query.status } : {};
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

    const feedback = await Feedback.paginate(
      {
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid"
      }
    );
    await res.status(200).json({
      feedback
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getFeedbackDetails = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      "userid courseid"
    );

    await res.status(201).json({
      feedback
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createFeedback, Feedbacklogs, getFeedbackDetails };
