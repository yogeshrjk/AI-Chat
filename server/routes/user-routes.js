const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../utils/multer");
const User = require("../models/user-model");

const router = express.Router();

// POST /api/users/signup
router.post("/signup", upload.single("profilePic"), async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, dob, email, gender, password } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
      dob,
      email,
      gender,
      password: hashedPassword,
      profilePic: req.file?.path || null, // Cloudinary URL from multer
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ ...newUser._doc, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
