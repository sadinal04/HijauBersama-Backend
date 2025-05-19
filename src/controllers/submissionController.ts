import { RequestHandler } from "express";
import Submission from "../models/Submission";
import User from "../models/User";

export const uploadSubmission: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { challengeId } = req.body;
    const photoBase64 = req.body.photo || req.body.photoBase64;

    if (!userId || !challengeId || !photoBase64) {
      res.status(400).json({ message: "Data tidak lengkap" });
      return;
    }

    const newSubmission = new Submission({
      userId,
      challengeId,
      photoUrl: photoBase64,
      verified: false,
    });

    await newSubmission.save();

    res.status(201).json({ message: "Bukti tantangan berhasil dikirim", submission: newSubmission });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifySubmission: RequestHandler = async (req, res): Promise<void> => {
  try {
    const submissionId = req.params.id;
    const submission = await Submission.findById(submissionId).populate("challengeId", "judul");

    if (!submission) {
      res.status(404).json({ message: "Submission tidak ditemukan" });
      return;  // Ensure we exit after sending the response
    }

    if (submission.verified) {
      res.status(400).json({ message: "Submission sudah diverifikasi" });
      return;
    }

    submission.verified = true;
    submission.verifiedAt = new Date();
    await submission.save();

    // Push notification ke user
    const user = await User.findById(submission.userId);
    if (user) {
      user.notifications.push({
        message: `✅ Selamat! Bukti tantangan "${(submission.challengeId as any).judul}" berhasil diverifikasi. Klik untuk lihat sertifikat Anda.`,
        link: `/sertifikat/${submission._id}`,
        createdAt: new Date(),
      });
      await user.save();
    }

    res.json({ message: "Submission berhasil diverifikasi", submission });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSubmissions: RequestHandler = async (req, res) => {
  try {
    const submissions = await Submission.find()
        .populate("userId", "name email")
        .populate("challengeId", "judul")
        .sort({ "challengeId.judul": 1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubmissionById: RequestHandler = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("userId", "name email")
      .populate("challengeId", "judul");

    if (!submission) {
      res.status(404).json({ message: "Submission tidak ditemukan" });
      return;
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



