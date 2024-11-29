// 修改发送验证码的处理逻辑
async function sendVerificationCode(phone) {
    try {
        const response = await fetch('/api/send-verification-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('验证码已发送，请注意查收', 'success');
            return true;
        } else {
            showError('phoneError', data.message || '验证码发送失败，请稍后重试');
            return false;
        }
    } catch (error) {
        console.error('发送验证码失败:', error);
        showError('phoneError', '网络错误，请稍后重试');
        return false;
    }
} 