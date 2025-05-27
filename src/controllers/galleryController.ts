import { Request, Response } from "express";
import GalleryPost from "../models/GalleryPost";
import User from "../models/User";
import mongoose from "mongoose";

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = "" } = req.query;

    // Pencarian case insensitive untuk uploaderName dan caption
    const regex = new RegExp(search.toString(), "i");

    const posts = await GalleryPost.find({
      $or: [
        { uploaderName: regex },
        { caption: regex }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("uploader", "name")
      .exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data galeri" });
  }
};

export const uploadPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId);
    const userName = user ? user.name : "Unknown";

    const { caption, imageUrl } = req.body;
    if (!caption || !imageUrl) {
      res.status(400).json({ message: "Caption dan gambar wajib diisi" });
      return;
    }

    const newPost = new GalleryPost({
      uploader: userId,
      uploaderName: userName,
      caption,
      imageUrl,
      likes: [],
      comments: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Gagal upload postingan" });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
      res.status(400).json({ message: "Komentar tidak boleh kosong" });
      return;
    }

    const post = await GalleryPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Postingan tidak ditemukan" });
      return;
    }

    const user = await User.findById(userId);
    const userName = user ? user.name : "Unknown";

    post.comments.push({
      userId,
      username: userName,
      content,
      createdAt: new Date(),
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah komentar" });
  }
};

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const postId = req.params.postId;

    const post = await GalleryPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Postingan tidak ditemukan" });
      return;
    }

    const index = post.likes.findIndex((id) => id.toString() === userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah like" });
  }
};

// Tambahkan fungsi ini untuk mendapatkan postingan milik user yang sedang login
export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ message: "User tidak terautentikasi" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "UserId tidak valid" });
      return;
    }

    const posts = await GalleryPost.find({ uploader: userId }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Error getUserPosts:", error);
    res.status(500).json({ message: "Gagal mengambil postingan user" });
  }
};
  
  // Fungsi deletePost sudah bagus, hanya cek userId uploader sebelum hapus:
  export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const postId = req.params.postId;
  
      const post = await GalleryPost.findById(postId);
      if (!post) {
        res.status(404).json({ message: "Postingan tidak ditemukan" });
        return;
      }
  
      if (post.uploader.toString() !== userId) {
        res.status(403).json({ message: "Anda tidak berhak menghapus postingan ini" });
        return;
      }
  
      await GalleryPost.findByIdAndDelete(postId);
      res.json({ message: "Postingan berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: "Gagal menghapus postingan" });
    }
  };