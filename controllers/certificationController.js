import moment from "moment";
import Cerftification from "../models/CerftificationModel";

const createregisteredCourses = async (req, res) => {
  const { userid, courseid, enterpriseid } = req.body;
  console.log("req.body", req.body);
  try {
    const cerftification = await new Cerftification({
      userid,
      courseid,
      enterpriseid
    });
    console.log("cerftification", cerftification);

    const createdcerftification = await cerftification.save();
    console.log("createdcerftification", createdcerftification);
    if (createdcerftification) {
      res.status(201).json({
        createdcerftification
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const certificationlogs = async (req, res) => {
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

    const cerftification = await Cerftification.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid enterpriseid"
      }
    );
    await res.status(200).json({
      cerftification
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createregisteredCourses ,certificationlogs};
