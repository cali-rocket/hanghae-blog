const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();
const port = 3000;

const connect = require("./schemas");
connect();

app.use(express.urlencoded({ extended: false })); // form 데이터를 받기 위한 미들웨어
app.use(express.json()); // json 데이터를 받기 위한 미들웨어
app.use(cookieParser()); // cookie를 req.cookies에 등록하는 미들웨어

app.use('/api', routes);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

module.exports = app;