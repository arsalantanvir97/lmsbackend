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
    const lecture = await Lecture.findById(req.params.id).populate({
      path:"courseid",
      populate :{
        path : "coursecategory"
      }
      

    });
    await res.status(201).json({
      lecture
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const editLecture = async (req, res) => {
  const { id, courseid, lecturecode, lecturetitle, videoduration } = req.body;
  console.log("req.body", req.body);
  let ad_video =
    req.files &&
    req.files.ad_video &&
    req.files.ad_video[0] &&
    req.files.ad_video[0].path;
  console.log("ad_video", ad_video);
  const lecture = await Lecture.findOne({ _id: id });
  console.log("lecture", lecture);
  lecture.courseid = courseid ? JSON.parse(courseid) : lecture.courseid;
  lecture.lecturecode = lecturecode ? lecturecode : lecture.lecturecode;
  lecture.lecturetitle = lecturetitle ? lecturetitle : lecture.lecturetitle;
  lecture.videoduration = videoduration ? videoduration : lecture.videoduration;
  lecture.ad_video = ad_video ? ad_video : lecture.ad_video;
  await lecture.save();
  await res.status(201).json({
    lecture
  });
};
const deleteLecture = async (req, res) => {
  try {
    await Lecture.findByIdAndRemove(req.params.id).populate("courseid");
    return res.status(201).json({ message: "Lectrue Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const allLectures = async (req, res) => {
  try {
    const allLectures = await Lecture.find();
    if (allLectures) {
      console.log("allLectures", allLectures);
      res.status(201).json({
        allLectures
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createLecture,
  lecturelogs,
  lectureDetails,
  editLecture,
  deleteLecture,
  allLectures
};
