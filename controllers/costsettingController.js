import CostSetting from "../models/CostSettingModel";

const createCostSetting = async (req, res) => {
  const { audiocall, chat, videocall } = req.body;
  console.log("req.body", req.body);
  try {
    const costsetting = new CostSetting({
      audiocall,
      chat,
      videocall
    });
    console.log("costsetting", costsetting);

    const createdcostsetting = await costsetting.save();
    console.log("createdcostsetting", createdcostsetting);
    if (createdcostsetting) {
      res.status(201).json({
        createdcostsetting
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editCostSetting = async (req, res) => {
  const { audiocall, chat, videocall } = req.body;
  try {
    const costsetting = await CostSetting.findOne();
    console.log("costsetting", costsetting);
    costsetting.audiocall = audiocall ? audiocall : costsetting.audiocall;
    costsetting.chat = chat ? chat : costsetting.chat;
    costsetting.videocall = videocall ? videocall : costsetting.videocall;

    await costsetting.save();
    await res.status(201).json({
      message: "Cost Setting Updated Successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
export { createCostSetting, editCostSetting };
