const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");
const verifyToken = require("../middleware/restaurant");

// @route POST api/restaurant
// @desc create restaurant
// @access Public

router.post("/register", async (req, res) => {
  const {
    name,
    phoneNumber,
    password,
    rating,
    categories,
    photo,
    duration,
    open,
    close,
    city,
    district,
    ward,
    street,
    fullName,
    avatar,
    CMND,
    dateOfBirth,
    male,
    address,
  } = req.body;

  if (!name)
    return res.status(400).json({
      success: false,
      message: "Thiếu tên nhà hàng, số điện thoại hoặc password",
    });

  try {
    const phone = await Restaurant.findOne({ phoneNumber });
    if (phone)
      return res
        .status(400)
        .json({ success: false, message: "Số điện thoại đã có người sử dụng" });

    const hashedPassword = await argon2.hash(password);
    const newRestaurant = new Restaurant({
      name,
      phoneNumber,
      password: hashedPassword,
      rating,
      categories,
      photo,
      duration,
      open,
      close,
      location: {
        city,
        district,
        ward,
        street,
      },
      owner: {
        fullName,
        avatar,
        CMND,
        dateOfBirth,
        male,
        address,
      },
    });
    await newRestaurant.save();

    const accessToken = jwt.sign(
      { restaurantId: newRestaurant._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Tạo thành công thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: `Tạo thất bại thất bại${error}` });
  }
});

// @route POST api/restaurant
// @desc get login
// @access Public

router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password)
    return res.status(400).json({
      success: false,
      message: "Số điện thoại hoặc password không chính xác !!!",
    });

  try {
    const restaurant = await Restaurant.findOne({ phoneNumber });
    if (!restaurant)
      return res.status(400).json({
        success: false,
        message: "Số điện thoại hoặc password không chính xác !!!",
      });

    // sai
    const passwordValid = await argon2.verify(restaurant.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Số điện thoại hoặc password không chính xác !!!",
      });

    // đúng
    const accessToken = jwt.sign(
      {
        restaurantId: restaurant._id,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: `Đăng nhập thất bại${error}` });
  }
});

// @route POST api/category
// @desc get category
// @access Public

router.get("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.find();
    return res.json({
      success: true,
      message: "Tất cả cửa hàng",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Thất bại` });
  }
});

module.exports = router;
