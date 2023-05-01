const express = require('express');
const router = express.Router();

// localhost:3000/api/ GET
router.get("/", (req, res) => {
    res.send("default url for posts.js GET Method");
});

// 게시글 조회 API
router.get("/posts", async(req, res) => {

    const posts = await Posts.find({});
    try {
        const results = posts.map((post) => {
            return {
                "postId": post._id.valueOf(),
                "user": post.user,
                "title": post.title,
                "createdAt": post.createdAt,
            }
        }) 
        res.status(200).json({ "data": results });
    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
});

// 게시글 작성 API
const Posts = require("../schemas/post");
router.post("/posts", async (req, res) => {
	const { user, password, title, content } = req.body;

    const createdPosts = await Posts.create({ user, password, title, content });

    res.json({ posts: createdPosts });
});

// 게시글 상세 조회 API
router.get("/posts/:_postId", async(req, res) => {
    const posts = await Posts.find({});
	const { _postId } = req.params;

    let result = {};
    let targetPost = posts.find((post) =>
        post._id.valueOf() === _postId
    )
    
    if (targetPost) {
        result = {
            "postId": targetPost._id.valueOf(),
            "user": targetPost.name,
            "title": targetPost.title,
            "content": targetPost.content,
            "createdAt": targetPost.createdAt,
        }
        res.status(200).json({ "data": result })
    } else {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
});

//게시글 수정 API
router.put("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password} = req.body;

    const posts = await Posts.find({});
    let result = {};
    let targetPost = posts.find((post) =>
        post._id.valueOf() === _postId
    )
    
    if (targetPost.length) {
      await Posts.updateOne({ postId: Number(_postId) },{ $set: {password: password} });
    }

    res.json({"message": "게시글을 수정하였습니다."});
 
});

module.exports = router;