const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

// @route POST api/auth/register
// @desc Resgister user
// @access Public

router.post("/register", async (req, res) => {
  const {
    phoneNumber,
    password,
    confirmPassword,
    fullName,
    avatar,
    dateOfBirth,
    male,
    address,
  } = req.body;

  if (!phoneNumber || !password)
    return res
      .status(400)
      .json({ success: false, message: "Thiếu số điện thoại hoặc password" });

  try {
    // Check có sđt trùng hay k
    const phone = await User.findOne({ phoneNumber });
    if (phone)
      return res
        .status(400)
        .json({ success: false, message: "Số điện thoại đã có người sử dụng" });

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      password: hashedPassword,
      phoneNumber,
      profile: {
        fullName,
        avatar: avatar || "",
        dateOfBirth,
        male: male || true,
        address: `${address.street}, ${address.ward}, ${address.district}, ${address.city}`,
      },
    });
    await newUser.save();

    // return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({ success: true, message: "Đăng ký thành công", accessToken });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: `Đăng nhập thất bại${error}` });
  }
});

// @route POST api/auth/login
// @desc login user
// @access Public

router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password)
    return res.status(400).json({
      success: false,
      message: "Số điện thoại hoặc password không chính xác !!!",
    });

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Số điện thoại hoặc password không chính xác !!!",
      });

    // sai
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Số điện thoại hoặc password không chính xác !!!",
      });

    // đúng
    const accessToken = jwt.sign(
      {
        userId: user._id,
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

// @route GET api/auth/profile
// @desc profile user
// @access privte

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    return res.json({
      success: true,
      message: "Thông tin cá nhân",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Thất bại` });
  }
});

// @route PUT api/auth/update
// @desc update user
// @access privte

router.put("/:id", verifyToken, async (req, res) => {
  const {
    phoneNumber,
    password,
    profile: { fullName, avatar, dateOfBirth, male, address },
  } = req.body;

  if (!phoneNumber)
    return res
      .status(400)
      .json({ success: false, message: "PhoneNumber is required" });

  try {
    const hashedPassword = await argon2.hash(password);
    let updatedProfile = {
      phoneNumber,
      password: hashedPassword,
      profile: {
        fullName: fullName || "",
        avatar: avatar || "",
        dateOfBirth: dateOfBirth || "",
        male: male || true,
        address: `${address.street}, ${address.ward}, ${address.district}, ${address.city}`,
      },
    };

    const userUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedProfile = await User.findOneAndUpdate(
      userUpdateCondition,
      updatedProfile,
      { new: true }
    ).select("-password");

    // nếu kh đúng user
    if (!updatedProfile)
      return res
        .status(401)
        .json({ success: false, message: "update thất bại" });

    res.json({
      success: true,
      message: "Update thành công !!!",
      user: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
