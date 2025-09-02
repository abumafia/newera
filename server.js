const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Post = require("./models/Post");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB ulanish
mongoose.connect("mongodb+srv://apl:apl00@gamepaymentbot.ffcsj5v.mongodb.net/forum?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Post yaratish
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = new Post({ title, content, author });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Barcha postlarni olish
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Javob qo‘shish
app.post("/api/posts/:id/reply", async (req, res) => {
  try {
    const { text, author } = req.body;
    const post = await Post.findById(req.params.id);
    post.replies.push({ text, author });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serverni ishga tushirish
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
