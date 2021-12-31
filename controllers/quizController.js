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
      courseid: courseid,
      lectureid: lectureid,
      quizinfo,
      passingmarks,
      totalmarks,
      quizduration,
      startingdate,
      quizinfo:quizinfo
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

export { createQuiz };
