import asyncHandler from "express-async-handler";

import Admin from "../models/AdminModel.js";
import User from "../models/UserModel";
import Course from "../models/CourseModel";
import Appointement from "../models/AppointementModel";
import SubscriptionPackage from "../models/SubscriptionPackageModel";

import Reset from "../models/ResetModel.js";

import moment from "moment";
import generateToken from "../utills/generateJWTtoken";
import generateEmail from "../services/generate_email";
import generateCode from "../services/generate_code";

import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";
import { addSoaUser } from "../services/SoaChat.js";
import { CREATE_VOX_USER } from "../services/VoxImplant.js";

const registerAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;

  const AdminExists = await Admin.findOne({ email });

  if (AdminExists) {
    return res.status(401).json({
      error: "Admin already exist"
    });
  }

  const admin = await Admin.create({
    fullName,
    email,
    password
  });

  if (admin) {
    await CREATE_VOX_USER(admin.fullName, admin.password,admin._id);

    res.status(201).json({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,

      token: generateToken(admin._id)
    });
  } else {
    return res.status(401).json({
      error: "false"
    });
  }
};

const authAdmin = asyncHandler(async (req, res) => {
  console.log("authAdmin");
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
   await addSoaUser(admin._id,admin.fullName)
    res.json({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      userImage: admin.userImage,

      token: generateToken(admin._id)
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
  const { email } = req.body;
  console.log("req.body", req.body);
  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.log("!admin");
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
      const updatedadmin = await Admin.findOne({ email });
      updatedadmin.password = password;
      await updatedadmin.save();
      console.log("updatedadmin", updatedadmin);
      res.status(201).json({
        _id: updatedadmin._id,
        fullName: updatedadmin.fullName,
        userImage: updatedadmin.userImage,
        email: updatedadmin.email,
        token: generateToken(updatedadmin._id)
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

const verifyAndREsetPassword = async (req, res) => {
  try {
    console.log("reset");

    const { existingpassword, newpassword, confirm_password, email } = req.body;

    console.log("req.body", req.body);
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(existingpassword))) {
      console.log("block1");
      if (!comparePassword(newpassword, confirm_password)) {
        console.log("block2");
        return res.status(400).json({ message: "Password does not match" });
      } else {
        console.log("block3");
        admin.password = newpassword;
        await admin.save();
        console.log("admin", admin);
        res.status(201).json({
          _id: admin._id,
          fullName: admin.fullName,
          userImage: admin.userImage,
          email: admin.email,
          token: generateToken(admin._id)
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

const editProfile = async (req, res) => {
  const { fullName, email } = req.body;
  // console.log("req.body", req.body);
  console.log("req.body.fullName", req.body.fullName);

  let user_image =
    req.files &&
    req.files.user_image &&
    req.files.user_image[0] &&
    req.files.user_image[0].path;
  console.log("user_image", user_image);
  const admin = await Admin.findOne({ email });
  console.log("admin", admin);
  admin.fullName = fullName;
  admin.userImage = user_image ? user_image : admin.userImage;
  await admin.save();
  // await res.status(201).json({
  //   message: "Admin Update",
  //   admin,
  // });
  await res.status(201).json({
    _id: admin._id,
    fullName: admin.fullName,
    email: admin.email,
    userImage: admin.userImage,
    token: generateToken(admin._id)
  });
};

const getCountofallCollection = async (req, res) => {
  try {
    console.log("getCountofallCollection", req);
    const { year1 } = req.query;
    const yearuser = req.query.year1 ? req.query.year1 : [];

    console.log("year1", year1);
    const arr1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const start_date1 = moment(yearuser).startOf("year").toDate();
    const end_date1 = moment(yearuser).endOf("year").toDate();

    const query = [
      {
        $match: {
          createdAt: {
            $gte: start_date1,
            $lte: end_date1
          }
        }
      },
      {
        $addFields: {
          date: {
            $month: "$createdAt"
          }
        }
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      },
      {
        $project: {
          _id: 0,
          month: 1,
          count: 1
        }
      }
    ];

    const [usercount, coursecount, appointmentcount, salesCount] =
      await Promise.all([
        User.count(),
        Course.count(),
        Appointement.count(),
        SubscriptionPackage.aggregate(query)
      ]);
    console.log("salesCount", salesCount);
    salesCount.forEach((data) => {
      if (data) arr1[data.month - 1] = data.count;
    });

    await res.status(201).json({
      usercount,
      coursecount,
      appointmentcount,

      graph_data: arr1
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  registerAdmin,
  authAdmin,
  recoverPassword,
  verifyRecoverCode,
  resetPassword,
  verifyAndREsetPassword,
  editProfile,
  getCountofallCollection
};
