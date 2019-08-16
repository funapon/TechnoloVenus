var canvas;
var context;
var canvasGrid;
var contextGrid;
var canvasPattern;
var contextPattern;
var canvasRect;
var sx;
var sy;
var mouseDown = false;

function init() {
  // キャンバスの取得
  canvas = document.getElementById("canvasDraw");
  context = canvas.getContext("2d");

  context.fillStyle="black";
  context.fillRect(0,0,canvas.width,canvas.height);

  canvasGrid = document.getElementById("canvasGrid");
  contextGrid = canvasGrid.getContext("2d");
  canvasPattern = document.getElementById("canvasPattern");
  contextPattern = canvasPattern.getContext("2d");
  canvasRect = canvas.getBoundingClientRect();
  // グリッドの表示
  showGrid();
}

function showGrid() {
  // グリッドキャンバスのクリア（白で塗りつぶす）
  contextGrid.fillStyle = "#oooooo";
  contextGrid.fillRect(0, 0, canvasGrid.width, canvasGrid.height);
  // グリッドの描画
  if (document.getElementById("grid").checked) {
    contextGrid.strokeStyle = "#CCCCCC";
    contextGrid.setLineDash([2,2]);
    contextGrid.beginPath();
    var w = canvasGrid.width / 4;
    for(var i=1; i<4; i++) {
      contextGrid.moveTo(i*w, 0);
      contextGrid.lineTo(i*w, canvasGrid.height);
      contextGrid.moveTo(0, i*w);
      contextGrid.lineTo(canvasGrid.width, i*w);
    }
    contextGrid.stroke();
  }
}

function startDraw(event) {
  // マウスボタンが押された
  mouseDown = true;
  // 始点をセット
  sx = event.clientX - canvasRect.left;
  sy = event.clientY - canvasRect.top;
}

function draw(event) {
  // マウスボタンが押されているとき描画
  if (mouseDown) {
    // 始点をセット
    var ex = event.clientX - canvasRect.left;
    var ey = event.clientY - canvasRect.top;
    // 描画
    context.lineCap = "round";
    context.lineWidth = document.getElementById("pen").value;
    context.strokeStyle = document.getElementById("color").value;
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(ex, ey);
    context.stroke();
    // 始点を変更
    sx = ex;
    sy = ey;
    // 地紋画像を描画
    drawPattern();
  }
}

function endDraw(event) {
  // マウスボタンが離された
  mouseDown = false;
}

function drawPattern() {
  // サイズを取得
  var size = 4;
  if(document.getElementById("size_8").checked) size *= 2;
  if(document.getElementById("size_16").checked) size *= 4;
  canvasPattern.width = size * canvas.width;
  canvasPattern.height = size * canvas.height;
  // 地紋パーツを取得
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  // 上下左右反転繰り返し描画
  image.onload = function() {
    for(var x=0; x<size/2; x++) {
      for(var y=0; y<size/2; y++) {
        reverse(image, x, y, 1, 1);
        reverse(image, x+1, y, -1, 1);
        reverse(image, x, y+1, 1, -1);
        reverse(image, x+1, y+1, -1, -1);
      }
    }
  }
}

function reverse(image, x, y, sx, sy){
  contextPattern.save();
  contextPattern.translate(x*2*canvas.width, y*2*canvas.height);
  contextPattern.scale(sx, sy);
  contextPattern.drawImage(image,0,0,canvas.width,canvas.height);
  contextPattern.restore();
}

function clearPattern() {
  // キャンパスをクリア
  context.clearRect(0, 0, canvas.width, canvas.height);
  contextPattern.clearRect(0, 0, canvasPattern.width, canvasPattern.height);
}

function savePattern(n) {
  // 保存するキャンバス（canvasまたはcanvasPattern)
  var targetCanvas = canvas;
  if(n == 1) {
    targetCanvas = canvasPattern;
  }
  // 名前を付けて保存（ダウンロード）
  var filename = window.prompt("ファイル名を入力して下さい", "pattern.png");
  if(filename != null) {
    if(canvas.msToBlob) {
      // msToBlobを使用できるブラウザ
      var blob = targetCanvas.msToBlob();
      window.navigator.msSaveBlob(blob, filename);
    } else {
      // それ以外のブラウザ
      var a = document.createElement("a");
      a.href = targetCanvas.toDataURL("image/png");
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}