const express = require('express');
const router = express.Router();
const authMiddleWare = require("../middlewares/auth-middleware");

const Posts = require("../schemas/post");

// 게시글 조회 API
router.get("/", async(req, res) => {

    const posts = await Posts.find({});
    
    try {
        const results = posts.map((post) => {
            return {
                "postId": post._id.valueOf(),
                "userId": post.userId,
                "nickname": post.nickname,
                "title": post.title,
                "createdAt": post.createdAt,
                "updatedAt": post.updatedAt
            }
        }) 
        res.status(200).json({ "posts": results });
    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
});

// 게시글 작성 API
router.post("/", authMiddleWare, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { nickname, _id } = res.locals.user;
        const cookie = req.headers.cookie;

        if (!cookie) {
            throw res.status(403).json({ message: '로그인이 필요한 기능입니다.' })
        }
        if (!title && !content) {
            throw res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' })
        } else if (!title) {
            throw res.status(412).json({ message: '게시글 제목의 형식이 일치하지 않습니다.' })
        } else if (!content) {
            throw res.status(412).json({ message: '게시글 내용의 형식이 일치하지 않습니다.' })
        }

        Posts.create({ nickname, userId: _id, title, content });
        return res.status(200).json({ message: '게시글 작성에 성공하였습니다.'});
    } catch (error) {
        return res.status(400).json({ message: '게시글 작성에 실패하였습니다.'});
    }
});

// 게시글 상세 조회 API
router.get("/:_postId", async(req, res) => {
    const posts = await Posts.find({});
	const { _postId } = req.params;

    let result = {};
    let targetPost = posts.find((post) =>
        post._id.valueOf() === _postId
    )
    
    if (targetPost) {
        result = {
            "postId": targetPost._id.valueOf(),
            "userId": targetPost.userId,
            "nickname": targetPost.nickname,
            "title": targetPost.title,
            "content": targetPost.content,
            "createdAt": targetPost.createdAt,
            "updatedAt": targetPost.updatedAt
        }
        res.status(200).json({ "data": result })
    } else {
        res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
    }
});

//게시글 수정 API
router.put("/:_postId", authMiddleWare, async (req, res) => {

    try {
        const { _postId } = req.params;
        const { title, content } = req.body;
        const userId = res.locals.user.id;
        const cookie = req.headers.cookie;

        if (!cookie) {
            throw res.status(403).json({ message: '로그인이 필요한 기능입니다.' })
        }


        if (!title && !content) {
            throw res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' })
        } else if (!title) {
            throw res.status(412).json({ message: '게시글 제목의 형식이 일치하지 않습니다.' })
        } else if (!content) {
            throw res.status(412).json({ message: '게시글 내용의 형식이 일치하지 않습니다.' })
        }
        const posts = await Posts.find({});

        let targetPost = posts.find((post) =>
            post._id.valueOf() === _postId
        )

        if (targetPost) {
            if(targetPost.userId === userId){
                await Posts.updateOne({ _id: _postId },{ $set: {title: title, content: content} });

                res.status(200).json({ message: '게시글을 수정하였습니다.'});
            } else {
                res.status(403).json({message: '게시글 수정의 권한이 존재하지 않습니다.'}) 
            }
        } else {
            res.status(404).json({ message: '게시글이 존재하지 않습니다..' })
        } 
    } catch (error) {
        return res.status(400).json({ message: '게시글 작성에 실패하였습니다.'});
    }
});

//게시글 삭제 API
router.delete("/:_postId", authMiddleWare, async (req, res) => {
    
    try {
        const { _postId } = req.params;
        const userId = res.locals.user.id;
        const posts = await Posts.find({});
        const cookie = req.headers.cookie;

        if (!cookie) {
            throw res.status(403).json({ message: '로그인이 필요한 기능입니다.' })
        }


        let targetPost = posts.find((post) =>
            post._id.valueOf() === _postId
        )

        if (targetPost) {
            if(targetPost.userId === userId){
                await Posts.deleteOne({ _id: _postId });
                res.status(200).json({ message: '게시글을 삭제하였습니다.'});
            } else {
                res.status(403).json({message: '게시글의 삭제 권한이 존재하지 않습니다.'}) 
            }
        } else {
            res.status(401).json({ message: '게시글이 정상적으로 삭제되지 않았습니다.' })
        }
    } catch (error) {
        return res.status(400).json({ message: '게시글 삭제에 실패하였습니다.'})
    }
});

module.exports = router;