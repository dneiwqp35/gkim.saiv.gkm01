// 更新结果状态
function updateResultStatus(status, content = '') {
    const resultArea = document.querySelector('.result-area');
    switch(status) {
        case 'loading':
            resultArea.innerHTML = '<div class="loading">正在智能改写中...</div>';
            break;
        case 'success':
            resultArea.innerHTML = content;
            break;
        case 'error':
            resultArea.innerHTML = `<div class="error">${content}</div>`;
            break;
    }
}

// 错误处理
function handleError(error) {
    console.error('Error:', error);
    updateResultStatus('error', error.message || '处理失败，请重试');
} 