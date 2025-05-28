import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Server configuration error" });
    return;
  }

  try {
    // verifikasi token
    const decoded = jwt.verify(token, secret);
    // kalau perlu, cek role/admin di decoded dan reject kalau tidak sesuai

    // simpan data user/admin ke req untuk middleware berikutnya
    (req as any).admin = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
