import mongoose from "mongoose";
import { Request, RequestHandler, Response } from "express";
import User, { INotification, IUser } from "../models/User";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId; // casting jika perlu
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return; // penting, supaya fungsi tidak lanjut
    }
    res.json(user); // jangan return res.json(...) atau pastikan return type void
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { name, bio, profilePhotoBase64 } = req.body;

    const updateData: any = { name, bio };

    if (profilePhotoBase64) {
      updateData.profilePhoto = profilePhotoBase64;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserNotifications: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("notifications");
    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }

    res.json(user.notifications); // kirim response tapi **tidak return**
  } catch (error) {
    res.status(500).json({ message: "Server error" }); // kirim error tapi **tidak return**
  }
};

export const markNotificationRead: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const notificationId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return; // cukup return tanpa return res.json(...)
    }

    const notification = user.notifications.id(notificationId);
    if (!notification) {
      res.status(404).json({ message: "Notifikasi tidak ditemukan" });
      return;
    }

    notification.read = true;
    await user.save();

    res.json({ message: "Notifikasi ditandai sudah dibaca" });
    return; // kosongkan return, jangan return res.json
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};


