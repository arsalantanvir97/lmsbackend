import NewsLetter from "../models/NewsLetterModel";
import generateEmail from "../services/generate_email";

const createNewsLetter = async (req, res) => {
  console.log("recoverPassword");
  const { email, msg, subject } = req.body;
  console.log("req.body", req.body);

  const html = msg;
  const newsletter = await NewsLetter.create({
    email,
    msg,
    subject
  });
  var emmail = email.join();
  await generateEmail(emmail, subject, html);
  return res.status(201).json({
    message: "Mail Has Been Emailed To Subscribed User's Email"
  });
};

const newsletterlogs = async (req, res) => {
  try {
    console.log("req.query.searchString", req.query.searchString);
    const searchParam = req.query.searchString
      ? {
          $or: [
            { subject: { $regex: `${req.query.searchString}`, $options: "i" } }
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

    const newsletter = await NewsLetter.paginate(
      {
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
      newsletter
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const getNewsLetterDetails = async (req, res) => {
  try {
    const newsletter = await NewsLetter.findById(req.params.id);
    await res.status(201).json({
      newsletter
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export { createNewsLetter, newsletterlogs, getNewsLetterDetails };
