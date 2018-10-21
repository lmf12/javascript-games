var background = document.getElementById("background");
var context = background.getContext('2d');

var backgroundWidth = 450; // 背景宽度
var padding = 10; // 图片边距
var column = 3; // 列数
var imageWidth = (backgroundWidth - (padding * (column + 1))) / column;

window.onload = function(){
    for (var index = 0; index < column * column; index++) {
        drawImageItem(index);
    };
}

// 绘制一个图片，index（0 ～ column^2-1）
var drawImageItem = function(index) {
    var img = new Image();
    img.src = './image/dog_0' + String(index+1) + '.jpg';
    img.onload = () => {
        var left = (index % column) * (padding + imageWidth) + padding;
        var top = parseInt(index / column) * (padding + imageWidth) + padding;
        context.drawImage(img, left, top, imageWidth, imageWidth);
    }
}

