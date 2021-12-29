import Course from "../models/CourseModel";

const createProduct = async (req, res) => {
    const {
      category,
      title,
      brand,
      code,
      subcategory,
      status,
      baseprice,
      description,
      availablesize,
      availablecolor,
      quantityrange,
    } = req.body;
    let _reciepts = [];
    const reciepts = [];
    _reciepts = req.files.reciepts;
  
    if (!Array.isArray(_reciepts)) throw new Error("Reciepts Required");
    _reciepts.forEach((img) => reciepts.push(img.path));
    const product = await Course.create({
      category,
      title,
      brand,
      code,
      subcategory,
      status,
      baseprice,
      description,
      availablesize,
      availablecolor,
      quantityrange: JSON.parse(quantityrange),
      productimage: reciepts,
    });
    if (product) {
      //   const notification = {
      //     notifiableId: null,
      //     notificationType: "Service",
      //     title: "Service Created",
      //     body: `A service with id of ${service._id} has been created`,
      //     payload: {
      //       type: "Service",
      //       id: service._id,
      //     },
      //   };
      //   CreateNotification(notification);
      console.log("product", product);
      res.status(201).json({
        product,
      });
    } else {
      res.status(400);
      throw new Error("Invalid product data");
    }
  };
  export{createProduct}