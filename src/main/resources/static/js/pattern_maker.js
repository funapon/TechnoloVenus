// 変数の宣言
// 画面左に表示される実際に模様を書く子画面（グリッドキャンバス）
const canvas = document.getElementById("canvasDraw");
const context = canvas.getContext("2d");

// グリッドキャンバス上のグリッド
const canvasGrid = document.getElementById("canvasGrid");
const contextGrid = canvasGrid.getContext("2d");

// 生成された地紋が描画される（地紋キャンバス）
const canvasPattern = document.getElementById("canvasPattern");
const contextPattern = canvasPattern.getContext("2d");

// クリックされた場所の座標
let sx;
let sy;

// マウスが押されているかの状態
let mouseDown = false;

showGrid();

function showGrid() {
  // グリッドキャンバスのクリア（黒で塗りつぶす）
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
  const canvasRect = canvas.getBoundingClientRect();
  sx = event.clientX - canvasRect.left;
  sy = event.clientY - canvasRect.top;
}

function draw(event) {
  // マウスボタンが押されているとき描画
  if (mouseDown) {
    // 終点をセット
    const canvasRect = canvas.getBoundingClientRect();
    const ex = event.clientX - canvasRect.left;
    const ey = event.clientY - canvasRect.top;
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
  let size = 4;
  if(document.getElementById("size_8").checked) size *= 2;
  if(document.getElementById("size_16").checked) size *= 4;
  canvasPattern.width = size * canvas.width;
  canvasPattern.height = size * canvas.height;
  // 地紋パーツを取得
  const image = new Image();
  image.src = canvas.toDataURL("image/png");
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
  let targetCanvas = canvas;
  if(n == 1) {
    targetCanvas = canvasPattern;
  }
  // 名前を付けて保存（ダウンロード）
  const filename = window.prompt("ファイル名を入力して下さい", "pattern.png");
  if(filename != null) {
    if(canvas.msToBlob) {
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