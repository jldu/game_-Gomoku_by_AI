# 五子棋AI (Gomoku AI)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-HTML5-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

一个基于HTML5的网页版五子棋游戏，包含智能AI对手，支持PC端和移动端游玩。

## 功能特色

- 🎮 **双人对战** - 支持两名玩家在同一设备上对战
- 🤖 **智能AI** - 内置基于评分系统的AI对手，具备基础的攻防意识
- 📱 **响应式设计** - 完美适配桌面端和移动端浏览器
- 🌗 **精美界面** - 现代化的UI设计，深色主题，视觉舒适
- ⚡ **流畅体验** - CSS动画效果，操作反馈及时

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- 原生Web API

## 快速开始

### 在线体验

直接打开 `index.html` 文件即可开始游戏。

或者使用本地服务器运行：
```bash
# 使用Python 3
python -m http.server 8000

# 或者使用Node.js (需要安装serve包)
npx serve

# 然后在浏览器中访问 http://localhost:8000
```

### 游戏玩法

1. 黑子先行，双方轮流落子
2. 率先在横向、纵向或斜向连成五子者获胜
3. 可以选择与朋友双人对战，或挑战AI对手

### 操作说明

- **开始/重置游戏**: 点击"重新开始"按钮
- **切换模式**: 勾选"AI模式"复选框可以在双人模式和AI模式间切换
- **落子**: 点击棋盘交叉点

## AI特性

本游戏的AI采用基于评分系统的算法：

1. **位置评估**: 分析整个棋盘局面，为每个空位打分
2. **攻防兼顾**: 既考虑进攻机会，也重视防守需要
3. **模式识别**: 识别连五、活四、冲四、活三等关键棋型
4. **智能决策**: 根据评分选择最优落子位置

## 文件结构

```
.
├── index.html          # 主页面
├── style.css           # 样式表
├── script.js           # 游戏逻辑和AI算法
└── README.md           # 项目说明文档
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发计划

- [ ] 添加难度等级选择
- [ ] 实现开局库
- [ ] 添加悔棋功能
- [ ] 记录对局历史
- [ ] 添加音效和背景音乐

## 贡献

欢迎提交Issue或Pull Request来帮助改进项目。

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解更多详情。
