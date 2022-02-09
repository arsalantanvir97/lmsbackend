import registeredCourse from "../models/registeredCoursesModel";

const ExpiryDate = async (data) => {
  try {
    var now = new Date();
    await Promise.all(
      data.length > 0 &&
        data.map(async (dat) => {
            console.log('now > dat.expirydate',now , dat.expirydate)
          if (now > dat.expirydate) {
            console.log("ExpiryDateinsideblock");
            await registeredCourse
              .findByIdAndUpdate(
                { _id: dat._id },
                { expired: true },
                { new: true, upsert: true }
              )
              .exec();
          }
        })
    );
    // const adManagement = await AdmanagementModel.updateMany(
    //   { createdAt: { $lte: now } },
    //   { $set: { expirydate: true ,status:'Expired'} },
    //   { multi: true }
    // ).exec();
    console.log("data", data);
    console.log("ExpiryDate");
  } catch (err) {
    console.log("err in ExpiryDate: ", err);
    return true;
  }
};

export default ExpiryDate;
