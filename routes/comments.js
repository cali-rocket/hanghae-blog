const express = require('express');
const router = express.Router();
const authMiddleWare = require("../middlewares/auth-middleware");

const Comments = require("../schemas/comment");

// 댓글 생성 API
router.post("/:_postId/comments", authMiddleWare, async (req, res) => {
    try {
        const { comment } = req.body;
        const { nickname, _id } = res.locals.user;

        await Comments.create({ nickname, userId: _id, comment });
        return res.status(200).json({ message: '댓글을 작성하였습니다.'});

    } catch (error) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.'});
    }
});

// 댓글 목록 조회 API
router.get("/:_postId/comments", async(req, res) => {
    const comments = await Comments.find({});
    try {
        const results = comments.map((comment) => {
            return {
                "commentId": comment._id.valueOf(),
                "userId": comment.userId,
                "nickname": comment.nickname,
                "comment": comment.comment,
                "createdAt": comment.createdAt,
                "updatedAt": comment.updatedAt
            }
        }) 
        res.status(200).json({ "comments": results });
    } catch (error) {
        return res.status(400).json({ message: '댓글 조회에 실패하였습니다.' })
    }
});

// 댓글 수정 API
router.put("/:_postId/comments/:_commentId", authMiddleWare, async (req, res) => {

    try {
        const { _commentId } = req.params;
        const { comment } = req.body;
        const userId = res.locals.user.id;

        if (!comment){
            return res.status(412).json({ message: '데이터 형식이 올바르지 않습니다.' })
        }

        const comments = await Comments.find({});

        let targetComment = comments.find((comment) =>
            comment._id.valueOf() === _commentId
        )

        if (targetComment) {
            if(targetComment.userId === userId){
                await Comments.updateOne({ _id: _commentId },{ $set: {comment: comment}});

                res.status(200).json({ message: '댓글을 수정하였습니다.'});
            }else{
                res.status(404).json({message: '댓글의 수정 권한이 존재하지 않습니다.'}) 
            }
        } else {
            res.status(404).json({ message: '게시글이 존재하지 않습니다.' })
        }
    } catch (error) {
        return res.status(400).json({ message: '댓글 수정에 실패하였습니다.'})
    }
});

// 댓글 삭제 API
router.delete("/:_postId/comments/:_commentId", authMiddleWare, async (req, res) => {

    try {
        const { _commentId } = req.params;
        const userId = res.locals.user.id;

        const comments = await Comments.find({});

        let targetComment = comments.find((comment) =>
            comment._id.valueOf() === _commentId
        )

        if (targetComment) {
            if(targetComment.userId === userId){
                await Comments.deleteOne({ _id: _commentId });

                res.status(200).json({ message: '댓글을 삭제하였습니다.'});
            }else{
                res.status(404).json({message: '댓글의 삭제 권한이 존재하지 않습니다.'}) 
            }
        } else {
            res.status(404).json({ message: '게시글이 존재하지 않습니다.' })
        }
    } catch (error) {
        return res.status(400).json({ message: '댓글 삭제에 실패하였습니다.'})
    }
});

module.exports = router;