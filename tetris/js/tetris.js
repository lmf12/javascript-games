var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

var squareWidth = 40;  // 单个方块的宽度
var canvasWidth = 400;  // 画布宽度
var canvasHeight = 600;  // 画布高度

var column = canvasWidth / squareWidth;  // 列数
var row = canvasHeight / squareWidth;  // 行数

var valueNull = 0; // 空白
var valueBlock = 1; // 移动中的方块
var valueDone = 2; // 已经完成的方块

var rate = 500; // 计时刷新频率

var map = new Array(row); // row * column 的数组

var currentBlockPosition = {}; // 当前移动方块的位置

var block1 = [valueNull, valueBlock, valueNull,
 			  valueNull, valueBlock, valueNull,
 			  valueNull, valueBlock, valueBlock];



// 初始化加载
window.onload = function() {
	for (var i = 0; i < row; i++) {
		map[i] = new Array(column);
		for (var j = 0; j < map[i].length; j++) {
			map[i][j] = valueNull;
		}
	}
	startNewBlock();
	setInterval("run()", rate);
}


// 键盘按钮事件
document.onkeyup = function(event) {
    var position = -1;
    if (event.keyCode == '37') {  // 左
        // moveLeftIfCan();
    } else if (event.keyCode == '38') { // 上

    } else if (event.keyCode == '39') { // 右
        // moveRightIfCan();
    } else if (event.keyCode == '40') { // 下

    }
}

// 开始一个新方块
var startNewBlock = function() {
	currentBlockPosition.x = 4;
	currentBlockPosition.y = 0;

	drawBlock(block1, currentBlockPosition);
}

// 定时执行
var run = function () {
	var canMove = moveDownIfCan();
	if (!canMove) {
		setBlockToMap(block1, currentBlockPosition);
		startNewBlock();
	}
}

// 左移动
var moveLeftIfCan = function() {
	var nextPosition = {};
	nextPosition.x = currentBlockPosition.x - 1;
	nextPosition.y = currentBlockPosition.y;
	if (!canSetBlock(block1, nextPosition)) {
		return false;
	}
	clearBlock(block1, currentBlockPosition);
	currentBlockPosition = nextPosition;
	drawBlock(block1, currentBlockPosition);
	return true;
}

// 右移动
var moveRightIfCan = function() {
	var nextPosition = {};
	nextPosition.x = currentBlockPosition.x + 1;
	nextPosition.y = currentBlockPosition.y;
	if (!canSetBlock(block1, nextPosition)) {
		return false;
	}
	clearBlock(block1, currentBlockPosition);
	currentBlockPosition = nextPosition;
	drawBlock(block1, currentBlockPosition);
	return true;
}

// 下移动
var moveDownIfCan = function() {
	var nextPosition = {};
	nextPosition.x = currentBlockPosition.x;
	nextPosition.y = currentBlockPosition.y + 1;
	if (!canSetBlock(block1, nextPosition)) {
		return false;
	}
	clearBlock(block1, currentBlockPosition);
	currentBlockPosition = nextPosition;
	drawBlock(block1, currentBlockPosition);
	return true;
}

// 旋转

// 绘制单个方块，(0, 0) 在左上角
var drawSquare = function(x, y) {
    var img = new Image();
    img.src = './image/square.png';
    img.onload = () => {
        var rect = rectForPosition(x, y);
        context.drawImage(img, rect[0], rect[1], rect[2], rect[3]);
    }
}

// 清除方块
var clearBlock = function(block, position) {
	// 清除每个竖直方向的第一个
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			if (block[i + j*3] == valueBlock) {
				context.fillStyle = '#eeeeee';
				var rX = position.x + i - 1;
				var rY = position.y + j - 1;
				var rect = rectForPosition(rX, rY);
				context.fillRect(rect[0], rect[1], rect[2], rect[3]);
				break;
			}
		}
	}
}

// 绘制整个方块，(x, y) 为中心位置
var drawBlock = function(block, position) {
	for (var i = 0; i < 9; i++) {
		var xOffset = (i % 3) - 1;
		var yOffset = parseInt(i / 3) - 1;
		if (block[i] != valueNull) {
			drawSquare(position.x + xOffset, position.y + yOffset);
		}
	}
} 

// 返回某个位置的区域范围，(0, 0) 在左上角
var rectForPosition = function(x, y) {
	if (x < 0 || x >= column ||
		y < 0 || y >= row) {
		return [0, 0, 0, 0];
	}

    var left = x * squareWidth;
    var top = y * squareWidth;
    return [left, top, squareWidth, squareWidth];
}

// 将当前的方块，更新到map数组中
var setBlockToMap = function(block, position) {
	for (var i = 0; i < 9; i++) {
		var xOffset = (i % 3) - 1;
		var yOffset = parseInt(i / 3) - 1;
		var x = position.x + xOffset;
		var y = position.y + yOffset;
		if (block[i] != valueNull &&
			x >= 0 && x < column &&
			y >= 0 && y < row) {
			map[y][x] = valueDone;
		}
	}
}

// 是否可以将方块设置到当前位置
var canSetBlock = function(block, position) {
	for (var i = 0; i < 9; i++) {
		var xOffset = (i % 3) - 1;
		var yOffset = parseInt(i / 3) - 1;
		var x = position.x + xOffset;
		var y = position.y + yOffset;
		if (block[i] != valueNull) {
			if (x < 0 || x >= column ||
				y < 0 || y >= row) {
				return false;
			}
			if (map[y][x] == valueDone) {
				return false;
			}
		}
	}
	return true;
}






