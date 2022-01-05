import User from "../models/UserModel.js";
import generateToken from "../utills/generateJWTtoken.js";
import generateEmail from "../services/generate_email.js";
import CreateNotification from "../utills/notification.js";
import moment from "moment";
import generateCode from "../services/generate_code.js";
import {
  createResetToken,
  verifyPassword,
  comparePassword,
  generateHash
} from "../queries";

const registerUser = async (req, res) => {
  const { username, confirmpassword, email, password, type } = req.body;
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
    type
  });
  console.log("user", user);
  if (user) {
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

      type: user.type,

      token: generateToken(user._id),
      message: "Successfully created user!"
    });
  } else {
    return res.status(401).json({
      error: "false"
    });
  }
};

const userlogs = async (req, res) => {
  try {
    const searchParam = req.query.searchString
      ? // { $text: { $search: req.query.searchString } }

        {
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
      ? // { $text: { $search: req.query.searchString } }

        {
          $or: [
            {
              email: { $regex: `${req.query.searchString}`, $options: "i" }
            }
          ]
        }
      : {};
    // const status_filter = req.query.status ? { status: req.query.status } : {};
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
export {
  registerUser,
  userlogs,
  getProfile,
  toggleActiveStatus,
  newsletterSubscription,
  getSubscribedUsers
};
