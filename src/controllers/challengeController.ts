import { RequestHandler } from "express";
import Challenge from "../models/Challenge";

export const getChallenges: RequestHandler = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addChallenge: RequestHandler = async (req, res) => {
  const { judul, deskripsi, benefit } = req.body;

  if (!judul || !deskripsi || !benefit) {
    res.status(400).json({ message: "Semua field harus diisi" });
    return;  // pastikan ada return setelah mengirim response
  }

  try {
    const newChallenge = new Challenge({ judul, deskripsi, benefit });
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateChallenge: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, benefit } = req.body;

  try {
    const updated = await Challenge.findByIdAndUpdate(
      id,
      { judul, deskripsi, benefit },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: "Tantangan tidak ditemukan" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChallenge: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Challenge.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Tantangan tidak ditemukan" });
      return;
    }
    res.json({ message: "Tantangan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getChallengeById: RequestHandler = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      res.status(404).json({ message: "Tantangan tidak ditemukan" });
      return; // cukup return void, jangan return res...
    }
    res.json(challenge); // panggil saja, tanpa return
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
