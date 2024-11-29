document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    function checkLoginStatus() {
        const currentUser = localStorage.getItem('currentUser');
        const userPoints = parseInt(localStorage.getItem('userPoints') || '100');
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // 积分管理
    function updateUserPoints(points) {
        let currentPoints = parseInt(localStorage.getItem('userPoints') || '100');
        currentPoints += points;
        localStorage.setItem('userPoints', currentPoints.toString());
        return currentPoints;
    }

    // 文章状态枚举
    const ArticleStatus = {
        ACTIVE: 'active',
        EXPIRED: 'expired',
        HIDDEN: 'hidden'
    };

    // 从 localStorage 获取文章数据
    let articles = JSON.parse(localStorage.getItem('articles')) || [];

    // 文章管理类
    class ArticleManager {
        static publish(articleData) {
            const points = -10; // 发布文章扣除积分
            const currentPoints = updateUserPoints(points);
            
            if (currentPoints < 0) {
                alert('积分不足，无法发布文章！');
                return false;
            }

            const newArticle = {
                ...articleData,
                id: Date.now().toString(), // 唯一ID
                date: new Date().toISOString(),
                status: ArticleStatus.ACTIVE,
                author: localStorage.getItem('currentUser'),
                remainingTime: 24 * 60 * 60 * 1000,
                reads: 0,
                likes: 0,
                history: [{
                    action: 'publish',
                    date: new Date().toISOString(),
                    points: points
                }]
            };

            articles.unshift(newArticle);
            this.saveArticles();
            return true;
        }

        static reactivate(articleId) {
            const points = -10; // 重新激活扣除积分
            const currentPoints = updateUserPoints(points);
            
            if (currentPoints < 0) {
                alert('积分不足，无法重新激活文章！');
                return false;
            }

            const article = articles.find(a => a.id === articleId);
            if (article) {
                article.status = ArticleStatus.ACTIVE;
                article.date = new Date().toISOString();
                article.remainingTime = 24 * 60 * 60 * 1000;
                article.history.push({
                    action: 'reactivate',
                    date: new Date().toISOString(),
                    points: points
                });
                this.saveArticles();
                return true;
            }
            return false;
        }

        static delete(articleId) {
            const index = articles.findIndex(a => a.id === articleId);
            if (index !== -1) {
                articles.splice(index, 1);
                this.saveArticles();
                return true;
            }
            return false;
        }

        static saveArticles() {
            localStorage.setItem('articles', JSON.stringify(articles));
        }

        static getArticleStatus(article) {
            const now = new Date();
            const published = new Date(article.date);
            const diffMs = now - published;
            
            article.remainingTime = Math.max(0, (24 * 60 * 60 * 1000) - diffMs);
            
            return {
                isExpired: diffMs > (24 * 60 * 60 * 1000),
                remainingHours: Math.floor(article.remainingTime / (1000 * 60 * 60)),
                remainingMinutes: Math.floor((article.remainingTime % (1000 * 60 * 60)) / (1000 * 60))
            };
        }
    }

    // 渲染文章列表
    function renderArticles() {
        const currentUser = localStorage.getItem('currentUser');
        const userPoints = localStorage.getItem('userPoints');
        
        // 更新积分显示
        document.getElementById('userPoints').textContent = `当前积分：${userPoints}`;

        const visibleArticles = articles.filter(article => {
            const status = ArticleManager.getArticleStatus(article);
            return !status.isExpired || 
                   article.status === ArticleStatus.ACTIVE || 
                   article.author === currentUser;
        });

        articleTable.innerHTML = visibleArticles.map(article => {
            const status = ArticleManager.getArticleStatus(article);
            const timeRemaining = status.isExpired ? 
                '已过期' : 
                `剩余 ${status.remainingHours}小时${status.remainingMinutes}分钟`;

            return `
                <tr class="${status.isExpired ? 'expired' : ''}">
                    <td>${article.title}</td>
                    <td>
                        <span class="platform-tag ${article.platform}">
                            ${article.platform === 'wechat' ? '公众号' : '头条'}
                        </span>
                    </td>
                    <td>
                        ${new Date(article.date).toLocaleString('zh-CN')}
                        <br>
                        <small class="time-remaining ${status.isExpired ? 'expired-text' : ''}">${timeRemaining}</small>
                    </td>
                    <td>${article.reads.toLocaleString()}</td>
                    <td>${article.likes}</td>
                    <td>
                        <div class="article-actions">
                            <button class="action-btn view" onclick="viewArticle('${article.id}')">查看</button>
                            <button class="action-btn share" onclick="shareArticle('${article.id}')">分享</button>
                            ${article.author === currentUser ? 
                                (status.isExpired ? 
                                    `<button class="action-btn reactivate" onclick="reactivateArticle('${article.id}')">重新激活</button>` :
                                    `<button class="action-btn delete" onclick="deleteArticle('${article.id}')">删除</button>`
                                ) : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // 初始化页面
    if (checkLoginStatus()) {
        renderArticles();
        setInterval(renderArticles, 60000); // 每分钟更新一次
    }

    // 发布文章事件处理
    submitBtn.addEventListener('click', function() {
        if (!checkLoginStatus()) return;

        if (!titleInput.value || !urlInput.value || !descInput.value) {
            alert('请填写完整信息');
            return;
        }

        const platform = detectPlatform(urlInput.value);
        if (platform === 'unknown' && !confirm('无法识别文章平台类型，是否以公众号形式发布？')) {
            return;
        }

        const articleData = {
            title: titleInput.value,
            url: urlInput.value,
            platform: platform === 'unknown' ? 'wechat' : platform,
            description: descInput.value
        };

        if (ArticleManager.publish(articleData)) {
            renderArticles();
            titleInput.value = '';
            urlInput.value = '';
            descInput.value = '';
            alert('文章发布成功！(-10积分)');
        }
    });

    // 全局函数定义
    window.viewArticle = function(articleId) {
        const article = articles.find(a => a.id === articleId);
        if (article) {
            article.reads++;
            ArticleManager.saveArticles();
            window.open(article.url, '_blank');
        }
    };

    window.shareArticle = function(articleId) {
        const article = articles.find(a => a.id === articleId);
        if (article) {
            // 实现分享功能
            alert('分享功能开发中...');
        }
    };

    window.reactivateArticle = function(articleId) {
        if (ArticleManager.reactivate(articleId)) {
            renderArticles();
            alert('文章已重新激活！(-10积分)');
        }
    };

    window.deleteArticle = function(articleId) {
        if (confirm('确定要删除这篇文章吗？')) {
            if (ArticleManager.delete(articleId)) {
                renderArticles();
                alert('文章已删除！');
            }
        }
    };
}); 