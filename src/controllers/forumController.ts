import { Request, Response } from "express";
import Post from "../models/Post";

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10", search = "" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const searchRegex = new RegExp(search as string, "i");

    const posts = await Post.find({
      $or: [
        { judul: searchRegex },
        { isi: searchRegex },
        { "replies.isi": searchRegex },
      ],
    })
      .sort({ waktu: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Post.countDocuments({
      $or: [
        { judul: searchRegex },
        { isi: searchRegex },
        { "replies.isi": searchRegex },
      ],
    });

    res.json({ posts, total, page: pageNum, limit: limitNum });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { judul, isi, author } = req.body;
    if (!judul || !isi || !author) {
      res.status(400).json({ message: "Data tidak lengkap" });
      return;
    }

    const newPost = new Post({ judul, isi, author });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addReply = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { isi, author } = req.body;

    if (!isi || !author) {
      res.status(400).json({ message: "Data tidak lengkap" });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post tidak ditemukan" });
      return;
    }

    const newReply = post.replies.create({
      isi,
      author,
      waktu: new Date(),
    });

    post.replies.push(newReply);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

