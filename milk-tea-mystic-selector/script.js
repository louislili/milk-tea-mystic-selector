// 奶茶玄学选择器 - 核心逻辑
class MilkTeaMysticSelector {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('teaHistory') || '[]');
        this.currentBuff = null;
        this.mysticalPower = Math.floor(Math.random() * 100) + 1;
        
        // 互动统计
        this.stats = JSON.parse(localStorage.getItem('teaStats') || '{"dailyCount": 0, "comboCount": 0, "luckValue": 50, "totalSelections": 0, "lastDate": ""}');
        this.achievements = JSON.parse(localStorage.getItem('teaAchievements') || '[]');
        this.pendingRewards = JSON.parse(localStorage.getItem('pendingRewards') || '[]');
        
        // 检查是否是新的一天
        const today = new Date().toDateString();
        if (this.stats.lastDate !== today) {
            this.stats.dailyCount = 0;
            this.stats.comboCount = 0;
            this.stats.lastDate = today;
            this.saveStats();
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDailyAdvice();
        this.updateFortune();
        this.loadHistory();
        this.updateStats();
        this.initAchievements();
        this.checkPendingRewards();
        this.startMysticalEffects();
    }

    // 奶茶选择映射
    teaMapping = {
        '水逆': {
            tea: '全糖珍珠奶茶',
            blessing: '水逆退散，甜蜜加持！',
            ritual: '前摇三下敬奶茶之神，然后大声说"水逆退散"',
            icon: '💧✨',
            power: 85
        },
        '桃花': {
            tea: '草莓奶盖加椰果',
            blessing: '桃花爆棚，今晚奶茶店必遇帅哥！',
            ritual: '喝奶茶时要对着镜子微笑，增强桃花运',
            icon: '🌸💕',
            power: 90
        },
        '财运': {
            tea: '金桔柠檬茶',
            blessing: '财运亨通，金桔招财！',
            ritual: '喝第一口时心中默念"财源滚滚来"',
            icon: '💰🍋',
            power: 80
        },
        '学业': {
            tea: '抹茶拿铁',
            blessing: '智慧加持，学业有成！',
            ritual: '喝茶时要保持专注，每一口都是知识的积累',
            icon: '📚🍃',
            power: 75
        },
        '健康': {
            tea: '无糖绿茶',
            blessing: '清心寡欲，身体健康！',
            ritual: '慢慢品味，感受茶香带来的宁静',
            icon: '🍃💚',
            power: 70
        },
        '随机': {
            tea: '奶茶之神的神秘调配',
            blessing: '听天由命，神秘祝福！',
            ritual: '闭上眼睛，让奶茶之神为你选择最适合的味道',
            icon: '🎲✨',
            power: 95
        },
        '事业': {
            tea: '黑糖珍珠鲜奶',
            blessing: '事业运上升，干劲满满！',
            ritual: '写下今日目标并小口品尝，坚定心志',
            icon: '💼✨',
            power: 88
        },
        '社交': {
            tea: '杨枝甘露',
            blessing: '社交顺利，魅力加持！',
            ritual: '对着杯子微笑三秒，心中默念“人缘提升”',
            icon: '🤝💬',
            power: 82
        },
        '家庭': {
            tea: '椰椰奶茶',
            blessing: '家庭和睦，温馨陪伴！',
            ritual: '与家人共享一口奶茶，心连心',
            icon: '🏠❤️',
            power: 80
        },
        '旅行': {
            tea: '鲜果茶',
            blessing: '旅途顺利，活力满满！',
            ritual: '看一眼地图，喝一口果茶，启程更顺',
            icon: '✈️🍊',
            power: 78
        },
        '创意': {
            tea: '芝士乌龙',
            blessing: '灵感爆发，创意加持！',
            ritual: '闻茶香五秒，闭眼想象创意画面',
            icon: '🎨💡',
            power: 86
        },
        '睡眠': {
            tea: '桂花乌龙（低咖）',
            blessing: '好眠安稳，舒缓身心！',
            ritual: '深呼吸三次，感受桂花清香入心',
            icon: '😴🌙',
            power: 76
        }
    };

    // 玄学buff系统
    mysticalBuffs = [
        { name: '奶茶之神的眷顾', effect: '今日所有奶茶都会特别好喝', probability: 0.1 },
        { name: '甜蜜暴击', effect: '糖分加倍，心情加倍', probability: 0.15 },
        { name: '珍珠满满', effect: '每一口都有珍珠的惊喜', probability: 0.2 },
        { name: '奶盖丰盈', effect: '奶盖厚度超乎想象', probability: 0.18 },
        { name: '温度完美', effect: '无论何时，温度都刚刚好', probability: 0.12 },
        { name: '排队神速', effect: '永远不用排队等奶茶', probability: 0.08 },
        { name: '口味惊喜', effect: '会发现从未尝过的神奇口味', probability: 0.1 },
        { name: '价格优惠', effect: '今日奶茶全部半价', probability: 0.07 }
    ];

    // 今日宜忌数据
    dailyAdviceData = {
        good: [
            '加珍珠', '选奶盖', '要热饮', '加椰果', '选大杯', '加布丁',
            '要微糖', '选招牌', '加仙草', '要去冰', '选新品', '加红豆',
            '要温饮', '选经典', '加芋圆', '要少冰', '选果茶', '加燕麦'
        ],
        bad: [
            '喝冰的', '要全冰', '选无糖', '加咖啡', '选小杯', '要外带',
            '选苦茶', '加奶精', '要打包', '选过甜', '加色素', '要速饮',
            '选便宜', '加香精', '要凉的', '选酸的', '加防腐剂', '要急饮'
        ]
    };

    // 运势文案
    fortuneTexts = [
        '今日奶茶运势极佳，适合尝试新口味！',
        '水星逆行中，建议选择经典口味避免踩雷',
        '桃花运旺盛，粉色系奶茶会带来好运',
        '财运亨通，金色包装的奶茶是首选',
        '学业运上升，抹茶类饮品有助思考',
        '健康运平稳，建议选择少糖或无糖',
        '贵人运强，和朋友一起喝奶茶会有惊喜',
        '创意运爆棚，可以尝试自己调配口味'
    ];

    // 成就系统
    achievementDefinitions = [
        { id: 'first_choice', icon: '🌟', title: '初次占卜', desc: '完成第一次奶茶占卜', condition: () => this.stats.totalSelections >= 1 },
        { id: 'daily_master', icon: '📅', title: '今日达人', desc: '单日占卜5次', condition: () => this.stats.dailyCount >= 5 },
        { id: 'combo_king', icon: '🔥', title: '连击之王', desc: '达成10连击', condition: () => this.stats.comboCount >= 10 },
        { id: 'lucky_star', icon: '⭐', title: '幸运之星', desc: '幸运值达到80', condition: () => this.stats.luckValue >= 80 },
        { id: 'tea_addict', icon: '🧋', title: '奶茶成瘾', desc: '总共占卜50次', condition: () => this.stats.totalSelections >= 50 },
        { id: 'water_master', icon: '💧', title: '水逆克星', desc: '选择水逆退散10次', condition: () => this.getChoiceCount('水逆') >= 10 },
        { id: 'love_expert', icon: '💕', title: '桃花专家', desc: '选择桃花爆棚15次', condition: () => this.getChoiceCount('桃花') >= 15 },
        { id: 'fortune_hunter', icon: '💰', title: '财运猎手', desc: '选择财运亨通20次', condition: () => this.getChoiceCount('财运') >= 20 },
        { id: 'scholar', icon: '📚', title: '学霸本霸', desc: '选择学业有成25次', condition: () => this.getChoiceCount('学业') >= 25 },
        { id: 'health_guru', icon: '🍃', title: '养生大师', desc: '选择身体健康30次', condition: () => this.getChoiceCount('健康') >= 30 },
        { id: 'random_lover', icon: '🎲', title: '随缘达人', desc: '选择听天由命35次', condition: () => this.getChoiceCount('随机') >= 35 },
        { id: 'buff_collector', icon: '✨', title: 'Buff收集家', desc: '获得所有类型的buff', condition: () => this.getAllBuffsCollected() }
    ];

    // 奖励系统
    rewardTypes = [
        { type: 'luck_boost', name: '幸运加持', desc: '幸运值+10', icon: '🍀' },
        { type: 'combo_protect', name: '连击保护', desc: '下次失败不会断连击', icon: '🛡️' },
        { type: 'double_buff', name: '双倍Buff', desc: '下次获得双倍buff效果', icon: '⚡' },
        { type: 'mystery_gift', name: '神秘礼物', desc: '获得特殊奶茶配方', icon: '🎁' },
        { type: 'title_unlock', name: '称号解锁', desc: '解锁专属称号', icon: '👑' }
    ];

    setupEventListeners() {
        // 选择卡片点击事件
        document.querySelectorAll('.choice-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleChoice(e.currentTarget.dataset.choice);
            });
        });

        // 页面加载时的特效
        window.addEventListener('load', () => {
            this.playWelcomeEffect();
        });
    }

    handleChoice(choice) {
        // 移除之前的选中状态
        document.querySelectorAll('.choice-card').forEach(card => {
            card.classList.remove('selected');
        });

        // 添加选中状态
        event.currentTarget.classList.add('selected');

        // 更新统计
        this.updateStatsOnChoice();

        // 延迟显示结果，增加神秘感
        setTimeout(() => {
            this.processChoice(choice);
        }, 1000);

        // 播放选择音效（模拟）
        this.playSelectSound();
    }

    processChoice(choice) {
        try {
            // 检查玄学buff
            const buffResult = this.checkMysticalBuff();
            this.currentBuff = buffResult.buff || null;
            
            if (buffResult.hasError) {
                this.showWarning(buffResult.errorMessage);
                return;
            }

            // 获取奶茶推荐
            let teaResult;
            if (choice === '随机') {
                const choices = Object.keys(this.teaMapping).filter(c => c !== '随机');
                const randomChoice = choices[Math.floor(Math.random() * choices.length)];
                teaResult = this.teaMapping[randomChoice];
                teaResult.tea = '奶茶之神的神秘调配：' + teaResult.tea;
            } else {
                teaResult = this.teaMapping[choice];
            }

            // 应用buff效果
            if (buffResult.buff) {
                teaResult.blessing += ` 🎊 获得buff：${buffResult.buff.name} - ${buffResult.buff.effect}`;
            }

            // 显示结果（弹窗集中展示）
            this.showResult(teaResult, choice);

            // 统计选择类型
            this.stats.choiceStats = this.stats.choiceStats || {};
            this.stats.choiceStats[choice] = (this.stats.choiceStats[choice] || 0) + 1;
            this.saveStats();

            // 保存到历史
            this.saveToHistory(choice, teaResult);

            // 检查成就
            this.checkAchievements();

            // 随机触发额外祝福提示（保留原成功弹窗逻辑）
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    this.showSuccess('奶茶之神对你的选择很满意！你获得了额外的幸运加持！');
                }, 1800);
            }

        } catch (error) {
            this.showWarning('奶茶之神生气了！玄学系统出现了神秘故障...');
            console.error('选择处理错误:', error);
        }
    }

    checkMysticalBuff() {
        // 随机触发错误（增加趣味性）
        if (Math.random() < 0.05) {
            const errorMessages = [
                '你的玄学能量不足，需要先喝一杯奶茶充能！',
                '水星逆行影响了奶茶之神的判断力...',
                '你的奶茶业力不够，请多做善事！',
                '奶茶之神正在午休，请稍后再试...',
                '你的选择困难症太严重，连奶茶之神都困惑了！'
            ];
            return {
                hasError: true,
                errorMessage: errorMessages[Math.floor(Math.random() * errorMessages.length)]
            };
        }

        // 随机获得buff
        const buffChance = Math.random();
        let cumulativeProbability = 0;
        
        for (const buff of this.mysticalBuffs) {
            cumulativeProbability += buff.probability;
            if (buffChance < cumulativeProbability) {
                return { hasError: false, buff: buff };
            }
        }

        return { hasError: false, buff: null };
    }

    showResult(teaResult, choice) {
        // 更新弹窗内容
        const modal = document.getElementById('result-modal');
        const modalTea = document.getElementById('modal-tea');
        const modalBlessing = document.getElementById('modal-blessing');
        const modalRitual = document.getElementById('modal-ritual');
        const modalExtras = document.getElementById('modal-extras');

        modalTea.innerHTML = `${teaResult.icon} ${teaResult.tea}`;
        modalBlessing.textContent = teaResult.blessing;
        modalRitual.textContent = `🔮 神秘仪式：${teaResult.ritual}`;

        const extras = [];
        if (this.currentBuff) {
            extras.push(`✨ Buff：${this.currentBuff.name} - ${this.currentBuff.effect}`);
        }
        if (this.pendingRewards && this.pendingRewards.length > 0) {
            const r = this.pendingRewards[0];
            extras.push(`🎁 奖励：${r.name} - ${r.desc}`);
        }
        modalExtras.innerHTML = extras.length ? extras.map(e => `<div class="extra-item">${e}</div>`).join('') : '';

        // 显示弹窗并隐藏页面内结果区
        modal.classList.add('show');
        const resultArea = document.getElementById('result-area');
        if (resultArea) resultArea.classList.remove('show');

        // 添加特效
        this.addResultEffects();
    }

    addResultEffects() {
        // 创建飘落的奶茶表情
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createFallingEmoji();
            }, i * 200);
        }
    }

    createFallingEmoji() {
        const emojis = ['🧋', '🥤', '☕', '🍵', '🥛', '✨', '🌟', '💫'];
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * window.innerWidth}px;
            font-size: 2rem;
            z-index: 1000;
            pointer-events: none;
            animation: fall 3s linear forwards;
        `;

        document.body.appendChild(emoji);

        // 添加下落动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // 清理
        setTimeout(() => {
            emoji.remove();
            style.remove();
        }, 3000);
    }

    saveToHistory(choice, result) {
        const historyItem = {
            date: new Date().toLocaleString('zh-CN'),
            choice: choice,
            tea: result.tea,
            blessing: result.blessing,
            timestamp: Date.now()
        };

        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }

        localStorage.setItem('teaHistory', JSON.stringify(this.history));
        this.loadHistory();
    }

    loadHistory() {
        const historyList = document.getElementById('history-list');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">暂无占卜记录</p>';
            return;
        }

        historyList.innerHTML = this.history.map(item => `
            <div class="history-item">
                <strong>${item.date}</strong><br>
                选择：${item.choice} → ${item.tea}
            </div>
        `).join('');
    }

    updateDailyAdvice() {
        const goodAdvice = document.getElementById('good-advice');
        const badAdvice = document.getElementById('bad-advice');

        const todayGood = this.dailyAdviceData.good[Math.floor(Math.random() * this.dailyAdviceData.good.length)];
        const todayBad = this.dailyAdviceData.bad[Math.floor(Math.random() * this.dailyAdviceData.bad.length)];

        goodAdvice.textContent = todayGood;
        badAdvice.textContent = todayBad;
    }

    updateFortune() {
        const fortuneText = document.getElementById('fortune-text');
        const randomFortune = this.fortuneTexts[Math.floor(Math.random() * this.fortuneTexts.length)];
        
        // 打字机效果
        this.typeWriter(fortuneText, randomFortune, 50);
    }

    typeWriter(element, text, speed) {
        element.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    startMysticalEffects() {
        // 定期更新运势
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.updateFortune();
            }
        }, 30000);

        // 随机触发神秘效果
        setInterval(() => {
            if (Math.random() < 0.05) {
                this.triggerRandomMysticalEffect();
            }
        }, 10000);
    }

    triggerRandomMysticalEffect() {
        const effects = [
            () => this.createMysticalParticles(),
            () => this.flashMysticalLight(),
            () => this.playMysticalSound()
        ];

        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        randomEffect();
    }

    createMysticalParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.textContent = '✨';
            particle.style.cssText = `
                position: fixed;
                top: ${Math.random() * window.innerHeight}px;
                left: ${Math.random() * window.innerWidth}px;
                font-size: 1rem;
                z-index: 999;
                pointer-events: none;
                animation: sparkle 2s ease-out forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }

        // 添加闪烁动画
        if (!document.getElementById('sparkle-style')) {
            const style = document.createElement('style');
            style.id = 'sparkle-style';
            style.textContent = `
                @keyframes sparkle {
                    0% { opacity: 0; transform: scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                    100% { opacity: 0; transform: scale(0) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    flashMysticalLight() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
            z-index: 998;
            pointer-events: none;
            animation: flash 1s ease-out forwards;
        `;

        document.body.appendChild(flash);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            flash.remove();
            style.remove();
        }, 1000);
    }

    playWelcomeEffect() {
        // 欢迎特效
        this.createMysticalParticles();
        setTimeout(() => {
            this.flashMysticalLight();
        }, 500);
    }

    playSelectSound() {
        // 模拟音效（实际项目中可以使用Web Audio API）
        console.log('🔊 播放选择音效');
    }

    playMysticalSound() {
        // 模拟神秘音效
        console.log('🔊 播放神秘音效');
    }

    showWarning(message) {
        const modal = document.getElementById('warning-modal');
        const messageElement = document.getElementById('warning-message');
        messageElement.textContent = message;
        modal.classList.add('show');
    }

    showSuccess(message) {
        const modal = document.getElementById('success-modal');
        const messageElement = document.getElementById('success-message');
        messageElement.textContent = message;
        modal.classList.add('show');
    }

    // 统计相关函数
    updateStatsOnChoice() {
        this.stats.dailyCount++;
        this.stats.totalSelections++;
        this.stats.comboCount++;
        
        // 随机调整幸运值
        const luckChange = Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : -Math.floor(Math.random() * 3);
        this.stats.luckValue = Math.max(0, Math.min(100, this.stats.luckValue + luckChange));
        
        this.saveStats();
        this.updateStats();
    }
    
    updateStats() {
        document.getElementById('daily-count').textContent = this.stats.dailyCount;
        document.getElementById('combo-count').textContent = this.stats.comboCount;
        document.getElementById('luck-value').textContent = this.stats.luckValue;
        
        // 添加脉冲动画
        ['daily-count', 'combo-count', 'luck-value'].forEach(id => {
            const element = document.getElementById(id);
            element.classList.add('stat-pulse');
            setTimeout(() => element.classList.remove('stat-pulse'), 600);
        });
    }
    
    saveStats() {
        localStorage.setItem('teaStats', JSON.stringify(this.stats));
    }
    
    // 成就系统函数
    initAchievements() {
        const container = document.getElementById('achievement-grid');
        container.innerHTML = '';
        
        this.achievementDefinitions.forEach(achievement => {
            const isUnlocked = this.achievements.includes(achievement.id);
            const achievementEl = document.createElement('div');
            achievementEl.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            achievementEl.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            `;
            container.appendChild(achievementEl);
        });
    }
    
    checkAchievements() {
        let newAchievements = [];
        
        this.achievementDefinitions.forEach(achievement => {
            if (!this.achievements.includes(achievement.id) && achievement.condition()) {
                this.achievements.push(achievement.id);
                newAchievements.push(achievement);
                
                // 生成奖励
                this.generateReward(achievement);
            }
        });
        
        if (newAchievements.length > 0) {
            this.saveAchievements();
            this.initAchievements();
            this.showAchievementNotification(newAchievements);
        }
    }
    
    saveAchievements() {
        localStorage.setItem('teaAchievements', JSON.stringify(this.achievements));
    }
    
    showAchievementNotification(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showNotification(`🎉 解锁成就：${achievement.title}`, 'achievement');
            }, index * 1000);
        });
    }
    
    // 奖励系统函数
    generateReward(achievement) {
        const rewardType = this.rewardTypes[Math.floor(Math.random() * this.rewardTypes.length)];
        const reward = {
            id: Date.now() + Math.random(),
            type: rewardType.type,
            name: rewardType.name,
            desc: rewardType.desc,
            icon: rewardType.icon,
            source: achievement.title
        };
        
        this.pendingRewards.push(reward);
        this.savePendingRewards();
        this.updateRewardDisplay();
    }
    
    checkPendingRewards() {
        this.updateRewardDisplay();
    }
    
    updateRewardDisplay() {
        const container = document.getElementById('reward-display');
        if (this.pendingRewards.length > 0) {
            const reward = this.pendingRewards[0];
            container.innerHTML = `
                <div class="reward-card">
                    <div class="reward-icon">${reward.icon}</div>
                    <div class="reward-info">
                        <div class="reward-name">${reward.name}</div>
                        <div class="reward-desc">${reward.desc}</div>
                        <div class="reward-source">来源：${reward.source}</div>
                    </div>
                    <button class="claim-btn" data-action="claim-reward">领取</button>
                </div>
            `;
            container.style.display = 'block';
            
            // 添加事件监听器
            const claimBtn = container.querySelector('.claim-btn');
            if (claimBtn) {
                claimBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.claimReward();
                });
            }
        } else {
            container.style.display = 'none';
        }
    }
    
    claimReward() {
        if (this.pendingRewards.length > 0) {
            const reward = this.pendingRewards.shift();
            this.applyReward(reward);
            this.savePendingRewards();
            this.updateRewardDisplay();
            this.showNotification(`✨ 已领取：${reward.name}`, 'reward');
        }
    }
    
    applyReward(reward) {
        switch (reward.type) {
            case 'luck_boost':
                this.stats.luckValue = Math.min(100, this.stats.luckValue + 10);
                this.saveStats();
                this.updateStats();
                break;
            case 'combo_protect':
                this.stats.comboProtection = true;
                this.saveStats();
                break;
            case 'double_buff':
                this.stats.doubleBuff = true;
                this.saveStats();
                break;
            case 'mystery_gift':
                this.stats.mysteryGifts = (this.stats.mysteryGifts || 0) + 1;
                this.saveStats();
                this.showNotification('🎁 获得神秘奶茶配方：星空奶茶', 'gift');
                break;
            case 'title_unlock':
                this.stats.titles = this.stats.titles || [];
                this.stats.titles.push('奶茶大师');
                this.saveStats();
                this.showNotification('👑 解锁称号：奶茶大师', 'title');
                break;
        }
    }
    
    savePendingRewards() {
        localStorage.setItem('pendingRewards', JSON.stringify(this.pendingRewards));
    }
    
    // 辅助函数
    getChoiceCount(choiceType) {
        return (this.stats.choiceStats && this.stats.choiceStats[choiceType]) || 0;
    }
    
    getAllBuffsCollected() {
        const buffTypes = Object.keys(this.mysticalBuffs);
        const collectedBuffs = [...new Set(this.history.map(item => item.buff).filter(buff => buff))];
        return buffTypes.every(type => collectedBuffs.includes(type));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ffd93d);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: bold;
            animation: slideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// 全局函数
function resetSelection() {
    document.querySelectorAll('.choice-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('result-area').classList.remove('show');
    const rm = document.getElementById('result-modal');
    if (rm) rm.classList.remove('show');
    
    // 重新生成运势和建议
    milkTeaSelector.updateFortune();
    milkTeaSelector.updateDailyAdvice();
    
    // 播放重置特效
    milkTeaSelector.createMysticalParticles();
}

function closeWarning() {
    document.getElementById('warning-modal').classList.remove('show');
}

function closeSuccess() {
    document.getElementById('success-modal').classList.remove('show');
}

function closeResult() {
    const m = document.getElementById('result-modal');
    if (m) m.classList.remove('show');
}

// 初始化应用
let teaSelector;
document.addEventListener('DOMContentLoaded', () => {
    window.teaSelector = new MilkTeaMysticSelector();
    teaSelector = window.teaSelector;
});

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeWarning();
        closeSuccess();
        closeResult();
    }
    
    // 数字键快速选择（支持前10个卡片：1-9, 0）
    const indexMap = { '1':0,'2':1,'3':2,'4':3,'5':4,'6':5,'7':6,'8':7,'9':8,'0':9 };
    const cards = Array.from(document.querySelectorAll('.choice-card'));
    if (indexMap.hasOwnProperty(e.key) && cards[indexMap[e.key]]) {
        cards[indexMap[e.key]].click();
    }
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.querySelectorAll('.choice-card').forEach(card => {
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            card.style.transform = 'scale(0.95)';
        });
        
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            card.style.transform = '';
        });
    });
}