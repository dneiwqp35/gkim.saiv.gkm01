document.addEventListener('DOMContentLoaded', function() {
    // 获取所有需要的DOM元素
    const textArea = document.querySelector('textarea');
    const wordCount = document.querySelector('.word-count') || document.querySelector('div[class*="count"]');
    
    // 使用多种选择器确保能找到按钮
    const clearButton = document.querySelector('.btn-red') || 
                       document.querySelector('button[id*="clear"]') || 
                       document.querySelector('button:first-child');
                       
    const copyButton = document.querySelector('.btn-green') || 
                      document.querySelector('button[id*="copy"]') ||
                      document.querySelector('button:nth-child(2)');
                      
    const optimizeButton = document.querySelector('.btn-blue') || 
                          document.querySelector('button[id*="optimize"]') ||
                          document.querySelector('button:last-child');
                          
    const resultArea = document.querySelector('#result-text') || 
                      document.querySelector('.result-box') ||
                      document.querySelector('.detection-result');
                      
    const scoreDisplay = document.querySelector('#score') || 
                        document.querySelector('.score-circle span') ||
                        document.querySelector('[class*="score"]');

    // 字数统计功能
    function updateWordCount() {
        if (textArea && wordCount) {
            const count = textArea.value.length;
            const maxCount = 10000;
            wordCount.textContent = `${count}/${maxCount}`;
            
            if (count > maxCount) {
                textArea.value = textArea.value.slice(0, maxCount);
            }
        }
    }

    // 清空功能
    function clearContent() {
        console.log('清空功能被触发');
        if (textArea) {
            textArea.value = '';
            updateWordCount();
        }
        if (resultArea) {
            resultArea.innerHTML = '<p>检测结果将在这里显示...</p>';
        }
        if (scoreDisplay) {
            scoreDisplay.textContent = '0';
        }
    }

    // 复制功能
    function copyContent() {
        console.log('复制功能被触发');
        if (textArea && textArea.value.trim()) {
            textArea.select();
            try {
                document.execCommand('copy');
                alert('内容已复制到剪贴板');
            } catch (err) {
                console.error('复制失败:', err);
                // 尝试使用现代API
                navigator.clipboard.writeText(textArea.value)
                    .then(() => alert('内容已复制到剪贴板'))
                    .catch(() => alert('复制失败，请手动复制'));
            }
        } else {
            alert('没有可复制的内容');
        }
    }

    // 论文优化功能
    function optimizeContent() {
        console.log('论文优化功能被触发');
        if (!textArea || !textArea.value.trim()) {
            alert('请输入需要优化的内容');
            return;
        }

        if (resultArea) {
            resultArea.innerHTML = '<p>正在优化中...</p>';
        }
        if (scoreDisplay) {
            scoreDisplay.textContent = '0';
        }

        // 模拟优化过程
        setTimeout(() => {
            const score = Math.floor(Math.random() * 100);
            if (scoreDisplay) {
                scoreDisplay.textContent = score;
            }

            const analysisResult = `
                <div class="analysis-result">
                    <h4>优化结果：</h4>
                    <p>当前AI特征：${score}%</p>
                    <div class="details">
                        <p>文本流畅度：${Math.floor(Math.random() * 100)}%</p>
                        <p>语言自然度：${Math.floor(Math.random() * 100)}%</p>
                        <p>结构完整性：${Math.floor(Math.random() * 100)}%</p>
                    </div>
                </div>
            `;

            if (resultArea) {
                resultArea.innerHTML = analysisResult;
            }
        }, 1500);
    }

    // 绑定事件监听器
    if (textArea) {
        textArea.addEventListener('input', updateWordCount);
        // 添加回车键检测
        textArea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                optimizeContent();
            }
        });
    }

    // 确保按钮事件绑定
    if (clearButton) {
        console.log('清空按钮已找到');
        clearButton.addEventListener('click', clearContent);
    }

    if (copyButton) {
        console.log('复制按钮已找到');
        copyButton.addEventListener('click', copyContent);
    }

    if (optimizeButton) {
        console.log('优化按钮已找到');
        optimizeButton.addEventListener('click', optimizeContent);
    }

    // 初始化字数统计
    updateWordCount();

    // 输出调试信息
    console.log('按钮状态:', {
        clearButton: !!clearButton,
        copyButton: !!copyButton,
        optimizeButton: !!optimizeButton
    });
}); 