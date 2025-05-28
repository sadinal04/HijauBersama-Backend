import { RequestHandler } from "express";
import Admin from "../models/Admin";
import jwt from "jsonwebtoken";

export const adminLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(400).json({ message: "Email atau password salah" });
      return;
    }

    // NOTE: Jangan bandingkan plain text password langsung di produksi.
    // Gunakan bcrypt atau metode hashing yg aman.
    if (password !== admin.password) {
      res.status(400).json({ message: "Email atau password salah" });
      return;
    }

    // Generate token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "secret_key_default", // Ganti dengan secret di .env
      { expiresIn: "1h" }
    );

    res.json({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      token,  // Kirim token di sini
      message: "Login berhasil",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
