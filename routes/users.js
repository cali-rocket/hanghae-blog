const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

// 회원가입 API
router.post("/", async (req, res, next) => {
    try {
        const { nickname, password, confirm } = req.body;
        
        const regex_nickname = /^[a-zA-Z0-9]{3,}$/;
        const regex_password = new RegExp(
            "^(?!.*" + nickname + ").*[a-zA-Z0-9]{4,}$"
        );
        if (!regex_nickname.test(nickname)) {
            return res.status(412).json({ message: '닉네임의 형식이 일치하지 않습니다.' })
        } else if (password !== confirm) {
            return res.status(412).json({ message: '패스워드가 일치하지 않습니다.' })
        } else if (password.length < 4) {
            return res.status(412).json({ message: '패스워드 형식이 일치하지 않습니다.' })
        } else if (!regex_password.test(password)) {
            return res.status(412).json({ message: '패스워드에 닉네임이 포함되어 있습니다.' })
        } else if (await User.findOne({ nickname: nickname })) {
            return res.status(412).json({ message: '중복된 닉네임입니다.' })
        } else if (req.body.empty) {
            return res.status(400).json({ message: '요청한 데이터 형식이 올바르지 않습니다.' })
        }
    
        const user = new User({ nickname, password });
    
        await user.save();
    
        return res.status(201).json({ message: "회원가입에 성공하였습니다." });
        } catch (error) {
        return next(error);
        }
  });

module.exports = router;