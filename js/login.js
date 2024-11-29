document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // 模拟后端验证（实际项目中应该连接真实后端）
    function mockLogin(username, password) {
        // 测试账号
        if (username === 'test@example.com' && password === 'Test123456') {
            return {
                success: true,
                user: {
                    username: 'test@example.com',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
                    isVIP: true
                }
            };
        }
        return { success: false, message: '用户名或密码错误' };
    }

    // 处理登录表单提交
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // 使用模拟登录
            const result = mockLogin(username, password);
            
            if (result.success) {
                // 保存用户信息到本地存储
                localStorage.setItem('user', JSON.stringify(result.user));
                alert('登录成功！');
                // 跳转到首页
                window.location.href = 'index.html';
            } else {
                alert(result.message);
            }
        });
    }
}); 