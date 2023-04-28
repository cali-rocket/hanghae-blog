const express = require('express');
const router = express.Router();

// localhost:3000/api/ GET
router.get("/", (req, res) => {
    res.send("default url for posts.js GET Method");
});

// 게시글 조회 API
router.get("/posts", async(req, res) => {
    
    const posts = await Posts.find({ user: "tester2"}, 'user title createdAt');

    res.json({ posts: posts });
});

// 게시글 작성 API
const Posts = require("../schemas/post");
router.post("/posts", async (req, res) => {
	const { user, password, title, content } = req.body;

    const createdPosts = await Posts.create({ user, password, title, content });

  res.json({ posts: createdPosts });
});

// 게시글 상세 조회 API
router.get("/posts/:_postId", (req, res) => {
	const { _postId } = req.params;
	const [detail] = Posts.filter((posts) => Posts._postId === Number(postId));
	res.json({ detail });
});



module.exports = router;