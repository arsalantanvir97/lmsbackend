import Notification from "../models/NotificationModel.js";

const getallNotification = async (req, res) => {
  // console.log('getallNotification')
    try {
      const notification = await Notification.find();
      // console.log('notification',notification)
      await res.status(201).json({
        notification,
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  const getAllNotificationlogs = async (req, res) => {
    try {
      console.log(
        "req.query.searchString",
        req.query.searchString,
        req.query.from
      );
      const searchParam = req.query.searchString
        ? { $text: { $search: req.query.searchString } }
        : {};
      const status_filter = req.query.status ? { status: req.query.status } : {};
      const from = req.query.from;
      const to = req.query.to;
      let dateFilter = {};
      if (from && to)
        dateFilter = {
          createdAt: {
            $gte: moment.utc(new Date(from)).startOf("day"),
            $lte: moment.utc(new Date(to)).endOf("day"),
          },
        };
      // console.log("dateFilter2", dateFilter);
      const notification = await Notification.paginate(
        {
          ...searchParam,
          ...status_filter,
          ...dateFilter,
        },
        {
          page: req.query.page,
          limit: req.query.perPage,
          lean: true,
          sort: "-_id",
        }
      );
      await res.status(200).json({
        notification,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  export{getallNotification,getAllNotificationlogs}