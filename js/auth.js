// 检查用户是否已登录
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('请先登录后再使用此功能');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 更新导航栏用户状态
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.querySelector('.login-btn');
    
    if (user && loginBtn) {
        const userMenuItem = document.createElement('li');
        userMenuItem.className = 'user-menu-item';
        userMenuItem.innerHTML = `
            <div class="user-menu">
                <img src="${user.avatar}" alt="用户头像" class="user-avatar">
                <span class="user-name">${user.username}</span>
                <div class="dropdown-menu">
                    <a href="profile.html">个人信息</a>
                    <a href="settings.html">账号设置</a>
                    <a href="#" id="logoutBtn">退出登录</a>
                </div>
            </div>
        `;
        loginBtn.parentElement.replaceWith(userMenuItem);

        // 添加退出登录事件
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('user');
                window.location.reload();
            }
        });
    }
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
}); 