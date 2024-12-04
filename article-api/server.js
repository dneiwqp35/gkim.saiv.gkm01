const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// �м��
app.use(cors());
app.use(bodyParser.json());

// �洢���µ�����
let articles = [];

// ��·������
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html; charset=utf-8'); // �����ַ�����
    res.send('��ӭʹ�����·��� API������� /api/articles ���в�����');
});

// �������µ� API
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

// ��ȡ�������µ� API
app.get('/api/articles', (req, res) => {
    res.set('Content-Type', 'application/json; charset=utf-8'); // �����ַ�����
    res.json(articles);
});

// ������
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('����������');
});

// ����������
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});