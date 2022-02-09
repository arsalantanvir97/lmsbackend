import registeredCourse from "../models/registeredCoursesModel";

const ExpiryDateSingle = async (data) => {
  try {
    var now = new Date();
  
     
          if (now > data.expirydate) {
            console.log("ExpiryDate2insideblock");
            await registeredCourse
              .findByIdAndUpdate(
                { _id: data._id },
                { expired: true },
                { new: true, upsert: true }
              )
              .exec();
          }
       
   
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

export default ExpiryDateSingle;
