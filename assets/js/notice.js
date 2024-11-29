async function fetchNotices() {
    try {
        const response = await fetch('/api/notices');
        const notices = await response.json();
        
        const noticeList = document.querySelector('.notice-list');
        noticeList.innerHTML = notices.map(notice => `
            <div class="notice-item">
                <div class="notice-header">
                    <h2>${notice.title}</h2>
                    <div class="notice-meta">
                        <span class="date"><i class="time-icon"></i>${notice.publish_time}</span>
                        <span class="tag ${notice.type}">${notice.type_name}</span>
                    </div>
                </div>
                <div class="notice-content">
                    ${notice.content}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('获取公告失败:', error);
    }
} 