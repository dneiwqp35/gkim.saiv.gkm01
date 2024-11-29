document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const currentCount = document.getElementById('current-count');
    const aiScore = document.getElementById('ai-score');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const detectBtn = document.getElementById('detect-btn');

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
        resultText.innerHTML = '<p>检测结果将在这里显示...</p>';
    });

    // 复制功能
    copyBtn.addEventListener('click', function() {
        const text = inputText.value;
        if (!text.trim()) {
            alert('没有可复制的内容');
            return;
        }
        navigator.clipboard.writeText(text)
            .then(() => alert('内容已复制到剪贴板'))
            .catch(err => console.error('复制失败:', err));
    });

    // AI检测功能
    detectBtn.addEventListener('click', function() {
        const text = inputText.value.trim();
        if (!text) {
            alert('请输入需要检测的内容');
            return;
        }

        // 显示加载状态
        resultText.innerHTML = '<p>正在检测中...</p>';
        aiScore.textContent = '...';

        // 模拟检测过程
        setTimeout(() => {
            const result = detectAIContent(text);
            displayResults(result);
        }, 1500);
    });

    // AI内容检测函数
    function detectAIContent(text) {
        // 1. 基础特征检测
        const basicFeatures = analyzeBasicFeatures(text);
        
        // 2. 语言模式分析
        const languagePatterns = analyzeLanguagePatterns(text);
        
        // 3. 结构特征分析
        const structuralFeatures = analyzeStructure(text);
        
        // 4. 计算综合得分
        const score = calculateOverallScore(basicFeatures, languagePatterns, structuralFeatures);

        return {
            score,
            features: {
                basic: basicFeatures,
                language: languagePatterns,
                structural: structuralFeatures
            }
        };
    }

    // 基础特征分析
    function analyzeBasicFeatures(text) {
        const features = {
            avgSentenceLength: 0,
            wordVariety: 0,
            punctuationRatio: 0
        };

        const sentences = text.split(/[。！？]/);
        const words = text.match(/[\u4e00-\u9fa5]+/g) || [];
        const punctuations = text.match(/[，。！？；：""'']/g) || [];

        features.avgSentenceLength = words.length / sentences.length;
        features.wordVariety = new Set(words).size / words.length;
        features.punctuationRatio = punctuations.length / text.length;

        return features;
    }

    // 语言模式分析
    function analyzeLanguagePatterns(text) {
        const patterns = {
            formalPhrases: 0,
            transitionWords: 0,
            academicTerms: 0
        };

        // 检测正式用语
        const formalPhrases = [
            '因此', '然而', '此外', '换言之', '总的来说',
            '毋庸置疑', '不可否认', '显而易见', '值得注意'
        ];

        // 检测过渡词
        const transitionWords = [
            '首先', '其次', '最后', '另外', '此外',
            '同时', '而且', '不仅', '除此之外'
        ];

        // 统计模式出现次数
        formalPhrases.forEach(phrase => {
            const matches = text.match(new RegExp(phrase, 'g'));
            if (matches) {
                patterns.formalPhrases += matches.length;
            }
        });

        transitionWords.forEach(word => {
            const matches = text.match(new RegExp(word, 'g'));
            if (matches) {
                patterns.transitionWords += matches.length;
            }
        });

        return patterns;
    }

    // 结构特征分析
    function analyzeStructure(text) {
        const structure = {
            paragraphCount: 0,
            avgParagraphLength: 0,
            structureComplexity: 0
        };

        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        structure.paragraphCount = paragraphs.length;
        structure.avgParagraphLength = text.length / paragraphs.length;
        
        // 计算结构复杂度
        const hasIntro = /^[然而|首先|就|关于]/.test(text);
        const hasConclusion = /[总之|总而言之|综上所述|最后]/.test(text);
        const hasTransitions = paragraphs.some(p => /[此外|另外|其次|接下来]/.test(p));

        structure.structureComplexity = (hasIntro ? 0.3 : 0) + 
                                      (hasConclusion ? 0.3 : 0) + 
                                      (hasTransitions ? 0.4 : 0);

        return structure;
    }

    // 计算综合得分
    function calculateOverallScore(basic, language, structural) {
        // 各项权重
        const weights = {
            sentenceLength: 0.15,
            wordVariety: 0.2,
            punctuation: 0.1,
            formalPhrases: 0.2,
            transitions: 0.15,
            structure: 0.2
        };

        let score = 0;
        
        // 基础特征得分
        score += (basic.avgSentenceLength / 30) * weights.sentenceLength;
        score += basic.wordVariety * weights.wordVariety;
        score += basic.punctuationRatio * weights.punctuation;

        // 语言模式得分
        const textLength = 1000; // 标准化长度
        score += (language.formalPhrases / (textLength / 100)) * weights.formalPhrases;
        score += (language.transitionWords / (textLength / 100)) * weights.transitions;

        // 结构特征得分
        score += structural.structureComplexity * weights.structure;

        // 归一化到0-100
        return Math.min(Math.round(score * 100), 100);
    }

    // 显示检测结果
    function displayResults(result) {
        aiScore.textContent = result.score;
        
        resultText.innerHTML = `
            <div class="detection-result">
                <h4>详细分析报告</h4>
                <div class="feature-analysis">
                    <h5>基础特征分析：</h5>
                    <ul>
                        <li>平均句长：${result.features.basic.avgSentenceLength.toFixed(2)} 字</li>
                        <li>词汇丰富度：${(result.features.basic.wordVariety * 100).toFixed(2)}%</li>
                        <li>标点使用率：${(result.features.basic.punctuationRatio * 100).toFixed(2)}%</li>
                    </ul>
                    
                    <h5>语言模式分析：</h5>
                    <ul>
                        <li>形式化用语：${result.features.language.formalPhrases} 处</li>
                        <li>过渡词使用：${result.features.language.transitionWords} 处</li>
                    </ul>
                    
                    <h5>结构特征分析：</h5>
                    <ul>
                        <li>段落数量：${result.features.structural.paragraphCount}</li>
                        <li>平均段落长度：${result.features.structural.avgParagraphLength.toFixed(2)} 字</li>
                        <li>结构完整度：${(result.features.structural.structureComplexity * 100).toFixed(2)}%</li>
                    </ul>
                </div>
                
                <div class="conclusion">
                    <h5>检测结论：</h5>
                    <p>${getConclusion(result.score)}</p>
                </div>
            </div>
        `;
    }

    // 生成结论
    function getConclusion(score) {
        if (score > 80) {
            return '该文本极有可能由AI生成，建议进行人工改写。';
        } else if (score > 60) {
            return '该文本可能包含AI生成的内容，建议部分修改。';
        } else if (score > 40) {
            return '该文本AI特征适中，可以适当优化。';
        } else {
            return '该文本AI特征较低，符合人工写作特点。';
        }
    }
}); 