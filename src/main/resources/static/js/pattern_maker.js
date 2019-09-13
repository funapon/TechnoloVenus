// 変数の宣言
// 実際に模様を書くキャンバス（ドローキャンバス）
const canvasDraw = document.getElementById("canvasDraw");
const contextDraw = canvasDraw.getContext("2d");

// ペイントキャンバス上に重ねるグリッド（グリッドキャンバス）
const canvasGrid = document.getElementById("canvasGrid");
const contextGrid = canvasGrid.getContext("2d");

// 生成された地紋が表示されるキャンバス（パターンキャンバス）
const canvasPattern = document.getElementById("canvasPattern");
const contextPattern = canvasPattern.getContext("2d");

// クリックされた場所の座標
let sx;
let sy;

// マウスが押されているかの状態
let mouseDown = false;

// ドローキャンバス、パターンキャンバスの背景色設定
fillCanvasBackground();
// グリッドの表示
showGrid();

function fillCanvasBackground() {
  // パターンキャンバスの背景色指定
  contextPattern.fillStyle = "#000000";
  contextPattern.fillRect(0, 0, canvasPattern.width, canvasPattern.height);
}

function showGrid() {
  // グリッドキャンバスの背景色指定(グリッドのクリア)
  contextGrid.fillStyle = "#oooooo";
  contextGrid.fillRect(0, 0, canvasGrid.width, canvasGrid.height);
  // グリッドの描画
  if (document.getElementById("grid").checked) {
    contextGrid.strokeStyle = "#CCCCCC";
    contextGrid.setLineDash([2,2]);
    contextGrid.beginPath();
    const w = canvasGrid.width / 4;
    for(let i=1; i<4; i++) {
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
  const canvasRect = canvasDraw.getBoundingClientRect();
  sx = event.clientX - canvasRect.left;
  sy = event.clientY - canvasRect.top;
}

function draw(event) {
  // マウスボタンが押されているとき描画
  if (mouseDown) {
    // 終点をセット
    const canvasRect = canvasDraw.getBoundingClientRect();
    const ex = event.clientX - canvasRect.left;
    const ey = event.clientY - canvasRect.top;
    // 描画
    contextDraw.lineCap = "round";
    contextDraw.lineWidth = document.getElementById("pen").value;
    contextDraw.strokeStyle = document.getElementById("color").value;
    contextDraw.beginPath();
    contextDraw.moveTo(sx, sy);
    contextDraw.lineTo(ex, ey);
    contextDraw.stroke();
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
  let size = 4;
  if(document.getElementById("size_8").checked) size *= 2;
  if(document.getElementById("size_16").checked) size *= 4;
  canvasPattern.width = size * canvasDraw.width;
  canvasPattern.height = size * canvasDraw.height;
  // 地紋パーツを取得
  const image = new Image();
  image.src = canvasDraw.toDataURL("image/png");
  // 上下左右反転繰り返し描画
  image.onload = function() {
    for(let x=0; x<size/2; x++) {
      for(let y=0; y<size/2; y++) {
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
  contextPattern.translate(x*2*canvasDraw.width, y*2*canvasDraw.height);
  contextPattern.scale(sx, sy);
  contextPattern.drawImage(image,0,0,canvasDraw.width,canvasDraw.height);
  contextPattern.restore();
}

function clearPattern() {
  // キャンパスをクリア
  contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
  contextPattern.clearRect(0, 0, canvasPattern.width, canvasPattern.height);
}

function savePattern(n) {
  // 保存するキャンバス（canvasまたはcanvasPattern)
  let targetCanvas = canvasDraw;
  if(n == 1) {
    targetCanvas = canvasPattern;
  }
  // 名前を付けて保存（ダウンロード）
  const filename = window.prompt("ファイル名を入力して下さい", "pattern.png");
  if(filename != null) {
    if(canvasDraw.msToBlob) {
      // msToBlobを使用できるブラウザ
      const blob = targetCanvas.msToBlob();
      window.navigator.msSaveBlob(blob, filename);
    } else {
      // それ以外のブラウザ
      const a = document.createElement("a");
      a.href = targetCanvas.toDataURL("image/png");
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
