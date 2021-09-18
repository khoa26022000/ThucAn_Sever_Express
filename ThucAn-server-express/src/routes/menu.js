const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const verifyToken = require("../middleware/restaurant");

// @route POST api/category
// @desc create category
// @access Public

router.post("/", verifyToken, async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ success: false, message: "Thiếu tên" });

  try {
    const newMenu = new Menu({
      name,
      restaurant: req.restaurantId, //id Restaurant
    });
    await newMenu.save();

    res.json({ success: true, message: "Tạo thành công thành công" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: `Tạo thất bại thất bại${error}` });
  }
});

// @route POST api/category
// @desc get category
// @access Public

router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    return res.json({
      success: true,
      message: "Tất cả category",
      menu,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Thất bại` });
  }
});

module.exports = router;
