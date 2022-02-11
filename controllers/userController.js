import User from "../models/UserModel.js";
import Reset from "../models/ResetModel";
import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";
import CreateNotification from "../utills/notification.js";
import moment from "moment";
import asyncHandler from "express-async-handler";
import generateCode from "../services/generate_code.js";
import lodash from "lodash";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";
import { addSoaUser } from "../services/SoaChat.js";
import { CREATE_VOX_USER } from "../services/VoxImplant.js";
import { v4 as uuidv4 } from "uuid";
import RegisteredCourse from "../models/registeredCoursesModel.js";
import Payment from "../models/PaymentModel.js";
import Subscription from "../models/SubscriptionModel";

import Course from "../models/CourseModel.js";
import Mongoose from "mongoose";

const registerUser = async (req, res) => {
  const { username, confirmpassword, email, password, type } = req.body;
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("req.body", req.body);
  if (!comparePassword(password, confirmpassword))
    return res.status(401).json({ error: "Password does not match" });
  const UserExists = await User.findOne({ email });

  if (UserExists) {
    return res.status(401).json({
      error: "User already exist"
    });
  }

  const user = await User.create({
    username,
    password,
    email,
    type,
    userImage: user_image
  });
  console.log("user", user);
  if (user) {
    const idempotency_key = uuidv4();

    await CREATE_VOX_USER(user.username, user.password, idempotency_key);
    user.voxusername = idempotency_key;
    user.mrno = user._id;
    const notification = {
      notifiableId: null,
      notificationType: "User",
      title: `${type} Created`,
      body: `A ${type} name ${username} has registered`,
      payload: {
        type: "USER",
        id: user._id
      }
    };
    CreateNotification(notification);
    await user.save();
    await res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      voxusername: user.voxusername,
      enterprisesubscribed: user.enterprisesubscribed,
      subscriptiondetails: user.subscriptiondetails,

      type: user.type,
      userImage: user.userImage,
      token: generateToken(user._id),
      message: "Successfully created user!"
    });
  } else {
    return res.status(401).json({
      error: "false"
    });
  }
};
const registerEnterprise = async (req, res) => {
  const { username, confirmpassword, email, password, type } = req.body;
  console.log('registerEnterprise',req.body)
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("req.body", req.body);
  if (!comparePassword(password, confirmpassword))
    return res.status(401).json({ error: "Password does not match" });
  const UserExists = await User.findOne({ email });
console.log('block12')
  if (UserExists) {
    console.log('block14')

    return res.status(401).json({
      error: "User already exist"
    });
  }
  console.log('block13')

  const user = await User.create({
    username,
    password,
    email,
    type,
    userImage: user_image
  });
  console.log("user", user);
  if (user) {
    console.log('block15')

    const idempotency_key = uuidv4();
    console.log('block16')

  
    await CREATE_VOX_USER(user.username, user.password, idempotency_key);
    console.log('block17')

    user.voxusername = idempotency_key;
    user.mrno = user._id;
    const notification = {
      notifiableId: null,
      notificationType: "Admin",
      title: `${type} Created`,
      body: `A ${type} name ${username} has registered`,
      payload: {
        type: "USER",
        id: user._id
      }
    };
    console.log('block18')

    CreateNotification(notification);
    console.log('block19')

    await user.save();
    console.log('block20')

    await res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      voxusername: user.voxusername,
      enterprisesubscribed: user.enterprisesubscribed,
      subscriptiondetails: user.subscriptiondetails,

      type: user.type,
      userImage: user.userImage,
      token: generateToken(user._id),
      message: "Successfully created user!"
    });
  } else {
    return res.status(401).json({
      error: "false"
    });
  }
};
const registerEmployee = async (req, res) => {
  const {
    username,
    confirmpassword,
    email,
    password,
    type,
    enterpriseid,
    courseid
  } = req.body;
  console.log("req.body", req.body);
  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("req.body", req.body);
  if (!comparePassword(password, confirmpassword))
    return res.status(401).json({ error: "Password does not match" });
  const UserExists = await User.findOne({ email });

  if (UserExists) {
    return res.status(401).json({
      error: "User already exist"
    });
  }
  const user = await User.create({
    username,
    password,
    email,
    type,
    enterpriseid,
    userImage: user_image
  });

  console.log("user", user);
  if (user) {
    const course = await RegisteredCourse.findOne({ _id: courseid });
    console.log("coursecoursecourse", course, course.courseid._id);
    const registeredcourses = await new RegisteredCourse({
      userid: user._id,
      courseid: course.courseid._id,
      duration: course.duration,
      enterpriseid: enterpriseid,
      cost: course.cost
    });
    console.log("registeredcourses", registeredcourses);
    registeredcourses.expirydate = moment(registeredcourses.createdAt).add(
      course.duration,
      "M"
    );
    const createdregisteredcourses = await registeredcourses.save();
    const payment = new Payment({
      courseid: course.courseid._id,
      userid: user._id,
      duration: course.duration,
      type: "Purchased Course",
      cost: Number(course.cost),
      expirydate: registeredcourses.expirydate
    });
    console.log("payment", payment);
    const createdpayment = await payment.save();
    const courseee=await Course.findOne({_id:course.courseid._id})
    courseee.studentcount=courseee.studentcount+1
    const updatedcourse=await courseee.save()
    const idempotency_key = uuidv4();

    await CREATE_VOX_USER(user.username, user.password, idempotency_key);
    user.voxusername = idempotency_key;
    user.mrno = user._id;
    const notification = {
      notifiableId: null,
      notificationType: "Enterprise",
      title: `Employee Registered`,
      body: `A user named ${username} has registered on our portal which you added as employee`,
      payload: {
        type: "USER",
        id: user._id
      }
    };

    CreateNotification(notification);
    await user.save();
    await res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      voxusername: user.voxusername,
      enterprisesubscribed: user.enterprisesubscribed,
      subscriptiondetails: user.subscriptiondetails,

      type: user.type,
      userImage: user.userImage,
      token: generateToken(user._id),
      message: "Successfully created user!"
    });
  } else {
    return res.status(401).json({
      error: "false"
    });
  }
};

const authUser = asyncHandler(async (req, res) => {
  console.log("authAdmin", req.body);
  const { email, password, confirmpassword, type } = req.body;

  if (!comparePassword(password, confirmpassword))
    return res.status(201).json({ message: "Password does not match" });
  const user = await User.findOne({ email, type });
  if (user && (await user.matchPassword(password))) {
    await addSoaUser(user._id, user.username);
    await res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      voxusername: user.voxusername,
      enterprisesubscribed: user.enterprisesubscribed,
      subscriptiondetails: user.subscriptiondetails,
      enterpriseid: user.enterpriseid,
      type: user.type,
      userImage: user.userImage,
      token: generateToken(user._id)
    });
  } else {
    console.log("error");
    return res.status(201).json({
      message: "Invalid Email or Password"
    });
  }
});
const recoverPassword = async (req, res) => {
  console.log("recoverPassword");
  const { email, type } = req.body;
  console.log("req.body", req.body);
  const user = await User.findOne({ email, type });
  if (!user) {
    console.log("!user");
    return res.status(401).json({
      message: "Invalid Email or Password"
    });
  } else {
    const status = generateCode();
    await createResetToken(email, status);

    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
          \n\n Your verification status is ${status}:\n\n
          \n\n If you did not request this, please ignore this email and your password will remain unchanged.           
          </p>`;
    await generateEmail(email, "LMS - Password Reset", html);
    return res.status(201).json({
      message:
        "Recovery status Has Been Emailed To Your Registered Email Address"
    });
  }
};
const verifyRecoverCode = async (req, res) => {
  const { code, email } = req.body;
  console.log("req.body", req.body);
  const reset = await Reset.findOne({ email, code });

  if (reset)
    return res.status(200).json({ message: "Recovery status Accepted" });
  else {
    return res.status(400).json({ message: "Invalid Code" });
  }
  // console.log("reset", reset);
};
const resetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { password, confirm_password, code, email } = req.body;
    console.log("req.body", req.body);
    if (!comparePassword(password, confirm_password))
      return res.status(400).json({ message: "Password does not match" });
    const reset = await Reset.findOne({ email, code });
    console.log("reset", reset);
    if (!reset)
      return res.status(400).json({ message: "Invalid Recovery status" });
    else {
      console.log("resetexist");
      const updateduser = await User.findOne({ email });
      updateduser.password = password;
      await updateduser.save();
      console.log("updateduser", updateduser);
      res.status(201).json({
        _id: updateduser._id,
        username: updateduser.username,
        email: updateduser.email,
        enterpriseid: updateduser.enterpriseid,

        voxusername: updateduser.voxusername,
        enterprisesubscribed: updateduser.enterprisesubscribed,
        subscriptiondetails: updateduser.subscriptiondetails,
        type: updateduser.type,
        userImage: updateduser.userImage,
        token: generateToken(updateduser._id)
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
};

const editProfile = async (req, res) => {
  const { username, email } = req.body;
  // console.log("req.body", req.body);
  console.log("req.body.fullName", req.body.fullName);

  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("user_image", user_image);
  const user = await User.findOne({ email });
  console.log("user", user);
  user.username = username;
  user.userImage = user_image ? user_image : user.userImage;
  await user.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    voxusername: user.voxusername,
    enterprisesubscribed: user.enterprisesubscribed,
    subscriptiondetails: user.subscriptiondetails,
    enterpriseid: user.enterpriseid,

    type: user.type,
    userImage: user.userImage,
    token: generateToken(user._id)
  });
};
const verifyAndREsetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { existingpassword, newpassword, confirm_password, email } = req.body;

    console.log("req.body", req.body);
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(existingpassword))) {
      console.log("block1");
      if (!comparePassword(newpassword, confirm_password)) {
        console.log("block2");
        return res.status(400).json({ message: "Password does not match" });
      } else {
        console.log("block3");
        user.password = newpassword;
        await user.save();
        console.log("user", user);
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          voxusername: user.voxusername,
          enterprisesubscribed: user.enterprisesubscribed,
          subscriptiondetails: user.subscriptiondetails,
          enterpriseid: user.enterpriseid,

          type: user.type,
          userImage: user.userImage,
          token: generateToken(user._id)
        });
      }
    } else {
      console.log("block4");

      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error.toString() });
  }

  // return updatedadmin
  // await res.status(201).json({
  //   message: "Password Updated",
  // });
};
const userlogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              username: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            {
              email: { $regex: `${req.query.searchString}`, $options: "i" }
            }
          ]
        }
      : {};
    const status_filter = req.query.status ? { status: req.query.status } : {};
    const type_filter = req.query.type ? { type: req.query.type } : {};

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

    const users = await User.paginate(
      { ...type_filter, ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id"
      }
    );
    await res.status(200).json({
      users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const user = await User.findById(req.params.id);
    await res.status(201).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getEmployeeProfile = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const user = await User.findById(req.params.id);
    const course = await RegisteredCourse.find({
      userid: req.params.id
    }).populate({
      path: "courseid userid",
      populate: {
        path: "coursecategory"
      }
    });
    await res.status(201).json({
      user,
      course
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getEditEmployeeProfile = async (req, res) => {
  try {
    console.log(
      "req.params.id",
      req.params.enterpriseid,
      req.params.userid,
      req.query.enterpriseid,
      req.query.userid
    );

    const [user, course, course2] = await Promise.all([
      User.findById(req.params.id),
      RegisteredCourse.find({
        userid: { $eq: req.query.enterpriseid }
        
      }).populate({
        path: "courseid userid",
        populate: {
          path: "coursecategory"
        }
      }),
      RegisteredCourse.find({
        userid: { $eq: req.query.userid }
      }).populate({
        path: "courseid userid",
        populate: {
          path: "coursecategory"
        }
      })
    ]);
    //     let resultt=[]
    //     var result = course.filter(function (o1) {
    //       return !course2.some(function (o2) {
    //         console.log('outisde,',o1.courseid.coursetitle,o2.courseid.coursetitle);
    //           if(o1.courseid.coursetitle !== o2.courseid.coursetitle){
    // console.log('INSIDEBLOCK,',o1.courseid.coursetitle,o2.courseid.coursetitle);
    // resultt.push(o1)
    //           }
    //      });
    //   });

    // course = course.filter((coursse) => coursse);
    await res.status(201).json({
      user,
      course,
      course2
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const toggleActiveStatus = async (req, res) => {
  console.log("req.params.id", req.params.id);
  try {
    const user = await User.findById(req.params.id);
    console.log("user", user);
    user.status = user.status == true ? false : true;
    await user.save();
    await res.status(201).json({
      message: user.status ? "User Activated" : "User Inactivated"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const newsletterSubscription = async (req, res) => {
  console.log("req.params.id", req.params.id);
  try {
    const user = await User.findById(req.params.id);
    console.log("user", user);
    user.subscribed = user.subscribed == true ? false : true;
    await user.save();
    await res.status(201).json({
      message: user.status ? "User Subscribed" : "User unsubscribed"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getSubscribedUsers = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              email: { $regex: `${req.query.searchString}`, $options: "i" }
            }
          ]
        }
      : {};
    const type_filter = req.query.status
      ? { subscribed: req.query.status }
      : {};
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

    const users = await User.paginate(
      { ...type_filter, ...searchParam, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id"
      }
    );
    await res.status(200).json({
      users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getLatestUsers = async (req, res) => {
  try {
    const user = await User.find().sort({ $natural: -1 }).limit(5);

    await res.status(201).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const enterpriseSubscription = async (req, res) => {
  try {
    const { id, subscriptiondetails } = req.body;

    const user = await User.findById({ _id: id });
    console.log("user", user);
    user.subscriptiondetails = subscriptiondetails;
    user.enterprisesubscribed = true;
    user.subscribed=true

    await user.save();

    const subscriptionnn = new Subscription({
      subscriptionname: subscriptiondetails.subscriptionname,
      userid: user._id,

      subscriptionprice: Number(subscriptiondetails.subscriptionprice)
    });
    console.log("subscriptionnn", subscriptionnn);
    const createdsubscriptionnn = await subscriptionnn.save();

    await res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      voxusername: user.voxusername,
      enterprisesubscribed: user.enterprisesubscribed,
      subscriptiondetails: user.subscriptiondetails,
      enterpriseid: user.enterpriseid,

      type: user.type,
      userImage: user.userImage,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.log("errrrrrrrr", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const addingEmployee = async (req, res) => {
  console.log("recoverPassword");
  const { id, enterprisename, name, email, courseid } = req.body;
  console.log("req.body", req.body, courseid);

  const html = `<p>You are receiving this because you have been added by an Enterprise named ${enterprisename} on LMS portal.
          \n\n If you want to register on LMS portal visit the link below.            
          \n\n <br/> https://dev74.onlinetestingserver.com/LMS/user/EmployeeSignup/${id}/${courseid}
          </p>`;
  await generateEmail(email, "LMS - Enterprise Invitation", html);
  const notification = {
    notifiableId: null,
    notificationType: "Admin",
    title: `Employee Added`,
    body: `An Enterprise named ${enterprisename} just added ${name} to the portal`,
    payload: {
      type: "USER",
      id: id
    }
  };
  CreateNotification(notification);
  return res.status(201).json({
    message: "Invitation Status Has Been Emailed To Given Email Address"
  });
};

const generateCertificate = async (req, res) => {
  console.log("generateCertificate");
  const { email, reg } = req.body;
  console.log("req.body", req.body);
  const html = `<body>

  <table width="600" border="0" cellspacing="0" cellpadding="0" class="email-body" style="border:2px solid #b78b40">
    <tbody>
      
      <tr>
        <td width="80"></td>
        <td align="center">
          <table width="100%" border="0">
    <tbody>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td align="center"><img src="cid:logo1" width="250"></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
         <td align="center" style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 14px; color: #000;">Congratulations on Completing Course ${
           reg.courseid.coursetitle
         }</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td align="center" style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 40px; color: #b78b40; font-style: italic;">
      <em>${reg.userid.username}</em>
      </td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
    
      
      <tr>
        <td align="center">
        <table width="80%" border="0">
    <tbody>
      <tr>
        <td align="center">
        <table width="100%" border="0">
  
  </table>
  
      
      </td>
        <td width="40">&nbsp;</td>
        <td><table width="100%" border="0">
    <tbody>
      
      
    
    </tbody>
  </table></td>
      </tr>
    </tbody>
  </table>
  
      </td>
      </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
      <tr>
      <td align="center" style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 14px; color: #000;">${
        reg.userid.username
      } you completed the course on ${moment
    .utc(reg.completionDate)
    .format("LL")}</td>
   </tr>
      <tr>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  </table>
  
        </td>
        <td width="80"></td>
      </tr>
      
   </tbody>
  </table>
  
  
  
  
  </body>`;
  await generateEmail(
    reg.userid.email,
    "LMS - Certificate of Completion of Course",
    html
  );
  const registeredCurse = await RegisteredCourse.findOne({ _id: reg._id });
  console.log('registeredCurse',registeredCurse)
  registeredCurse.certificategenerated = true;
  const updatedregisteredCurse = await registeredCurse.save();
  return res.status(201).json({
    message: "Certificate Has Been Emailed To Given Email Address"
  });
};

// \n\n <br/> https://dev74.onlinetestingserver.com/LMS/user/EnterpriseSignup/${id}/${courseid}

const enterpriseemployeelogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? {
          $or: [
            {
              username: { $regex: `${req.query.searchString}`, $options: "i" }
            },
            {
              email: { $regex: `${req.query.searchString}`, $options: "i" }
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
    console.log("req.params.id", req.params.id);
    const users = await User.paginate(
      {
        enterpriseid: req.params.id,
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id"
      }
    );
    await res.status(200).json({
      users
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editEmployee = async (req, res) => {
  const { id, name, selected, enterpriseid, alreadyregistered } = req.body;
  console.log("selected", selected, alreadyregistered);
  try {
    const user = await User.findOne({ _id: id });
    user.username = name;
    await user.save();

    // var result =
    //   selected.length > 0 &&
    //   selected.filter(function (o1) {
    //     return (
    //       alreadyregistered.length > 0 &&
    //       !alreadyregistered.some(function (o2) {
    //         console.log(
    //           "outisde,",
    //           o1.value.courseid.coursetitle,
    //           o2.courseid.coursetitle
    //         );
    //         if (o1.value.courseid.coursetitle !== o2.courseid.coursetitle) {
    //           console.log(
    //             "INSIDEBLOCK,",
    //             o1.value.courseid.coursetitle,
    //             o2.courseid.coursetitle
    //           );
    //           coursetobeRegistered.push(o1);
    //         } else if (
    //           o1.value.courseid.coursetitle == o2.courseid.coursetitle
    //         ) {
    //           console.log(
    //             "matchedblock",
    //             o1.value.courseid.coursetitle,
    //             o2.courseid.coursetitle
    //           );
    //           courseregisteredalready.push(o1);
    //         }
    //       })
    //     );
    //   });
    let coursetobeRegistered;
    let courseregisteredalready;
    coursetobeRegistered = selected.filter(function (sel) {
      return !alreadyregistered.find(function (alre) {
        return sel.value.courseid.coursetitle == alre.courseid.coursetitle;
      });
    });
    courseregisteredalready = selected.filter(function (sel) {
      return alreadyregistered.find(function (alre) {
        return sel.value.courseid.coursetitle == alre.courseid.coursetitle;
      });
    });
    console.log("coursetobeRegistered", coursetobeRegistered);
    console.log("courseregisteredalready", courseregisteredalready);

    if (courseregisteredalready.length == 0) {
      console.log("removeeeeeeeeeeee");
      await RegisteredCourse.deleteMany({ userid: id });
      await Payment.deleteMany({ userid: id });
    }
    if (coursetobeRegistered.length > 0) {
      await Promise.all(
        coursetobeRegistered.length > 0 &&
          coursetobeRegistered.map(async (coures) => {
            const registeredcourses = await new RegisteredCourse({
              userid: id,
              enterpriseid,
              courseid: coures.value.courseid._id,
              duration: coures.value.duration,
              cost: coures.value.cost
            });
            console.log("registeredcourses", registeredcourses);
            registeredcourses.expirydate = moment(
              registeredcourses.createdAt
            ).add(coures.value.duration, "M");
            const createdregisteredcourses = await registeredcourses.save();
            const payment = new Payment({
              courseid: coures.value.courseid._id,
              userid: id,
              type: "Purchased Course",
              duration: coures.value.duration,
              cost: Number(coures.value.cost),
              expirydate: registeredcourses.expirydate
            });
            console.log("payment", payment);
            const createdpayment = await payment.save();
            const course=await Course.findOne({_id:course.coures.value.courseid._id})
            course.studentcount=course.studentcount+1
            const updatedcourse=await course.save()
          })
      );
    }
    // await Promise.all(
    //   selected.length > 0 &&
    //     selected.map(async (coures) => {
    //       // console.log('couresssssssssssssss',coures,coures.userid,coures.courseid);
    //       alreadyregistered.push(
    //         await RegisteredCourse.findOne({
    //           userid: coures.value.userid._id,
    //           courseid: coures.value.courseid._id
    //         }).populate({
    //           path: "courseid userid",
    //           populate: {
    //             path: "coursecategory"
    //           }
    //         })
    //       );
    //       console.log("alreadyregistered", alreadyregistered);
    //     })
    // );
    await res.status(201).json({
      user
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getcount = async (req, res) => {
  try {
    const [user, course] = await Promise.all([User.count(), Course.count()]);

    await res.status(201).json({
      user,
      course
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
export {
  registerUser,
  recoverPassword,
  userlogs,
  getProfile,
  toggleActiveStatus,
  newsletterSubscription,
  getSubscribedUsers,
  getLatestUsers,
  authUser,
  verifyRecoverCode,
  resetPassword,
  editProfile,
  verifyAndREsetPassword,
  registerEnterprise,
  enterpriseSubscription,
  addingEmployee,
  registerEmployee,
  enterpriseemployeelogs,
  getEmployeeProfile,
  getEditEmployeeProfile,
  editEmployee,
  getcount,
  generateCertificate
};
