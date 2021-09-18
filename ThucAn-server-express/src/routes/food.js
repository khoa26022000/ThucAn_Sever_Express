const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const verifyToken = require("../middleware/restaurant");

// @route POST api/food
// @desc create food
// @access private
router.post("/", verifyToken, async (req, res) => {
  const { name, photo, description, menu, price, quantity } = req.body;

  if (!name || !price)
    return res
      .status(400)
      .json({ success: false, message: "Thiếu tên và giá tiền" });

  try {
    const newFood = new Food({
      name,
      photo,
      description,
      menu,
      restaurant: req.restaurantId,
      price,
      quantity,
    });
    await newFood.save();

    res.json({ success: true, message: "Tạo thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Tạo thất bại ${error}` });
  }
});

// @route GET api/food
// @desc get food
// @access private
router.get("/", async (req, res) => {
  const { restaurant } = req.body;
  try {
    const food = await Food.find({ restaurant });
    return res.json({
      success: true,
      message: "Món ăn của cửa hàng",
      food,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Thất bại` });
  }
});

module.exports = router;
