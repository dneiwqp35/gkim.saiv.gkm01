const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 存储文章的数组
let articles = [];

// 根路径处理
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8'); // 设置字符编码
    res.send('欢迎使用文章发布 API！请访问 /api/articles 进行操作。');
});

// 发布文章的 API
app.post('/api/articles', (req, res) => {
    const article = {
        id: Date.now(),
        title: req.body.title,
        url: req.body.url,
        platform: req.body.platform,
        description: req.body.description,
        publishTime: req.body.publishTime,
        readCount: req.body.readCount,
        likeCount: req.body.likeCount,
        author: req.body.author,
        createdAt: req.body.createdAt
    };
    articles.push(article);
    res.status(201).json(article);
});

// 获取所有文章的 API
app.get('/api/articles', (req, res) => {
    res.set('Content-Type', 'application/json; charset=utf-8'); // 设置字符编码
    res.json(articles);
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器错误');
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});