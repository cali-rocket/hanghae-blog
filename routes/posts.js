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

    try {
        const { user, password, title, content } = req.body;

        const createdPosts = await Posts.create({ user, password, title, content });
        res.json({ posts: createdPosts });
    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.'});
    }
    
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
            "user": targetPost.user,
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
    const { password, title, content } = req.body;

    const posts = await Posts.find({});

    let targetPost = posts.find((post) =>
        post._id.valueOf() === _postId
    )

    if (targetPost) {
        if(targetPost.password === Number(password)){
            await Posts.updateOne({ _id: _postId },{ $set: {title: title} });
            await Posts.updateOne({ _id: _postId },{ $set: {content: content } });

            res.status(200).json({ message: '게시글을 수정하였습니다.'});
        }else{
            res.status(404).json({message: '게시글 조회에 실패하였습니다.'}) 
        }
    } else {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } 
});

//게시글 삭제 API
router.delete("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password } = req.body;

  
    const posts = await Posts.find({});

    let targetPost = posts.find((post) =>
        post._id.valueOf() === _postId
    )

    if (targetPost) {
        if(targetPost.password === Number(password)){
            await Posts.deleteOne({ _id: _postId });
            res.status(200).json({ message: '게시글을 삭제하였습니다.'});
        }else{
            res.status(404).json({message: '게시글 조회에 실패하였습니다.'}) 
        }
    } else {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } 
  });

// 댓글 생성 API
const Comments = require("../schemas/comment");
router.post("/posts/:_postId/comments", async (req, res) => {
    try {
        const { user, password, content } = req.body;

        const createdComments = await Comments.create({ user, password, content });
        res.json({ posts: createdComments });
    } catch (error) {
        const {content} = req.body;
        if (content === null || content === undefined) {
            return res.status(400).json({ message: '댓글 내용을 입력해주세요.'});
        }else{
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.'});
        }
    }
});


// 댓글 목록 조회 API
router.get("/posts/:_postId/comments", async(req, res) => {
    const comments = await Comments.find({});
    try {
        const results = comments.map((comment) => {
            return {
                "commentId": comment._id.valueOf(),
                "user": comment.user,
                "content": comment.content,
                "createdAt": comment.createdAt,
            }
        }) 
        res.status(200).json({ "data": results });
    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
});

// 댓글 수정 API
router.put("/posts/:_postId/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password, content } = req.body;

    const comments = await Comments.find({});

    let targetComment = comments.find((comment) =>
        comment._id.valueOf() === _commentId
    )

    if (targetComment) {
        if(targetComment.password === Number(password)){
            await Comments.updateOne({ _id: _commentId },{ $set: {content: content } });

            res.status(200).json({ message: '댓글을 수정하였습니다.'});
        }else{
            res.status(404).json({message: '댓글 조회에 실패하였습니다.'}) 
        }
    } else {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } 
});

// 댓글 삭제 API
router.delete("/posts/:_postId/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password, content } = req.body;
  
    const comments = await Comments.find({});

    let targetComment = comments.find((comment) =>
        comment._id.valueOf() === _commentId
    )

    if (targetComment) {
        if(targetComment.password === Number(password)){
            await Comments.deleteOne({ _id: _commentId });
            res.status(200).json({ message: '댓글을 삭제하였습니다.'});
        }else{
            res.status(404).json({message: '댓글 조회에 실패하였습니다.'}) 
        }
    } else {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    } 
  });


module.exports = router;