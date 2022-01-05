import moment from "moment";
import RegisteredCourse from "../models/registeredCoursesModel";

const createregisteredCourses = async (req, res) => {
  const { userid, courseid, duration, cost } = req.body;
  console.log("req.body", req.body);
  try {
    const registeredcourses = await new RegisteredCourse({
      userid,
      courseid,
      duration,
      cost
    });
    console.log("registeredcourses", registeredcourses);
    registeredcourses.expiryDate = moment(registeredcourses.createdAt).add(
      duration,
      "M"
    );
    const createdregisteredcourses = await registeredcourses.save();
    console.log("createdregisteredcourses", createdregisteredcourses);
    if (createdregisteredcourses) {
      res.status(201).json({
        createdregisteredcourses
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const registeredcourseslogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              name: { $regex: `${req.query.searchString}`, $options: "i" }
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

    const registeredcourses = await RegisteredCourse.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid"
      }
    );
    await res.status(200).json({
      registeredcourses
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const registeredcoursesDetails = async (req, res) => {
    try {
      console.log("req.params.id", req.params.id);
      const registeredCourse = await RegisteredCourse.findById(req.params.id).populate(
        "userid courseid"
      );
      await res.status(201).json({
        registeredCourse
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
export { createregisteredCourses, registeredcourseslogs ,registeredcoursesDetails};
