import Category from "../models/CategoryModel.js";

const createCategory = async (req, res) => {
  const { name } = req.body;
  console.log("req.body", req.body);
  try {
    const category = new Category({
      name
    });
    console.log("category", category);

    const createdcategory = await category.save();
    console.log("createdcategory", createdcategory);
    if (createdcategory) {
      res.status(201).json({
        createdcategory
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const updateCategory = async (req, res) => {
  const { categoryid, updatename } = req.body;
  console.log("req.body", req.body);
  try {
    const category = await Category.findById({ _id: categoryid });
    category.name = updatename;

    await category.save();
    await res.status(201).json({
      category
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const categorylogs = async (req, res) => {
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

    const category = await Category.paginate(
      { ...searchParam, ...status_filter, ...dateFilter },
      {
        page: req.query.page,
        limit: req.query.perPage,
        lean: true,
        sort: "-_id"
      }
    );
    await res.status(200).json({
      category
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.toString()
    });
  }
};

const toggleActiveStatus = async (req, res) => {
    console.log("req.params.id", req.params.id);
    try {
      const category = await Category.findById(req.params.id);
      console.log("category", category);
      category.status = category.status == true ? false : true;
      await category.save();
      await res.status(201).json({
        message: category.status ? "Category Activated" : "Category Inactivated"
      });
    } catch (err) {
      console.log("error", error);
      res.status(500).json({
        message: err.toString()
      });
    }
  };

export { createCategory, categorylogs, updateCategory,toggleActiveStatus };
