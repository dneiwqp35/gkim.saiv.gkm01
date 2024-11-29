document.addEventListener('DOMContentLoaded', function() {
    const originalText = document.getElementById('original-text');
    const compareText = document.getElementById('compare-text');
    const similarityScore = document.getElementById('similarity-score');
    const comparisonDetails = document.getElementById('comparison-details');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const compareBtn = document.getElementById('compare-btn');

    // 清空功能
    clearBtn.addEventListener('click', function() {
        originalText.value = '';
        compareText.value = '';
        similarityScore.textContent = '0%';
        comparisonDetails.innerHTML = '<p>请输入文本开始对比分析</p>';
    });

    // 复制功能
    copyBtn.addEventListener('click', function() {
        const textToCopy = `原文：\n${originalText.value}\n\n对比文本：\n${compareText.value}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('内容已复制到剪贴板'))
            .catch(err => console.error('复制失败:', err));
    });

    // 相似度对比功能
    compareBtn.addEventListener('click', function() {
        if (!originalText.value.trim() || !compareText.value.trim()) {
            alert('请输入需要对比的两段文本！');
            return;
        }

        const similarity = getSimilarityScore(originalText.value, compareText.value);
        const report = generateAnalysisReport(originalText.value, compareText.value, similarity);
        
        // 更新相似度显示
        similarityScore.textContent = `${(similarity * 100).toFixed(2)}%`;
        
        // 显示详细分析报告
        displayAnalysisReport(report);
    });

    function getSimilarityScore(str1, str2) {
        // 使用 Levenshtein 距离算法计算相似度
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) {
            return 1.0;
        }
        
        const costs = [];
        for (let i = 0; i <= longer.length; i++) {
            costs[i] = i;
        }
        
        for (let i = 1; i <= shorter.length; i++) {
            costs[0] = i;
            let nw = i - 1;
            for (let j = 1; j <= longer.length; j++) {
                const cj = Math.min(
                    costs[j] + 1,
                    costs[j - 1] + 1,
                    nw + (shorter[i - 1] === longer[j - 1] ? 0 : 1)
                );
                nw = costs[j];
                costs[j] = cj;
            }
        }
        
        return (longer.length - costs[longer.length]) / longer.length;
    }

    // 生成分析报告
    function generateAnalysisReport(text1, text2, similarity) {
        const commonPhrases = findCommonPhrases(text1, text2);
        return {
            similarity: (similarity * 100).toFixed(2),
            details: {
                lengthDiff: Math.abs(text1.length - text2.length),
                commonPhrases: commonPhrases,
                suggestions: generateSuggestions(similarity)
            }
        };
    }

    // 显示分析报告
    function displayAnalysisReport(report) {
        let commonPhrasesHtml = '';
        if (report.details.commonPhrases.length > 0) {
            commonPhrasesHtml = `
                <div class="common-phrases">
                    <h5>重复短语：</h5>
                    <ul>
                        ${report.details.commonPhrases.map(phrase => `<li>${phrase}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        comparisonDetails.innerHTML = `
            <div class="analysis-report">
                <h4>分析报告</h4>
                <p>文本相似度：${report.similarity}%</p>
                <p>长度差异：${report.details.lengthDiff}字符</p>
                ${commonPhrasesHtml}
                <div class="suggestions">
                    <h5>优化建议：</h5>
                    <ul>
                        ${report.details.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // 生成优化建议
    function generateSuggestions(similarity) {
        if (similarity > 0.7) {
            return [
                '建议重新组织文章结构',
                '尝试使用不同的表达方式',
                '增加原创内容和观点'
            ];
        } else if (similarity > 0.4) {
            return [
                '可以适当调整部分表达',
                '建议增加更多独特观点'
            ];
        } else {
            return ['文本相似度较低，可以保持当前写作风格'];
        }
    }

    // 查找共同短语
    function findCommonPhrases(text1, text2) {
        // 提取4个及以上的中文字符作为短语
        const phrases1 = text1.match(/[\u4e00-\u9fa5]{4,}/g) || [];
        const phrases2 = text2.match(/[\u4e00-\u9fa5]{4,}/g) || [];
        return phrases1.filter(phrase => phrases2.includes(phrase));
    }
});