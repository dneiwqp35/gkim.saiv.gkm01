// 获取百度云访问令牌
async function getBaiduAccessToken() {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_CONFIG.API_KEY}&client_secret=${BAIDU_CONFIG.SECRET_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST'
        });
        
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('获取access_token失败:', error);
        throw new Error('认证失败');
    }
} 