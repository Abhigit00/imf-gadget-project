const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
      const { username, password, role } = req.body;

      if (!username || !password) {
          return res.status(400).json({ error: "Username and password are required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ username, password: hashedPassword, role });
      await user.save();

      res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error)
      res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/login", async (req, res) => {
  try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(400).json({ error: "Invalid username or password" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: "Invalid username or password" });

      const token = jwt.sign(
          { id: user.id, role: user.role }, 
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      res.json({ token });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});




module.exports = router;
