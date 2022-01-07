import Course from "../models/CourseModel";

const createCourse = async (req, res) => {
  const {
    coursecode,
    coursetitle,
    startingdate,
    status,
    coursecategory,
    courseduration,
    coursedescription,
    coursefeature
  } = req.body;
  let _reciepts = [];
  const reciepts = [];
  _reciepts = req.files.reciepts;
  console.log("req.bopdy", req.body);
  if (!Array.isArray(_reciepts)) throw new Error("Reciepts Required");
  _reciepts.forEach((img) => reciepts.push(img.path));
  const course = await Course.create({
    coursecode,
    coursetitle,
    startingdate,
    status,
    coursecategory: JSON.parse(coursecategory),
    courseduration: JSON.parse(courseduration),
    coursedescription,
    coursefeature,
    images: reciepts
  });
  if (course) {
    console.log("course", course);
    res.status(201).json({
      course
    });
  } else {
    res.status(400);
    throw new Error("Invalid course data");
  }
};

const courselogs = async (req, res) => {
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

    const course = await Course.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "coursecategory"
      }
    );
    await res.status(200).json({
      course
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const toggleActiveStatus = async (req, res) => {
  console.log("req.params.id", req.params.id);
  try {
    const course = await Course.findById(req.params.id);
    console.log("course", course);
    course.status = course.status == true ? false : true;
    await course.save();
    await res.status(201).json({
      message: course.status ? "Course Activated" : "Course Inactivated"
    });
  } catch (err) {
    console.log("error", error);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const courseDetails = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const course = await Course.findById(req.params.id).populate(
      "coursecategory"
    );
    await res.status(201).json({
      course
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editCourse = async (req, res) => {
  try {
    const {
      id,
      coursecode,
      coursetitle,
      startingdate,
      status,
      coursecategory,
      courseduration,
      coursedescription,
      coursefeature
    } = req.body;
    let _reciepts = [];
    const reciepts = [];
    _reciepts = req.files.reciepts;
    console.log("req.bopdy", req.body);
    console.log("block1");
    _reciepts && _reciepts.forEach((img) => reciepts.push(img.path));

    console.log("block2");

    const course = await Course.findOne({ _id: id });
    course.coursecode = coursecode ? coursecode : course.coursecode;
    course.coursetitle = coursetitle ? coursetitle : course.coursetitle;
    course.startingdate = startingdate ? startingdate : course.startingdate;
    course.status = status ? status : course.status;
    course.coursecategory = coursecategory
      ? JSON.parse(coursecategory)
      : course.coursecategory;
    course.courseduration =
      courseduration.length > 4
        ? JSON.parse(courseduration)
        : course.courseduration;
    course.coursedescription = coursedescription
      ? coursedescription
      : course.coursedescription;
    course.coursefeature = coursefeature ? coursefeature : course.coursefeature;

    course.images = reciepts.length > 0 ? reciepts : course.images;

    await course.save();

    await res.status(201).json({
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.toString()
    });
  }
};

const allCourses = async (req, res) => {
  try {
    const allCourses = await Course.find();
    if (allCourses) {
      console.log("allCourses", allCourses);
      res.status(201).json({
        allCourses
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const groupedCourses = async (req, res) => {
  try {
    const categoryCourses = await Course.aggregate([
      {
        $group: {
          _id: { coursecategory: "$coursecategory" },
          groupedata: {
            $push: {
              coursetitle: "$coursetitle",
              coursecategory: "$coursecategory",
              createdAt: "$createdAt",
              coursedescription: "$coursedescription",
              coursetitle: "$coursetitle",
              coursefeature: "$coursefeature",
              status: "$status",
              startingdate: "$startingdate",
              coursecode: "$coursecode",
              images: "$images",
              courseduraion: "$courseduraion"
            }
          }
        }
      }
    ]);
    console.log("categoryCourses", categoryCourses);
    if (categoryCourses) {
      console.log("categoryCourses", categoryCourses);
      res.status(201).json({
        categoryCourses
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
export {
  createCourse,
  courselogs,
  toggleActiveStatus,
  courseDetails,
  editCourse,
  allCourses,
  groupedCourses
};
