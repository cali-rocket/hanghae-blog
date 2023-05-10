const express = require('express');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');
const loginRouter = require('./login');
const signUpRouter = require('./users');

const router = express.Router();

router.use('/posts/', commentsRouter);
router.use('/posts/', postsRouter);
router.use('/login/', loginRouter); 
router.use('/signup/', signUpRouter);

module.exports = router;
