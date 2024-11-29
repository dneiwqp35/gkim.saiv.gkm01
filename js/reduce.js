document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const currentCount = document.getElementById('current-count');
    const aiScore = document.getElementById('ai-score');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const reduceBtn = document.getElementById('reduce-btn');

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
        const resultContent = resultText.textContent;
        if (resultContent === '优化结果将在这里显示...') {
            alert('没有可复制的内容');
            return;
        }
        navigator.clipboard.writeText(resultContent)
            .then(() => alert('内容已复制到剪贴板'))
            .catch(err => console.error('复制失败:', err));
    });

    // 降AI功能
    reduceBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (!text) {
            alert('请输入需要优化的内容');
            return;
        }

        // 显示加载状态
        resultText.innerHTML = '<p>正在优化中...</p>';
        aiScore.textContent = '...';

        // 模拟处理过程
        setTimeout(() => {
            const optimizedResult = reduceAIFeatures(text);
            displayResults(optimizedResult);
        }, 1500);
    });

    // 降低AI特征的核心函数
    function reduceAIFeatures(text) {
        let optimized = text;
        
        // 1. 替换常见AI风格用语
        optimized = replaceAIPatterns(optimized);
        
        // 2. 增加语气词和口语化表达
        optimized = addConversationalElements(optimized);
        
        // 3. 调整句式结构
        optimized = restructureSentences(optimized);
        
        // 4. 随机化表达方式
        optimized = randomizeExpressions(optimized);

        return {
            text: optimized,
            originalScore: calculateAIScore(text),
            newScore: calculateAIScore(optimized)
        };
    }

    // 替换AI风格用语
    function replaceAIPatterns(text) {
        const patterns = {
            '因此': ['所以', '因而', '于是'],
            '然而': ['不过', '但是', '可是'],
            '例如': ['比如', '像是', '譬如'],
            '总之': ['总的来说', '简单来说', '一句话']
        };

        let result = text;
        for (let [pattern, replacements] of Object.entries(patterns)) {
            const replacement = replacements[Math.floor(Math.random() * replacements.length)];
            result = result.replace(new RegExp(pattern, 'g'), replacement);
        }
        return result;
    }

    // 添加口语化元素
    function addConversationalElements(text) {
        const conversationalMarkers = ['嗯', '呢', '啊', '哦', '呀'];
        const sentences = text.split(/[。！？]/);
        
        return sentences.map(sentence => {
            if (sentence.trim() && Math.random() > 0.7) {
                const marker = conversationalMarkers[Math.floor(Math.random() * conversationalMarkers.length)];
                return sentence + marker;
            }
            return sentence;
        }).join('。');
    }

    // 调整句式结构
    function restructureSentences(text) {
        return text.split('。').map(sentence => {
            if (sentence.trim() && Math.random() > 0.8) {
                // 随机调整句子结构
                const parts = sentence.split('，');
                if (parts.length > 1) {
                    return parts.reverse().join('，');
                }
            }
            return sentence;
        }).join('。');
    }

    // 随机化表达方式
    function randomizeExpressions(text) {
        const expressions = {
            '非常': ['很', '特别', '相当'],
            '可以': ['能够', '可以说', '算是'],
            '认为': ['觉得', '感觉', '想着']
        };

        let result = text;
        for (let [word, alternatives] of Object.entries(expressions)) {
            if (Math.random() > 0.5) {
                const alternative = alternatives[Math.floor(Math.random() * alternatives.length)];
                result = result.replace(new RegExp(word, 'g'), alternative);
            }
        }
        return result;
    }

    // 计算AI特征分数
    function calculateAIScore(text) {
        // 简单的AI特征评分算法
        const aiPatterns = [
            /因此/g, /然而/g, /例如/g, /总之/g,
            /显然/g, /毋庸置疑/g, /不可否认/g,
            /换言之/g, /换句话说/g, /具体来说/g
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
                <h4>优化后的文本：</h4>
                <p>${result.text}</p>
                <div class="score-comparison">
                    <p>原文AI特征：${result.originalScore}%</p>
                    <p>优化后AI特征：${result.newScore}%</p>
                </div>
                <div class="tips">
                    <h5>优化提示：</h5>
                    <ul>
                        <li>已替换部分机器化表达</li>
                        <li>增加了语气词和口语化表达</li>
                        <li>调整了部分句式结构</li>
                        <li>随机化了某些达方式</li>
                    </ul>
                </div>
            </div>
        `;
    }
}); 