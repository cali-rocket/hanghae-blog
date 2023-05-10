const express = require("express");
const JWT = require("jsonwebtoken");
const router = express.Router();
const User = require("../schemas/user");

//로그인 API
router.post("/", async (req, res, next) => {
    try {
        const { nickname, password } = req.body;

        const user = await User.findOne({
            nickname: nickname,
            password: password,
        });
    
        if (!user || password !== user.password) {
            return res.status(412).json({ message: '닉네임 또는 패스워드를 확인해주세요.' })
        } else if(user && password == user.password) {
    
            const token = await JWT.sign(
            { nickname: user.id },
            "custom-secret-key"
            );
            res.cookie("Authorization", `Bearer ${token}`);
            console.log(token);
            res.status(200).json({ token: token }); 
        } else {
            return res.status(400).json({ message: '로그인에 실패하였습니다.' })
        }
        } catch (error) {
            return next(error);
        }
  });
  
  module.exports = router;