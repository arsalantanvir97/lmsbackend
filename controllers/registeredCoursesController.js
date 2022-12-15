import moment from "moment";
import RegisteredCourse from "../models/registeredCoursesModel";
import Payment from "../models/PaymentModel";

import Mongoose from "mongoose";
import ExpiryDate from "../utills/ExpiryDate";
import ExpiryDateSingle from "../utills/ExpiryDateSingle";
import Course from "../models/CourseModel";

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
    registeredcourses.expirydate = moment(registeredcourses.createdAt).add(
      duration,
      "M"
    );
    const createdregisteredcourses = await registeredcourses.save();
    const payment = new Payment({
      courseid,
      userid,
      type: "Purchased Course",
      duration:duration,
      cost: Number(cost),
      expirydate:registeredcourses.expirydate
    });
    console.log("payment", payment);
    const createdpayment = await payment.save();
    console.log("createdregisteredcourses", createdregisteredcourses);
    if (createdregisteredcourses) {
      const course=await Course.findOne({_id:courseid})
      course.studentcount=course.studentcount+1
      const updatedcourse=await course.save()
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
const userRegisteredcourseslogs = async (req, res) => {
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

      console.log('userid,',req.query.userid)
    const registeredcourses = await RegisteredCourse.paginate(
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
        populate: "userid courseid"
      }
    );
    console.log('first',registeredcourses)
    ExpiryDate(registeredcourses.docs)
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
const userRegisteredcourseslogsforcertificate = async (req, res) => {
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

      console.log('userid,',req.query.userid)
    const registeredcourses = await RegisteredCourse.paginate(
      {
        userid: Mongoose.mongo.ObjectId(req.query.userid),
        certificate:true,
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
      registeredcourses
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const enterpriseRegisteredcourseslogsofemployee = async (req, res) => {
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
console.log('enterpriseid',req.query.enterpriseid)
    const registeredcourses = await RegisteredCourse.paginate(
      {
        enterpriseid:req.query.enterpriseid,
        certificate:true,
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
    const registeredCourse = await RegisteredCourse.findOne({
      courseid: req.params.id,userid:req.query.userid
    }) .populate({
      path:"courseid userid",
      populate :{
        path : "coursecategory"
      }
      

    });
    await ExpiryDateSingle(registeredCourse)
    await res.status(201).json({
      registeredCourse
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const registeredcoursesDetailsby_id = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const registeredCourse = await RegisteredCourse.findOne({
      _id: req.params.id
    }) .populate({
      path:"courseid userid",
      populate :{
        path : "coursecategory"
      }
      

    });
    await res.status(201).json({
      registeredCourse
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const updateRegisteredCourse = async (req, res) => {
  console.log('updateRegisteredCourse');
  try {
    console.log("req.params.id", req.params.id,req.query.userid);
    const registeredCourse = await RegisteredCourse.findOne({
      courseid: req.params.id,userid:req.query.userid
    })
    console.log('registeredCourse',registeredCourse);
    registeredCourse.certificate=true
    registeredCourse.completionDate=new Date()

    const updatedregisteredcourse=await registeredCourse.save()
    await res.status(201).json({
      updatedregisteredcourse
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
// const updateRegisteredCourseFail = async (req, res) => {
//   try {
//     console.log("req.params.id", req.params.id,req.query.userid);
//     const registeredCourse = await RegisteredCourse.findOne({
//       courseid: req.params.id,userid:req.query.userid
//     })
//     console.log('registeredCourseFail',registeredCourse);

//     registeredCourse.certificate=false
//     registeredCourse.completionDate=''

//     const updatedregisteredcourse=await registeredCourse.save()
//     await res.status(201).json({
//       updatedregisteredcourse
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.toString()
//     });
//   }
// };




const getallResgisteredCoursesofUser = async (req, res) => {
  // console.log('getallNotification')
  const { id } = req.body;
  console.log("req.body", req.body);
  try {
    const registeredcourses = await RegisteredCourse.find({
      userid: id
    }).populate("userid courseid");

    // console.log('notification',notification)
    await res.status(201).json({
      registeredcourses
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getallResgisteredCoursesofUserNotExpired = async (req, res) => {
  // console.log('getallNotification')
  const { id } = req.body;
  console.log("req.body", req.body);
  try {
    const registeredcourses = await RegisteredCourse.find({
      userid: id,expired:false
    }).populate("userid courseid");

    // console.log('notification',notification)
    await res.status(201).json({
      registeredcourses
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const reregisterCourse = async (req, res) => {
  // console.log('getallNotification')
  const { id } = req.body;
  console.log("req.body", req.body);
  try {
    const registeredcourses = await RegisteredCourse.findOne({
      _id:id
    }).populate("userid courseid");
    registeredcourses.expired=false
    registeredcourses.createdAt=new Date()
   
    registeredcourses.expirydate = moment(
      registeredcourses.createdAt
    ).add(registeredcourses.duration, "M");
    console.log('registeredcourses.expirydate',registeredcourses.expirydate)
    const updateregisteredcourse2=await registeredcourses.save()
    console.log('updateregisteredcourse2',updateregisteredcourse2)
    const payment = new Payment({
      courseid: updateregisteredcourse2.courseid._id,
      userid: updateregisteredcourse2.userid._id,
      type: "Purchased Course",
      duration: updateregisteredcourse2.duration,
      cost: Number(updateregisteredcourse2.cost),
      expirydate: updateregisteredcourse2.expirydate
    });
    console.log("payment", payment);
    const createdpayment = await payment.save();
    await res.status(201).json({
      updateregisteredcourse2
    });
  } catch (err) {
    console.log('err',err)
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createregisteredCourses,
  registeredcourseslogs,
  registeredcoursesDetails,
  userRegisteredcourseslogs,
  getallResgisteredCoursesofUser,
  updateRegisteredCourse,
  // updateRegisteredCourseFail,
  registeredcoursesDetailsby_id,
  enterpriseRegisteredcourseslogsofemployee,
  userRegisteredcourseslogsforcertificate,
  reregisterCourse,
  getallResgisteredCoursesofUserNotExpired
};
