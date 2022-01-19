import Mongoose from "mongoose";
import Quiz from "../models/QuizModel.js";

const createQuiz = async (req, res) => {
  const {
    courseid,
    lectureid,
    quizinfo,
    passingmarks,
    totalmarks,
    quizduration,
    startingdate
  } = req.body;
  console.log("req.body", req.body);
  try {
    const quiz = new Quiz({
      courseid: JSON.parse(courseid),
      lectureid: JSON.parse(lectureid),
      quizinfo,
      passingmarks,
      totalmarks,
      quizduration,
      startingdate,
      quizinfo: quizinfo
    });
    console.log("quiz", quiz);

    const createdquiz = await quiz.save();
    console.log("createdquiz", createdquiz);
    if (createdquiz) {
      res.status(201).json({
        createdquiz
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const quizlogs = async (req, res) => {
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

    const quiz = await Quiz.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid lectureid"
      }
    );
    await res.status(200).json({
      quiz
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editQuiz = async (req, res) => {
  const {
    id,
    courseid,
    lectureid,
    quizinfo,
    passingmarks,
    totalmarks,
    quizduration,
    startingdate
  } = req.body;
  console.log("req.body", req.body);

  const quiz = await Quiz.findOne({ _id: id });
  console.log("quiz", quiz);
  quiz.courseid = courseid ? courseid : quiz.courseid;
  console.log("block1");
  quiz.lectureid = lectureid ? lectureid : quiz.lectureid;
  console.log("block2");

  quiz.quizinfo = quizinfo ? quizinfo : quiz.quizinfo;
  console.log("block3");

  quiz.passingmarks = passingmarks ? passingmarks : quiz.passingmarks;
  console.log("block4");

  quiz.totalmarks = totalmarks ? totalmarks : quiz.totalmarks;
  console.log("block5");

  quiz.quizduration = quizduration ? quizduration : quiz.quizduration;
  console.log("block6");

  quiz.startingdate = startingdate ? startingdate : quiz.startingdate;
  console.log("block7");

  quiz.quizinfo = quizinfo ? quizinfo : quiz.quizinfo;

  await quiz.save();
  await res.status(201).json({
    quiz
  });
};

const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndRemove(req.params.id);
    return res.status(201).json({ message: "Quiz Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const quizDetails = async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    const quiz = await Quiz.findById(req.params.id).populate(
      "userid courseid lectureid"
    );
    await res.status(201).json({
      quiz
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const quizzCourseid = async (req, res) => {
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
    console.log("req.params.id", req.params.id);

    const quiz = await Quiz.paginate(
      {
        courseid: Mongoose.mongo.ObjectId(req.params.id),
        ...searchParam,
        ...status_filter,
        ...dateFilter
      },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "userid courseid lectureid"
      }
    );
    await res.status(200).json({
      quiz
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createQuiz,
  deleteQuiz,
  quizlogs,
  editQuiz,
  quizDetails,
  quizzCourseid
};
