import Payment from "../models/PaymentModel";
import moment from "moment";
import Mongoose from "mongoose";
const userPaymentlogs = async (req, res) => {
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
  
      const payment = await Payment.paginate(
        {
          userid: Mongoose.mongo.ObjectId(req.query.userid),
          ...searchParam,
          ...type_filter,
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
        payment
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString()
      });
    }
  };

  const Paymentlogs = async (req, res) => {
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
      const status_filter = req.query.status ? { type: req.query.status } : {};
      const type_filter = req.query.type ? { type: req.query.type } : {};
      const courseid_filter = req.query.courseidfilter ? { courseid:Mongoose.mongo.ObjectId(req.query.courseidfilter) } : {};

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
  
      const payment = await Payment.paginate(
        {...courseid_filter,
          ...searchParam,
          ...type_filter,
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
        payment
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString()
      });
    }
  };

  
  const paymentDetails = async (req, res) => {
    try {
      console.log("req.params.id", req.params.id);
      const payment = await Payment.findById(req.params.id).populate({
        path: "courseid userid appointmentid",
        populate: {
          path: "coursecategory"
        }
      });
      await res.status(201).json({
        payment
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  export{userPaymentlogs,paymentDetails,Paymentlogs}