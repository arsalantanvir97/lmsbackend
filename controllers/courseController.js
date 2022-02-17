import Category from "../models/CategoryModel";
import Course from "../models/CourseModel";
import Mongoose from "mongoose";
import Lecture from "../models/LectureModel";

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
    const cat = await Category.findOne({ _id: JSON.parse(coursecategory) });
    cat.coursecount=cat.coursecount+1
    const updatedcat=cat.save()
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
    const courseid_filter = req.query.courseidfilter ? { _id:Mongoose.mongo.ObjectId(req.query.courseidfilter) } : {};
    const categoryid_filter = req.query.categoryidfilter ? { coursecategory:Mongoose.mongo.ObjectId(req.query.categoryidfilter) } : {};

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
      {...courseid_filter,
        ...categoryid_filter,
         ...searchParam, ...status_filter, ...dateFilter },
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
      coursefeature,
      images
    } = req.body;
    let _reciepts = [];
    const reciepts = [];
    console.log('images111',images,typeof(images))
    let imagge=JSON.parse(images)
    console.log('imageeeeeess',imagge)
    _reciepts = req.files.reciepts;
    console.log("req.bopdy", req.body);
    console.log("block1");
    _reciepts && _reciepts.forEach((img) => reciepts.push(img.path));
    console.log('receiptsss',_reciepts)
    imagge && imagge.map(imgg=>{console.log('imgg',imgg)
       reciepts.push(imgg)})
    console.log("block2",reciepts);

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
const allCoursesandCategories = async (req, res) => {
  try {
    const allCourses = await Course.find();
    const allLectures = await Lecture.find();
    const allCategories = await Category.find();

      console.log("allCourses", allCourses);
      res.status(201).json({
        allCourses,allLectures,allCategories
      });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const groupedCourses = async (req, res) => {
  try {
    let categoryCourses = await Course.aggregate([
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
              courseduraion: "$courseduraion",
              _id: "$_id"
            }
          }
        }
      }
    ]);

    await Promise.all(
      categoryCourses.map(async (coures) => {
        coures.category = await Category.findById(coures._id.coursecategory);
      })
    );

    res.status(201).json({
      categoryCourses
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const filterCoursebyText = async (req, res) => {
  const {searchString
} = req.body;
console.log('req.body',searchString,typeof(searchString));
  try {
    const filteredCourse = await Course.find({coursetitle: {$regex: searchString, "$options": "i"}})
    console.log('filteredCourseeeee',filteredCourse);
    if (filteredCourse) { 
      console.log("filteredCourse", filteredCourse);
      res.status(201).json({
        filteredCourse
      });
    }
  } catch (err) {
    console.log('err',err);
    res.status(500).json({
      message: err.toString()
    });
  }
};


const categoryfiltergroupedCourses = async (req, res) => {
  try {
    console.log("req.params.id ", req.params.id);
    let categoryCourses = await Course.aggregate([
      { $match: { coursecategory:  Mongoose.mongo.ObjectId(req.params.id) } },
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
              courseduraion: "$courseduraion",
              _id: "$_id"
            }
          }
        }
      }
    ]);
    console.log("categoryCourses", categoryCourses);
    await Promise.all(
      categoryCourses.map(async (coures) => {
        coures.category = await Category.findById(coures._id.coursecategory);
      })
    );
    res.status(201).json({
      categoryCourses
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const courseByCategory = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const course = await Course.find({coursecategory:req.params.id}).populate(
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

export {
  createCourse,
  courselogs,
  toggleActiveStatus,
  courseDetails,
  editCourse,
  courseByCategory,
  allCourses,
  groupedCourses,
  categoryfiltergroupedCourses,
  filterCoursebyText,
  allCoursesandCategories
};
