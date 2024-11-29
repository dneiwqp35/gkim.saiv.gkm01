const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());

// Baidu API Configuration
const baiduConfig = {
    apiKey: 'ALTAK-HT2jqryHz0VxbiMRZRLju',
    secretKey: 'c53ce69da9113cb24d198df883eaa6bf55c5890a'
};

// Get Baidu access token
async function getBaiduToken() {
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${baiduConfig.apiKey}&client_secret=${baiduConfig.secretKey}`;
    try {
        const response = await fetch(tokenUrl, { method: 'POST' });
        const data = await response.json();
        if (!data.access_token) {
            throw new Error('Failed to get access token');
        }
        return data.access_token;
    } catch (error) {
        throw new Error(`Token fetch failed: ${error.message}`);
    }
}

// Proxy Baidu API requests
app.post('/api/baidu/:action', async (req, res) => {
    try {
        const token = await getBaiduToken();
        const { action } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text parameter is required' });
        }

        const response = await fetch(
            `https://aip.baidubce.com/rpc/2.0/nlp/v1/${action}?access_token=${token}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`代理服务器运行在 http://localhost:${PORT}`);
}); 