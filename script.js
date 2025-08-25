
// 游戏配置
const BOARD_SIZE = 19;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

// 游戏状态
let board = [];
let currentPlayer = BLACK;
let gameOver = false;
let lastMove = null;
let aiMode = false; // 是否开启AI模式
let aiPlayer = WHITE; // AI执白子

// DOM元素
const gameBoard = document.getElementById('game-board');
const currentPlayerSpan = document.getElementById('current-player');
const resetBtn = document.getElementById('reset-btn');
const winnerMessage = document.getElementById('winner-message');
const aiModeCheckbox = document.getElementById('ai-mode');
const modeText = document.getElementById('mode-text');

// 初始化游戏
function initGame() {
    // 初始化棋盘数组
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
    
    // 清空棋盘DOM
    gameBoard.innerHTML = '<div id="board-grid" class="go-board"></div>';
    const boardGrid = document.getElementById('board-grid');
    
    // 设置棋盘尺寸
    const boardSize = BOARD_SIZE * 25; // 每个格子25px
    boardGrid.style.width = boardSize + 'px';
    boardGrid.style.height = boardSize + 'px';
    
    // 添加网格线
    addGridLines();
    
    // 添加星位点
    addStarPoints();
    
    // 添加点击事件监听器到整个棋盘
    boardGrid.addEventListener('click', handleBoardClick);
    
    // 重置游戏状态
    currentPlayer = BLACK;
    gameOver = false;
    lastMove = null;
    aiMode = aiModeCheckbox.checked;
    
    // 更新模式文本
    modeText.textContent = aiMode ? 'AI模式' : '双人模式';
    
    // 更新UI
    updateCurrentPlayer();
    winnerMessage.classList.add('hidden');
    winnerMessage.textContent = '';
}

// 处理棋盘点击事件
function handleBoardClick(event) {
    if (gameOver) return;
    
    const boardGrid = document.getElementById('board-grid');
    const rect = boardGrid.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // 计算最近的交叉点
    const cellSize = 25;
    const col = Math.round(x / cellSize);
    const row = Math.round(y / cellSize);
    
    // 确保坐标在有效范围内
    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        handleCellClick(row, col);
    }
}

// 处理格子点击
function handleCellClick(row, col) {
    // 如果游戏结束或格子已被占用，则返回
    if (gameOver || board[row][col] !== EMPTY) {
        return;
    }
    
    // 下子
    placePiece(row, col, currentPlayer);
    
    // 检查是否获胜
    if (checkWin(row, col)) {
        endGame(currentPlayer);
        return;
    }
    
    // 检查是否平局
    if (isBoardFull()) {
        endGame(null);
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    updateCurrentPlayer();
    
    // 如果是AI模式且当前是AI回合，则AI下棋
    if (aiMode && currentPlayer === aiPlayer && !gameOver) {
        setTimeout(makeAIMove, 500); // 延迟0.5秒让AI下棋，增加真实感
    }
}

// 添加网格线
function addGridLines() {
    const boardGrid = document.getElementById('board-grid');
    const cellSize = 25;
    
    // 添加水平线
    for (let i = 0; i < BOARD_SIZE; i++) {
        const horizontalLine = document.createElement('div');
        horizontalLine.className = 'board-line horizontal-line';
        horizontalLine.style.top = (i * cellSize) + 'px';
        boardGrid.appendChild(horizontalLine);
    }
    
    // 添加垂直线
    for (let j = 0; j < BOARD_SIZE; j++) {
        const verticalLine = document.createElement('div');
        verticalLine.className = 'board-line vertical-line';
        verticalLine.style.left = (j * cellSize) + 'px';
        boardGrid.appendChild(verticalLine);
    }
}

// 添加星位点
function addStarPoints() {
    const boardGrid = document.getElementById('board-grid');
    const cellSize = 25;
    
    // 标准围棋星位点位置 (4,4), (4,10), (4,16), (10,4), (10,10), (10,16), (16,4), (16,10), (16,16)
    // 对于19x19棋盘，坐标从0开始计数
    const starPositions = [
        [3, 3], [3, 9], [3, 15],
        [9, 3], [9, 9], [9, 15],
        [15, 3], [15, 9], [15, 15]
    ];
    
    starPositions.forEach(([row, col]) => {
        const starPoint = document.createElement('div');
        starPoint.className = 'star-point';
        starPoint.style.left = (col * cellSize) + 'px';
        starPoint.style.top = (row * cellSize) + 'px';
        boardGrid.appendChild(starPoint);
    });
}

// 落子
function placePiece(row, col, player) {
    board[row][col] = player;
    
    // 移除上一步的标记
    if (lastMove) {
        const [lastRow, lastCol] = lastMove;
        const lastPiece = document.querySelector(`.piece[data-row="${lastRow}"][data-col="${lastCol}"]`);
        if (lastPiece) {
            lastPiece.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
        }
    }
    
    // 创建新棋子
    const boardGrid = document.getElementById('board-grid');
    const cellSize = 25;
    const piece = document.createElement('div');
    piece.className = `piece ${player === BLACK ? 'black-piece' : 'white-piece'}`;
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.style.left = (col * cellSize) + 'px';
    piece.style.top = (row * cellSize) + 'px';
    
    // 添加最后一步的高亮效果
    if (row === lastMove?.[0] && col === lastMove?.[1]) {
        piece.style.boxShadow = '0 0 5px 2px red';
    }
    
    boardGrid.appendChild(piece);
    
    // 更新最后一步
    lastMove = [row, col];
}

// 检查是否获胜
function checkWin(row, col) {
    const player = board[row][col];
    if (player === EMPTY) return false;
    
    // 四个方向：水平、垂直、主对角线、副对角线
    const directions = [
        [0, 1],  // 水平
        [1, 0],  // 垂直
        [1, 1],  // 主对角线
        [1, -1]  // 副对角线
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 包括当前子
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row + i * dx;
            const newCol = col + i * dy;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && 
                board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i < 5; i++) {
            const newRow = row - i * dx;
            const newCol = col - i * dy;
            if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && 
                board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // 如果连成五子则获胜
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 检查棋盘是否已满
function isBoardFull() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === EMPTY) {
                return false;
            }
        }
    }
    return true;
}

// 结束游戏
function endGame(winner) {
    gameOver = true;
    
    if (winner === null) {
        winnerMessage.textContent = '平局！';
    } else {
        const winnerText = winner === BLACK ? '黑子' : '白子';
        winnerMessage.innerHTML = `游戏结束！<span style="color: ${winner === BLACK ? 'black' : 'gray'};">${winnerText}</span> 获胜！`;
    }
    
    winnerMessage.classList.remove('hidden');
}

// 更新当前玩家显示
function updateCurrentPlayer() {
    currentPlayerSpan.textContent = currentPlayer === BLACK ? '黑子' : '白子';
    currentPlayerSpan.style.color = currentPlayer === BLACK ? 'black' : 'gray';
}

// 重置游戏
resetBtn.addEventListener('click', initGame);

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);

// 添加触屏设备支持
document.addEventListener('touchstart', function() {}, false);

// AI模式开关事件监听
if (aiModeCheckbox) {
    aiModeCheckbox.addEventListener('change', function() {
        modeText.textContent = this.checked ? 'AI模式' : '双人模式';
    });
}

// AI下棋函数
function makeAIMove() {
    if (!aiMode || gameOver || currentPlayer !== aiPlayer) {
        return;
    }
    
    // 使用评分系统选择最佳位置
    const bestMove = findBestMove();
    if (bestMove) {
        const [row, col] = bestMove;
        handleCellClick(row, col);
    }
}

// 评估某个位置的得分
function evaluatePosition(row, col, player) {
    if (board[row][col] !== EMPTY) return -1;
    
    let score = 0;
    const directions = [[0,1],[1,0],[1,1],[1,-1]];
    
    // 检查四个方向
    for (const [dx, dy] of directions) {
        let count = 1;
        let blocked = 0;
        
        // 正向检查
        for (let i = 1; i < 5; i++) {
            const r = row + i * dx;
            const c = col + i * dy;
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
                blocked++;
                break;
            }
            if (board[r][c] === player) {
                count++;
            } else if (board[r][c] !== EMPTY) {
                blocked++;
                break;
            } else {
                break;
            }
        }
        
        // 反向检查
        for (let i = 1; i < 5; i++) {
            const r = row - i * dx;
            const c = col - i * dy;
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
                blocked++;
                break;
            }
            if (board[r][c] === player) {
                count++;
            } else if (board[r][c] !== EMPTY) {
                blocked++;
                break;
            } else {
                break;
            }
        }
        
        // 根据连子数和阻挡情况评分
        if (count >= 5) {
            score += 100000; // 连五
        } else if (count === 4) {
            if (blocked === 0) {
                score += 10000; // 活四
            } else if (blocked === 1) {
                score += 1000; // 冲四
            }
        } else if (count === 3) {
            if (blocked === 0) {
                score += 1000; // 活三
            } else if (blocked === 1) {
                score += 100; // 眠三
            }
        } else if (count === 2) {
            if (blocked === 0) {
                score += 100; // 活二
            }
        }
    }
    
    return score;
}

// 寻找最佳位置
function findBestMove() {
    let bestScore = -1;
    let bestMove = null;
    
    // 遍历所有空位
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === EMPTY) {
                // 评估AI自己在此处下棋的得分
                const aiScore = evaluatePosition(i, j, aiPlayer);
                // 评估对手在此处下棋的得分（防守）
                const opponent = aiPlayer === BLACK ? WHITE : BLACK;
                const opponentScore = evaluatePosition(i, j, opponent);
                
                // 综合评分（攻防结合）
                const totalScore = aiScore + opponentScore * 0.8;
                
                if (totalScore > bestScore) {
                    bestScore = totalScore;
                    bestMove = [i, j];
                }
            }
        }
    }
    
    return bestMove;
}



