import SubscriptionSetting from "../models/SubscriptionSettingModel";

const createSubscriptionSetting = async (req, res) => {
  const {
    silvertitle,
    silverfee,
    silverdescription,
    goldtitle,
    goldfee,
    golddescription,
    platiniumtitle,
    platiniumfee,
    platiniumdescription
  } = req.body;
  console.log("req.body", req.body);
  try {
    const subscriptionsetting = new SubscriptionSetting({
      silvertitle,
      silverfee,
      silverdescription,
      goldtitle,
      goldfee,
      golddescription,
      platiniumtitle,
      platiniumfee,
      platiniumdescription
    });
    console.log("costsetting", subscriptionsetting);

    const createdsubscriptionsetting = await subscriptionsetting.save();
    console.log("createdsubscriptionsetting", createdsubscriptionsetting);
    if (createdsubscriptionsetting) {
      res.status(201).json({
        createdsubscriptionsetting
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const editSubscriptionSetting = async (req, res) => {
  const {
    silvertitle,
    silverfee,
    silverdescription,
    goldtitle,
    goldfee,
    golddescription,
    platiniumtitle,
    platiniumfee,
    platiniumdescription
  } = req.body;
  try {
    const subscriptionsetting = await SubscriptionSetting.findOne();
    console.log("subscriptionsetting", subscriptionsetting);
    subscriptionsetting.silvertitle = silvertitle
      ? silvertitle
      : subscriptionsetting.silvertitle;
    subscriptionsetting.silverfee = silverfee
      ? silverfee
      : subscriptionsetting.silverfee;
    subscriptionsetting.silverdescription = silverdescription
      ? silverdescription
      : subscriptionsetting.silverdescription;
    subscriptionsetting.goldtitle = goldtitle
      ? goldtitle
      : subscriptionsetting.goldtitle;
    subscriptionsetting.goldfee = goldfee
      ? goldfee
      : subscriptionsetting.goldfee;
    subscriptionsetting.golddescription = golddescription
      ? golddescription
      : subscriptionsetting.golddescription;
    subscriptionsetting.platiniumtitle = platiniumtitle
      ? platiniumtitle
      : subscriptionsetting.platiniumtitle;
    subscriptionsetting.platiniumfee = platiniumfee
      ? platiniumfee
      : subscriptionsetting.platiniumfee;
    subscriptionsetting.platiniumdescription = platiniumdescription
      ? platiniumdescription
      : subscriptionsetting.platiniumdescription;

    await subscriptionsetting.save();
    await res.status(201).json({
      message: "Subscription Setting Updated Successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const allSubscriptionSetting = async (req, res) => {
  try {
    const allSubscriptionSetting = await SubscriptionSetting.findOne();
    if (allSubscriptionSetting) {
      console.log("allSubscriptionSetting", allSubscriptionSetting);
      res.status(201).json({
        allSubscriptionSetting
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createSubscriptionSetting,
  editSubscriptionSetting,
  allSubscriptionSetting
};
