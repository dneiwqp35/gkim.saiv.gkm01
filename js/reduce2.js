document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const currentCount = document.getElementById('current-count');
    const aiScore = document.getElementById('ai-score');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const optimizeBtn = document.getElementById('optimize-btn');

    // 字数统计
    inputText.addEventListener('input', function() {
        const count = this.value.length;
        currentCount.textContent = count;
        if (count > 5000) {
            this.value = this.value.substring(0, 5000);
            currentCount.textContent = 5000;
        }
    });

    // 清空功能
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        currentCount.textContent = '0';
        aiScore.textContent = '0';
        resultText.innerHTML = '<p>优化结果将在这里显示...</p>';
    });

    // 复制功能
    copyBtn.addEventListener('click', function() {
        const resultContent = resultText.querySelector('.optimized-text')?.textContent;
        if (!resultContent || resultContent === '优化结果将在这里显示...') {
            alert('没有可复制的内容');
            return;
        }
        navigator.clipboard.writeText(resultContent)
            .then(() => alert('内容已复制到剪贴板'))
            .catch(err => console.error('复制失败:', err));
    });

    // 深度优化功能
    optimizeBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (!text) {
            alert('请输入需要优化的内容');
            return;
        }

        // 显示加载状态
        resultText.innerHTML = '<p>正在进行深度优化...</p>';
        aiScore.textContent = '...';

        // 模拟处理过程
        setTimeout(() => {
            const optimizedResult = deepOptimize(text);
            displayResults(optimizedResult);
        }, 2000);
    });

    // 深度优化函数
    function deepOptimize(text) {
        let optimized = text;
        
        // 1. 基础优化
        optimized = replaceAIPatterns(optimized);
        
        // 2. 句式重组
        optimized = restructureSentences(optimized);
        
        // 3. 增加个性化表达
        optimized = addPersonalization(optimized);
        
        // 4. 优化段落结构
        optimized = optimizeParagraphs(optimized);
        
        // 5. 深度语义优化
        optimized = semanticOptimization(optimized);

        return {
            text: optimized,
            originalScore: calculateAIScore(text),
            newScore: calculateAIScore(optimized),
            improvements: generateImprovementReport(text, optimized)
        };
    }

    // 替换AI特征明显的表达
    function replaceAIPatterns(text) {
        const patterns = {
            '首先': ['开始', '先说', '第一点'],
            '其次': ['接着', '再说', '第二点'],
            '最后': ['最终', '总的来说', '结束时'],
            '因此': ['所以', '这样一来', '那么'],
            '然而': ['不过', '但是', '可是'],
            '例如': ['比如', '就像', '举个例子'],
            '总之': ['总的来说', '简单来说', '一句话'],
            '显然': ['明显', '很清楚', '不难看出'],
            '事实上': ['实际上', '说实话', '老实说']
        };

        let result = text;
        for (let [pattern, replacements] of Object.entries(patterns)) {
            const replacement = replacements[Math.floor(Math.random() * replacements.length)];
            result = result.replace(new RegExp(pattern, 'g'), replacement);
        }
        return result;
    }

    // 句式重组
    function restructureSentences(text) {
        const sentences = text.split(/[。！？]/);
        return sentences.map(sentence => {
            if (!sentence.trim()) return '';
            
            // 随机调整句子结构
            if (Math.random() > 0.7) {
                const parts = sentence.split('，');
                if (parts.length > 1) {
                    // 随机重排句子片段
                    for (let i = parts.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [parts[i], parts[j]] = [parts[j], parts[i]];
                    }
                }
                return parts.join('，');
            }
            return sentence;
        }).filter(s => s).join('。') + '。';
    }

    // 增加个性化表达
    function addPersonalization(text) {
        const personalMarkers = [
            '我觉得', '依我看', '按我的理解',
            '个人认为', '在我看来', '我的想法是'
        ];
        
        const sentences = text.split('。');
        return sentences.map(sentence => {
            if (sentence.trim() && Math.random() > 0.8) {
                const marker = personalMarkers[Math.floor(Math.random() * personalMarkers.length)];
                return marker + '，' + sentence;
            }
            return sentence;
        }).join('。');
    }

    // 优化段落结构
    function optimizeParagraphs(text) {
        const paragraphs = text.split(/\n\s*\n/);
        return paragraphs.map(para => {
            if (!para.trim()) return '';
            
            // 添加过渡词
            const transitions = ['另外', '此外', '同时', '不仅如此', '值得注意的是'];
            if (Math.random() > 0.7) {
                const transition = transitions[Math.floor(Math.random() * transitions.length)];
                return transition + '，' + para;
            }
            return para;
        }).join('\n\n');
    }

    // 深度语义优化
    function semanticOptimization(text) {
        // 替换常见的书面语表达
        const formalExpressions = {
            '导致': ['引起', '造成', '致使'],
            '表明': ['说明', '显示', '证实'],
            '认为': ['觉得', '以为', '想'],
            '需要': ['要', '得', '应该'],
            '获得': ['得到', '拿到', '取得']
        };

        let result = text;
        for (let [formal, casual] of Object.entries(formalExpressions)) {
            if (Math.random() > 0.5) {
                const replacement = casual[Math.floor(Math.random() * casual.length)];
                result = result.replace(new RegExp(formal, 'g'), replacement);
            }
        }
        return result;
    }

    // 生成改进报告
    function generateImprovementReport(original, optimized) {
        return {
            sentenceCount: {
                original: original.split(/[。！？]/).length,
                optimized: optimized.split(/[。！？]/).length
            },
            paragraphCount: {
                original: original.split(/\n\s*\n/).length,
                optimized: optimized.split(/\n\s*\n/).length
            },
            improvements: [
                '优化了句式结构',
                '增加了个性化表达',
                '改善了段落组织',
                '降低了形式化表达',
                '提升了文本自然度'
            ]
        };
    }

    // 计算AI特征分数
    function calculateAIScore(text) {
        const aiPatterns = [
            /首先|其次|最后/g,
            /因此|然而|例如/g,
            /总之|显然|事实上/g,
            /值得注意的是|需要指出的是/g,
            /不可否认|毋庸置疑|显而易见/g
        ];

        let score = 0;
        aiPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                score += matches.length * 5;
            }
        });

        return Math.min(Math.round(score / (text.length / 100)), 100);
    }

    // 显示结果
    function displayResults(result) {
        aiScore.textContent = result.newScore;
        
        resultText.innerHTML = `
            <div class="optimization-result">
                <h4>深度优化后的文本：</h4>
                <div class="optimized-text">${result.text}</div>
                <div class="score-comparison">
                    <p>原文AI特征：${result.originalScore}%</p>
                    <p>优化后AI特征：${result.newScore}%</p>
                </div>
                <div class="improvement-details">
                    <h5>优化详情：</h5>
                    <ul>
                        <li>句子数量：${result.improvements.sentenceCount.original} → ${result.improvements.sentenceCount.optimized}</li>
                        <li>段落数量：${result.improvements.paragraphCount.original} → ${result.improvements.paragraphCount.optimized}</li>
                    </ul>
                    <h5>改进项目：</h5>
                    <ul>
                        ${result.improvements.improvements.map(imp => `<li>${imp}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
}); 