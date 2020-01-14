const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route PUT api/profile/education
// @desc PUT education
// @access private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const { text } = req.body;
      const newPost = new Post({
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route GET api/posts
// @desc GET all posts
// @access private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/posts/:id
// @desc GET post by ID
// @access private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/posts/:id
// @desc DELETE post by ID
// @access private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorised" });
    }

    post.remove();
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/likes/:id
// @desc LIKE a post
// @access private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //Check if already liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already been liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/unlike/:id
// @desc UNLIKE a post
// @access private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //Check if already liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post not yet liked" });
    }

    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    if (removeIndex < 0) {
      return res.status(400).json({ msg: "Post not yet liked" });
    }

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/comments/:id
// @desc PUT comments
// @access private
router.put(
  "/comments/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.id);

      const { text } = req.body;
      const newComment = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route DELETE api/posts/:post_id/comment/:comment_id
// @desc DELETE Post Comment
// @access private

router.delete("/:post_id/comment/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    if (!comment) {
      return res.status(404).json({ msg: "Result does not exists" });
    }
    //Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not assigned" });
    }

    const removeIndex = post.comments
      .map(comment => comment.id)
      .indexOf(req.params.comment_id);

    if (removeIndex < 0) {
      return res.status(400).json({ msg: "Comment not found" });
    }

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
