var background = document.getElementById("background");
var context = background.getContext('2d');

var backgroundWidth = 450; // 背景宽度
var padding = 10; // 图片边距
var column = 3; // 列数
var imageWidth = (backgroundWidth - (padding * (column + 1))) / column; // 图片宽度

var imageIndexForPosition = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 每个位置对应的图片

// 初始化加载
window.onload = function() {
    drawAllImage();
}

// 屏幕点击
background.onclick = function(e) {
    var x = parseInt(e.offsetX / (padding + imageWidth));
    var y = parseInt(e.offsetY / (padding + imageWidth));

    var position = y * column + x;
    var target = moveImageIfCanAtPosition(position);
    if (target >= 0) {
        refreshImagePositions(position, target);
    }
};

// 绘制一个图片，index图片索引，position图片位置（0 ～ column^2-1）
var drawImageItem = function(index, position) {
    var img = new Image();
    img.src = './image/dog_0' + String(index+1) + '.jpg';
    img.onload = () => {
        var rect = rectForPosition(position);
        context.drawImage(img, rect[0], rect[1], rect[2], rect[3]);
    }
}

// 刷新图片位置，origin起始位置，target目标位置
var refreshImagePositions = function(origin, target) {
    var originRect = rectForPosition(origin);

    context.clearRect(originRect[0], originRect[1], originRect[2], originRect[3]);
    drawImageItem(imageIndexForPosition[target], target);
}

// 绘制所有图片
var drawAllImage = function() {
    for (var position = 0; position < column * column; position++) {
        var index = imageIndexForPosition[position];
        if (index == lastIndex()) { // 最后一张图片不绘制
            continue;
        }
        drawImageItem(index, position);
    };
}

// 某个位置上的图片，如果能移动的话，就移动，并返回目标的位置，否则返回-1
var moveImageIfCanAtPosition = function(position) {
    var top = position - column;  // 上方的位置
    var left = (position % column) == 0 ? -1 : position - 1;  // 左方的位置，如果左边已经没有，则设置为-1
    var bottom = position + column;  // 下方的位置
    var right = (position % column) == (column - 1) ? -1 : position + 1;  // 右方的位置，如果右边已经没有，则设置为-1

    var targetPositioin = -1; // 目标位置
    if (isPositionEmpty(top)) {
        targetPositioin = top;
    } else if (isPositionEmpty(left)) {
        targetPositioin = left;
    } else if (isPositionEmpty(bottom)) {
        targetPositioin = bottom;
    } else if (isPositionEmpty(right)) {
        targetPositioin = right;
    }

    // 如果周围有空位置，进行交换
    if (targetPositioin >= 0) {
        imageIndexForPosition[targetPositioin] = imageIndexForPosition[position];
        imageIndexForPosition[position] = lastIndex();
        return targetPositioin;
    }
    return -1;
}

// 某个位置是否是空的，即最后一张图片所在的位置
var isPositionEmpty = function(position) {
    if (position < 0 || position > lastIndex()) {
        return false;
    } 
    if (imageIndexForPosition[position] == lastIndex()) {
        return true;
    } else {
        return false;
    }
}

// 最后一个索引
var lastIndex = function() {
    return column * column - 1;
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









