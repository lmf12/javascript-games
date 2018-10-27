var backgroundWidth = 450; // 背景宽度
var padding = 10; // 图片边距
var column = 3; // 列数
var imageWidth = (backgroundWidth - (padding * (column + 1))) / column; // 图片宽度

var isFinish = false; // 游戏是否结束

var canvas1 = document.getElementById("canvas1");
var context1 = canvas1.getContext('2d');
var imageIndexForPositionOfCanvas1 = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 玩家1 每个位置对应的图片

var canvas2 = document.getElementById("canvas2");
var context2 = canvas2.getContext('2d');
var imageIndexForPositionOfCanvas2 = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 玩家2 每个位置对应的图片

// 初始化加载
window.onload = function() {
    imageIndexForPositionOfCanvas1 = setupRandomPosition(canvas1);
    drawAllImage(imageIndexForPositionOfCanvas1, context1);

    imageIndexForPositionOfCanvas2 = setupRandomPosition(canvas2);
    drawAllImage(imageIndexForPositionOfCanvas2, context2);
}

// 键盘按钮抬起事件
document.onkeyup = function(event) {
    var key; // 待获取的按键元素

    var isPlayer1 = true; // 当前操作是否属于玩家1

    var position = -1;
    if (event.keyCode == '37') {  // 左
        position = rightOfPosition(canvas2.emptyPosition);
        isPlayer1 = false;
        key = document.getElementById('key_left');
    } else if (event.keyCode == '38') { // 上
        position = bottomOfPosition(canvas2.emptyPosition);
        isPlayer1 = false;
        key = document.getElementById('key_top');
    } else if (event.keyCode == '39') { // 右
        position = leftOfPosition(canvas2.emptyPosition);
        isPlayer1 = false;
        key = document.getElementById('key_right');
    } else if (event.keyCode == '40') { // 下
        position = topOfPosition(canvas2.emptyPosition);
        isPlayer1 = false;
        key = document.getElementById('key_bottom');
    } else if (event.keyCode == '65') { // A
        position = rightOfPosition(canvas1.emptyPosition);
        key = document.getElementById('key_a');
    } else if (event.keyCode == '87') { // W
        position = bottomOfPosition(canvas1.emptyPosition);
        key = document.getElementById('key_w');
    } else if (event.keyCode == '68') { // D
        position = leftOfPosition(canvas1.emptyPosition);
        key = document.getElementById('key_d');
    } else if (event.keyCode == '83') { // S
        position = topOfPosition(canvas1.emptyPosition);
        key = document.getElementById('key_s');
    }
    // 样式复原
    key.style.backgroundColor = '#ffffff';
    key.style.borderWidth = '1px';
    key.children[0].style.color = '#555555';

    if (isFinish) {
        return;
    }

    if (position < 0 || position > lastIndex()) {
        return;
    } 

    var canvas = isPlayer1 ? canvas1 : canvas2;
    var context = isPlayer1 ? context1 : context2;
    var imageIndexForPosition = isPlayer1 ? imageIndexForPositionOfCanvas1 : imageIndexForPositionOfCanvas2;

    var target = moveImageIfCanAtPosition(imageIndexForPosition, canvas, position);
    if (target >= 0) {
        refreshImagePositions(context, imageIndexForPosition, position, target);
    }
    if (checkIfFinish(imageIndexForPosition)) {
        drawImageItem(context ,imageIndexForPosition[lastIndex()], lastIndex());
        isFinish = true;
    }
}

// 键盘按钮按下事件
document.onkeydown = function(event) {
    var key; // 待获取的按键元素
    if (event.keyCode == '37') {  // 左
        key = document.getElementById('key_left');
    } else if (event.keyCode == '38') { // 上
        key = document.getElementById('key_top');
    } else if (event.keyCode == '39') { // 右
        key = document.getElementById('key_right');
    } else if (event.keyCode == '40') { // 下
        key = document.getElementById('key_bottom');
    } else if (event.keyCode == '65') { // A
        key = document.getElementById('key_a');
    } else if (event.keyCode == '87') { // W
        key = document.getElementById('key_w');
    } else if (event.keyCode == '68') { // D
        key = document.getElementById('key_d');
    } else if (event.keyCode == '83') { // S
        key = document.getElementById('key_s');
    }
    // 样式改动
    key.style.backgroundColor = '#000000';
    key.style.borderWidth = '0px';
    key.children[0].style.color = '#ffffff';
}

// 绘制所有图片
var drawAllImage = function(imageIndexForPosition, context) {
    for (var position = 0; position < column * column; position++) {
        var index = imageIndexForPosition[position];
        if (index == lastIndex()) { // 最后一张图片不绘制
            continue;
        }
        drawImageItem(context, index, position);
    }
}

// 刷新图片位置，origin起始位置，target目标位置
var refreshImagePositions = function(context, imageIndexForPosition, origin, target) {
    var originRect = rectForPosition(origin);

    context.clearRect(originRect[0], originRect[1], originRect[2], originRect[3]);
    drawImageItem(context, imageIndexForPosition[target], target);
}

// 初始化随机顺序
var setupRandomPosition = function(canvas) {
    var list1 = [4, 3, 2, 8, 0, 7, 5, 6, 1];
    var list2 = [2, 0, 5, 6, 8, 7, 3, 1, 4];
    var list3 = [3, 7, 2, 4, 1, 6, 8, 0, 5];
    var list4 = [3, 2, 4, 1, 7, 6, 5, 0, 8];
    var lists = [list1, list2, list3, list4];

    var imageIndexForPosition = lists[parseInt(Math.random() * 4)];

    // 获取空位位置
    var emptyPosition = 0;
    for (var i = imageIndexForPosition.length - 1; i >= 0; i--) {
        if (imageIndexForPosition[i] == lastIndex()) {
            emptyPosition = i;
            break;
        }
    }
    canvas.emptyPosition = emptyPosition;

    // 随机移动次数
    var times = 10;
    while (times--) {
        // 获取随机数，决定空位哪个位置进行移动
        var direction = parseInt(Math.random() * 4);

        var target = -1;
        if (direction == 0) {
            target = topOfPosition(emptyPosition);  // 上
        } else if (direction == 1) {
            target = leftOfPosition(emptyPosition);  // 左 
        } else if (direction == 2) {
            target = rightOfPosition(emptyPosition);  // 右
        } else if (direction == 3) {
            target = bottomOfPosition(emptyPosition);  // 下
        }
        if (target < 0 || target > lastIndex()) {  // 位置不合法，继续下一次循环
            continue;
        }
        var result = moveImageIfCanAtPosition(imageIndexForPosition, canvas, target);
        if (result >= 0) { // 如果移动成功，更新空位的位置
            emptyPosition = target;
        }
    }

    return imageIndexForPosition;
}

// 某个位置上的图片，如果能移动的话，就移动，并返回目标的位置，否则返回-1
var moveImageIfCanAtPosition = function(imageIndexForPosition, canvas, position) {
    var top = topOfPosition(position);
    var left = leftOfPosition(position);
    var bottom = bottomOfPosition(position);
    var right = rightOfPosition(position);

    var targetPositioin = -1; // 目标位置
    if (isPositionEmpty(imageIndexForPosition, top)) {
        targetPositioin = top;
    } else if (isPositionEmpty(imageIndexForPosition, left)) {
        targetPositioin = left;
    } else if (isPositionEmpty(imageIndexForPosition, bottom)) {
        targetPositioin = bottom;
    } else if (isPositionEmpty(imageIndexForPosition, right)) {
        targetPositioin = right;
    }

    // 如果周围有空位置，进行交换
    if (targetPositioin >= 0) {
        imageIndexForPosition[targetPositioin] = imageIndexForPosition[position];
        imageIndexForPosition[position] = lastIndex();
        canvas.emptyPosition = position; // 更新空位的位置
        return targetPositioin;
    }
    return -1;
}

// 绘制一个图片，index图片索引，position图片位置（0 ～ column^2-1）
var drawImageItem = function(context, index, position) {
    var img = new Image();
    img.src = './image/dog_0' + String(index+1) + '.jpg';
    img.onload = () => {
        var rect = rectForPosition(position);
        context.drawImage(img, rect[0], rect[1], rect[2], rect[3]);
    }
}

// 检查是否完成
var checkIfFinish = function(imageIndexForPosition) {
    for (var index = 0; index < imageIndexForPosition.length; index++) {
        if (index != imageIndexForPosition[index]) {
            return false;
        }
    }
    return true;
}

// 某个位置是否是空的，即最后一张图片所在的位置
var isPositionEmpty = function(imageIndexForPosition, position) {
    if (position < 0 || position > lastIndex()) {
        return false;
    } 
    if (imageIndexForPosition[position] == lastIndex()) {
        return true;
    } else {
        return false;
    }
}

// 返回某个位置的区域范围
var rectForPosition = function(position) {
    if (position < 0 || position > lastIndex()) {
        return [0, 0, 0, 0];
    }
    var x = (position % column) * (padding + imageWidth) + padding;
    var y = parseInt(position / column) * (padding + imageWidth) + padding;
    return [x, y, imageWidth, imageWidth];
}

// 最后一个索引
var lastIndex = function() {
    return column * column - 1;
}

// 获取左方位置，没有则返回-1
var leftOfPosition = function(position) {
    return (position % column) == 0 ? -1 : position - 1;
}

// 获取右方位置，没有则返回-1
var rightOfPosition = function(position) {
    return (position % column) == (column - 1) ? -1 : position + 1;
}

// 获取上方位置
var topOfPosition = function(position) {
    return position - column;
}

// 获取下方位置
var bottomOfPosition = function(position) {
    return position + column;
}






