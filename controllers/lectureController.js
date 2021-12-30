import Lecture from "../models/LectureModel";

const createLecture = async (req, res) => {
  const { courseid, lecturecode, lecturetitle, videoduration } = req.body;
  let ad_video =
    req.files &&
    req.files.ad_video &&
    req.files.ad_video[0] &&
    req.files.ad_video[0].path;
  const lecture = await Lecture.create({
    courseid: JSON.parse(courseid),
    lecturecode,
    lecturetitle,
    videoduration,
    ad_video
  });
  if (lecture) {
    console.log("lecture", lecture);
    res.status(201).json({
      lecture
    });
  } else {
    res.status(400);
    throw new Error("Invalid lecture data");
  }
};
const lecturelogs = async (req, res) => {
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

    const lecture = await Lecture.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id",
        populate: "courseid courseid.coursecategory"
      }
    );
    await res.status(200).json({
      lecture
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};
const lectureDetails = async (req, res) => {
    try {
      console.log("req.params.id", req.params.id);
      const lecture = await Lecture.findById(req.params.id).populate(
        "courseid"
      );
      await res.status(201).json({
        lecture
      });
    } catch (err) {
      res.status(500).json({
        message: err.toString()
      });
    }
  };
  
export { createLecture, lecturelogs ,lectureDetails};
