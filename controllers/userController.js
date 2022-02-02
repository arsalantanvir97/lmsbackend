import User from "../models/UserModel.js";
import Reset from "../models/ResetModel";
import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";
import CreateNotification from "../utills/notification.js";
import moment from "moment";
import asyncHandler from "express-async-handler";
import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";
import { addSoaUser } from "../services/SoaChat.js";
import { CREATE_VOX_USER } from "../services/VoxImplant.js";
import { v4 as uuidv4 } from "uuid";

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
      notificationType: "Admin",
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
  console.log("req.body", req.body);

  const html = `<p>You are receiving this because you have been mailed by an Enterprise named ${enterprisename} on LMS portal.
          \n\n If you want to register on LMS portal visit the link below.            
          \n\n <br/> https://www.google.com/search?q=Invitation&sxsrf=APq-WBsDPS4pSWKQgVqK-RRVSfo7GgVqxw%3A1643812817544&ei=0Zf6YevYINKTlwTcpIKIBg&ved=0ahUKEwirhcT4n-H1AhXSyYUKHVySAGEQ4dUDCA4&uact=5&oq=Invitation&gs_lcp=Cgdnd3Mtd2l6EAMyBAgAEEcyBAgAEEcyBAgAEEcyBAgAEEcyBAgAEEcyBAgAEEcyBAgAEEcyBAgAEEdKBAhBGABKBAh
          </p>`;
  await generateEmail(email, "LMS - Enterprise Invitation", html);
  return res.status(201).json({
    message: "Invitation Status Has Been Emailed To Given Email Address"
  });
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
  addingEmployee
};
