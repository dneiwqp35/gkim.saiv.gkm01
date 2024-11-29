document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const resultText = document.getElementById('result-text');
    const currentCount = document.getElementById('current-count');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const editBtn = document.getElementById('editBtn');
    const clearBtn = document.getElementById('clearBtn');
    const styleButtons = document.querySelectorAll('.style-btn');

    let selectedStyle = 'casual';

    // 字数统计
    inputText.addEventListener('input', function() {
        const count = this.value.length;
        currentCount.textContent = count;
        if (count > 5000) {
            this.value = this.value.substring(0, 5000);
            currentCount.textContent = 5000;
        }
    });

    // 风格选择
    styleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            styleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedStyle = this.dataset.style;
        });
    });

    // 分析按钮
    analyzeBtn.addEventListener('click', function() {
        if (!inputText.value.trim()) {
            alert('请输入需要分析的内容');
            return;
        }

        const analysis = analyzeText(inputText.value);
        resultText.innerHTML = `
            <div class="analysis-result">
                <h3>文本分析结果</h3>
                <p>字数：${analysis.charCount}</p>
                <p>词数：${analysis.wordCount}</p>
                <p>句子数：${analysis.sentenceCount}</p>
                <p>段落数：${analysis.paragraphCount}</p>
                <p>平均句子长度：${analysis.avgSentenceLength.toFixed(1)}词</p>
                <p>文本复杂度：${analysis.complexity}%</p>
            </div>
        `;
    });

    // 编辑按钮
    editBtn.addEventListener('click', async function() {
        if (!inputText.value.trim()) {
            alert('请输入需要编辑的内容');
            return;
        }

        // 显示加载状态
        resultText.innerHTML = '<p class="loading">正在智能编辑中...</p>';

        try {
            // 获取选中的风格
            const style = document.querySelector('.style-btn.active').dataset.style;
            
            // 发送请求到本地服务器
            const response = await fetch('http://localhost:3000/api/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    text: inputText.value,
                    style: style
                })
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                resultText.innerHTML = `
                    <div class="edit-result">
                        <div class="edited-text">
                            ${result.data.editedText}
                        </div>
                        <div class="suggestions">
                            ${result.data.suggestions.map(s => `<p>• ${s}</p>`).join('')}
                        </div>
                    </div>
                `;
            } else {
                throw new Error(result.message || '处理失败');
            }
        } catch (error) {
            console.error('处理错误:', error);
            resultText.innerHTML = `<p class="error">编辑失败: ${error.message}</p>`;
        }
    });

    // 清除按钮
    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        currentCount.textContent = '0';
        resultText.innerHTML = '<p>请输入文本开始分析或编辑...</p>';
    });

    // 复制结果功能
    document.getElementById('copyBtn').addEventListener('click', function() {
        const resultText = document.getElementById('result-text').innerText;
        navigator.clipboard.writeText(resultText).then(() => {
            // 显示复制成功提示
            this.innerHTML = '<i class="fas fa-check"></i> 已复制';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-copy"></i> 复制结果';
            }, 2000);
        });
    });

    // 更新显示风格
    function updateStyle(style) {
        const styleMap = {
            'casual': '轻松休闲',
            'formal': '正式',
            'academic': '学术'
        };
        document.getElementById('currentStyle').textContent = styleMap[style];
    }

    // 格式化输出结果
    function formatResult(text, style) {
        const styleInfo = {
            casual: {
                name: '轻松休闲风格',
                description: '使用轻松自然的语言，适合日常交流和娱乐内容'
            },
            formal: {
                name: '正式式风格',
                description: '使用规范严谨的语言，适合商务和正式场合'
            },
            academic: {
                name: '学术风格',
                description: '使用专业严谨的语言，适合学术研究和专业讨论'
            }
        };

        return `<div class="edit-result ${style}-style">
            <div class="style-info">
                <div class="style-tag">${styleInfo[style].name}</div>
                <div class="style-description">${styleInfo[style].description}</div>
            </div>
            <div class="content">
                ${text.split('\n').map(line => 
                    line.trim() ? `<p class="paragraph">${line}</p>` : ''
                ).join('')}
            </div>
        </div>`;
    }

    // 更新结果显示
    function updateResult(text) {
        const resultContainer = document.getElementById('result-text');
        resultContainer.innerHTML = formatResult(text);
    }

    // 复制功能
    document.getElementById('copyBtn').addEventListener('click', function() {
        const resultText = document.getElementById('result-text').innerText;
        navigator.clipboard.writeText(resultText).then(() => {
            this.innerHTML = '<i class="fas fa-check"></i> 已复制';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-copy"></i> 复制结果';
            }, 2000);
        });
    });
});

// 文本分析函数
function analyzeText(text) {
    return {
        charCount: text.length,
        wordCount: text.trim().split(/\s+/).length,
        sentenceCount: text.split(/[.!?。！？]+/).length,
        paragraphCount: text.split(/\n\s*\n/).length,
        avgSentenceLength: text.trim().split(/\s+/).length / text.split(/[.!?。！？]+/).length,
        complexity: calculateComplexity(text)
    };
}

// 计算文本复杂度
function calculateComplexity(text) {
    const words = text.trim().split(/\s+/);
    const longWords = words.filter(word => word.length > 6).length;
    return Math.round((longWords / words.length) * 100);
}

// 修改发送请求的函数
async function sendToServer(text, style) {
    try {
        const response = await fetch('http://localhost:3000/api/edit', {  // 使用完整的URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                text: text,
                style: style
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('请求错误:', error);
        throw error;
    }
}

// 提取关键词和主题
function extractKeywords(structure) {
    return {
        characters: ['李薇', '秦风'],
        locations: ['咖啡馆', '公司'],
        events: ['偶遇', '项目合作', '再次相遇'],
        emotions: ['好感', '怀疑', '期待'],
        relationships: ['同事', '朋友'],
        themes: ['都市邂逅', '职场关系', '情感发展']
    };
}

// 动态生成轻松休闲风格的开场
function generateCasualIntro(keywords) {
    const intros = [
        `嘿，想听一个关于${keywords.characters[0]}和${keywords.characters[1]}的有趣故事吗？`,
        `在这个阳光明媚的下午，让我来讲述一个发生在${keywords.locations[0]}的温馨故事~`,
        `你相信命运的安排吗？来听听这个关于${keywords.themes[0]}的暖心故事吧！`
    ];
    return intros[Math.floor(Math.random() * intros.length)];
}

// 动态生成正式风格的开场
function generateFormalIntro(keywords) {
    const intros = [
        `现就${keywords.themes[0]}与${keywords.themes[1]}之间的关系展开叙述。`,
        `本文将详细描述${keywords.characters[0]}与${keywords.characters[1]}的职场交集。`,
        `兹就一发生在${keywords.locations[0]}的都市际遇进行描述。`
    ];
    return intros[Math.floor(Math.random() * intros.length)];
}

// 动态生成学术风格的开场
function generateAcademicIntro(keywords) {
    const intros = [
        `本研究旨在探讨现代都市${keywords.themes[0]}现象，以${keywords.characters[0]}和${keywords.characters[1]}的互动为例。`,
        `通过对${keywords.locations[0]}场域中的社交行为观察，探析都市青年的情感互动模式。`,
        `本文将从社会学视角分析${keywords.themes[1]}对都市青年情感发展的影响。`
    ];
    return intros[Math.floor(Math.random() * intros.length)];
}

// 动态生成场景描述函数
function generateSceneDescription(keywords, style) {
    // 根据不同风格生成相应的场景描述
    const scenes = {
        casual: [
            `${keywords.locations[0]}里飘着咖啡香，${keywords.characters[0]}正专注地写着什么，这时${keywords.characters[1]}推开了门...`,
            `阳光正好，${keywords.characters[0]}坐在${keywords.locations[0]}的角落，突然间，一个身影引起了她的注意...`
        ],
        formal: [
            `在${keywords.locations[0]}的专业环境中，${keywords.characters[0]}展现出其职业素养，而${keywords.characters[1]}的出现则为故事增添了新的维度。`,
            `${keywords.locations[0]}内，${keywords.characters[0]}正专注于工作，${keywords.characters[1]}的到来使得情况发生转变。`
        ],
        academic: [
            `研究表明，${keywords.locations[0]}作为都市社交空间，为${keywords.themes[0]}提供了理想的观察场域。`,
            `通过对${keywords.characters[0]}与${keywords.characters[1]}的互动行为分析，可见现代都市青年的社交模式呈现出新的特征。`
        ]
    };
    
    return scenes[style][Math.floor(Math.random() * scenes[style].length)];
}

// 修改请求处理部分
async function processText(text, style) {
    try {
        const response = await fetch('http://localhost:3000/api/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                style: style
            })
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            resultText.innerHTML = `
                <div class="result-content">
                    <p>${result.data.editedText.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p>建议：</p>
                    <ul>
                        ${result.data.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            throw new Error('处理失败');
        }
    } catch (error) {
        console.error('错误:', error);
        resultText.innerHTML = '<p class="error">处理失败，请重试</p>';
    }
} 