document.addEventListener('DOMContentLoaded', function() {
    const thesisText = document.getElementById('thesis-text');
    const currentCount = document.getElementById('current-count');
    const aiScore = document.getElementById('ai-score');
    const analysisDetails = document.getElementById('analysis-details');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const analyzeBtn = document.getElementById('analyze-btn');

    // 字数统计
    thesisText.addEventListener('input', function() {
        const count = this.value.length;
        currentCount.textContent = count;
    });

    // 清空功能
    clearBtn.addEventListener('click', function() {
        thesisText.value = '';
        currentCount.textContent = '0';
        aiScore.textContent = '0';
        analysisDetails.innerHTML = '<p>请输入文本开始分析...</p>';
    });

    // 复制功能
    copyBtn.addEventListener('click', function() {
        const text = thesisText.value;
        if (!text.trim()) {
            alert('没有可复制的内容');
            return;
        }
        navigator.clipboard.writeText(text)
            .then(() => alert('内容已复制到剪贴板'))
            .catch(err => console.error('复制失败:', err));
    });

    // 分析功能
    analyzeBtn.addEventListener('click', function() {
        const text = thesisText.value.trim();
        if (!text) {
            alert('请输入需要检测的论文内容');
            return;
        }

        // 显示加载状态
        aiScore.textContent = '...';
        analysisDetails.innerHTML = '<p>正在分析中...</p>';

        // 模拟分析过程
        setTimeout(() => {
            const result = analyzeThesis(text);
            displayResults(result);
        }, 2000);
    });

    // 论文分析函数
    function analyzeThesis(text) {
        // 这里实现实际的分析逻辑
        const wordCount = text.length;
        const sentences = text.split(/[。！？.!?]+/).filter(s => s.trim());
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        
        // 模拟AI检测结果
        const aiProbability = Math.floor(Math.random() * 100);
        
        return {
            aiProbability,
            wordCount,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            suggestions: generateSuggestions(aiProbability)
        };
    }

    // 生成建议
    function generateSuggestions(aiProbability) {
        if (aiProbability > 70) {
            return [
                '建议重新组织论文内容',
                '尝试使用更多学术性表达',
                '增加原创性研究内容'
            ];
        } else if (aiProbability > 40) {
            return [
                '可以适当调整部分表达',
                '建议增加更多专业术语'
            ];
        } else {
            return ['论文AI特征较低，可以保持当前写作风格'];
        }
    }

    // 显示分析结果
    function displayResults(result) {
        aiScore.textContent = result.aiProbability;
        
        analysisDetails.innerHTML = `
            <div class="analysis-report">
                <h4>详细分析</h4>
                <p>字数：${result.wordCount}</p>
                <p>句子数：${result.sentenceCount}</p>
                <p>段落数：${result.paragraphCount}</p>
                <div class="suggestions">
                    <h5>改进建议：</h5>
                    <ul>
                        ${result.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
});

async function analyzeText(content) {
    // 基础文本分析
    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const sentenceCount = content.split(/[.!?]+/).length - 1;
    
    // 计算可读性指标
    const readabilityScore = calculateReadability(content);
    
    // 关键词提取
    const keywords = extractKeywords(content);
    
    return {
        wordCount,
        charCount,
        sentenceCount,
        readabilityScore,
        keywords
    };
}

function calculateReadability(text) {
    // 实现可读性计算算法
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length - 1;
    const syllables = countSyllables(text);
    
    // 使用 Flesch Reading Ease 公式
    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

function extractKeywords(text) {
    // 关键词提取算法实现
    const words = text.toLowerCase().match(/\b\w+\b/g);
    const frequency = {};
    
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
} 