import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authController = {

  registerUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Missing fields" });

      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "User already exists" });

      const hash = await bcrypt.hash(password, 10);

      const user = await User.create({ email, password: hash });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.json({ message: "Registered", token });

    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Missing fields" });

      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.json({ message: "Logged in", token });

    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }

};

export default authController;
