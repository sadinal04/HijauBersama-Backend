import { Request, Response } from "express";
import Edukasi from "../models/Edukasi";

export const getAllEdukasi = async (req: Request, res: Response) => {
  try {
    const edukasiList = await Edukasi.find().sort({ createdAt: -1 });
    console.log("Mengirim edukasi:", edukasiList.length, "items");
    res.json(edukasiList);
  } catch (err) {
    console.error("Error getAllEdukasi:", err);
    res.status(500).json({ message: "Gagal mengambil daftar edukasi" });
  }
};

export const createEdukasi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, videoUrl, content } = req.body;

    if (!title || !type) {
      res.status(400).json({ message: "Judul dan tipe edukasi wajib diisi" });
      return;
    }

    if (type !== "artikel" && type !== "video") {
      res.status(400).json({ message: "Tipe edukasi harus 'artikel' atau 'video'" });
      return;
    }

    if (type === "video" && (!videoUrl || videoUrl.trim() === "")) {
      res.status(400).json({ message: "videoUrl wajib diisi untuk tipe video" });
      return;
    }

    if (type === "artikel" && (!content || content.trim() === "")) {
      res.status(400).json({ message: "content wajib diisi untuk tipe artikel" });
      return;
    }

    const newEdukasi = new Edukasi({ title, type, videoUrl, content });
    await newEdukasi.save();

    res.status(201).json(newEdukasi);
  } catch (err) {
    res.status(500).json({ message: "Gagal membuat edukasi baru" });
  }
};

export const updateEdukasi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, type, videoUrl, content } = req.body;

    if (!title || !type) {
      res.status(400).json({ message: "Judul dan tipe edukasi wajib diisi" });
      return;
    }

    if (type !== "artikel" && type !== "video") {
      res.status(400).json({ message: "Tipe edukasi harus 'artikel' atau 'video'" });
      return;
    }

    if (type === "video" && (!videoUrl || videoUrl.trim() === "")) {
      res.status(400).json({ message: "videoUrl wajib diisi untuk tipe video" });
      return;
    }

    if (type === "artikel" && (!content || content.trim() === "")) {
      res.status(400).json({ message: "content wajib diisi untuk tipe artikel" });
      return;
    }

    const updated = await Edukasi.findByIdAndUpdate(
      id,
      { title, type, videoUrl, content },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Edukasi tidak ditemukan" });
      return;
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui edukasi" });
  }
};

export const deleteEdukasi = async (req: Request, res: Response) => {
  try {
    console.log("DELETE request for id:", req.params.id);
    const { id } = req.params;
    const deleted = await Edukasi.findByIdAndDelete(id);

    if (!deleted) {
      console.log("Edukasi tidak ditemukan dengan id:", id);
      res.status(404).json({ message: "Edukasi tidak ditemukan" });
      return;
    }

    console.log("Edukasi berhasil dihapus:", id);
    res.json({ message: "Edukasi berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteEdukasi:", err);
    res.status(500).json({ message: "Gagal menghapus edukasi" });
  }
};

