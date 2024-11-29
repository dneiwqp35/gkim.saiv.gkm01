document.addEventListener('DOMContentLoaded', () => {
    initQRCode();
});

function initQRCode() {
    const qrCode = document.getElementById('qrCode');
    const qrLoading = document.getElementById('qrLoading');
    
    // 创建QR码
    try {
        // 这里使用示例URL，实际使用时替换为你的微信登录URL
        const qrCodeUrl = "https://example.com/wechat-login?timestamp=" + new Date().getTime();
        
        // 清除现有内容
        qrCode.innerHTML = '';
        
        // 生成二维码
        new QRCode(qrCode, {
            text: qrCodeUrl,
            width: 240,
            height: 240,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // 隐藏加载状态
        qrLoading.classList.add('hidden');

        // 设置二维码过期时间
        setTimeout(() => {
            const qrExpired = document.getElementById('qrExpired');
            qrExpired.classList.remove('hidden');
            qrCode.classList.add('hidden');
        }, 5 * 60 * 1000); // 5分钟后过期

    } catch (error) {
        console.error('二维码生成失败:', error);
        showError('二维码生成失败，请刷新页面重试');
    }
}

function refreshQRCode() {
    const qrCode = document.getElementById('qrCode');
    const qrExpired = document.getElementById('qrExpired');
    const qrLoading = document.getElementById('qrLoading');

    // 显示加载状态
    qrLoading.classList.remove('hidden');
    qrExpired.classList.add('hidden');
    qrCode.classList.remove('hidden');
    qrCode.innerHTML = '';

    // 重新初始化二维码
    setTimeout(() => {
        initQRCode();
    }, 500);
}

function showError(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message error';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// 模拟检查登录状态
function checkLoginStatus() {
    // 这里添加实际的登录状态检查逻辑
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: false });
        }, 2000);
    });
}

// 定期检查登录状态
setInterval(async () => {
    const status = await checkLoginStatus();
    if (status.success) {
        window.location.href = '/index.html'; // 登录成功后跳转
    }
}, 2000); 