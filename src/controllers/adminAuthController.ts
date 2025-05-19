import { RequestHandler } from "express";
import Admin from "../models/Admin";

export const adminLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(400).json({ message: "Email atau password salah" });
      return;
    }

    if (password !== admin.password) {
      res.status(400).json({ message: "Email atau password salah" });
      return;
    }

    res.json({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      message: "Login berhasil",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
