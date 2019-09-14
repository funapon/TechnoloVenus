// 変数の宣言
// 実際に模様を書くキャンバス（描画用キャンバス）
const canvasDraw = document.getElementById("canvasDraw");
const contextDraw = canvasDraw.getContext("2d");

// 描画用キャンバス上に重ねるグリッド（グリッドキャンバス）
const canvasGrid = document.getElementById("canvasGrid");
const contextGrid = canvasGrid.getContext("2d");

// 生成された地紋が表示されるキャンバス（パターンキャンバス）
const canvasPattern = document.getElementById("canvasPattern");
const contextPattern = canvasPattern.getContext("2d");

// クリックされた場所の座標（始点）
let sx;
let sy;

// マウスが押されているかの状態
let mouseDown = false;

// グリッドの表示
showGrid();

function showGrid() {
  // グリッドキャンバスのクリア、指定した背景色で塗りつぶす
  contextGrid.fillStyle = "#oooooo";
  contextGrid.fillRect(0, 0, canvasGrid.width, canvasGrid.height);

  // グリッドの描画
  if (document.getElementById("grid").checked) {
    // グリッド線の色を指定
    contextGrid.strokeStyle = "#CCCCCC";
    // 線を点線にする
    contextGrid.setLineDash([2,2]);
    // 現在のパスをリセットする
    contextGrid.beginPath();
    // グリット戦の間隔（キャンバス幅の1/4）
    const w = canvasGrid.width / 4;

    // グリッド線を描画する
    for(let i=1; i<4; i++) {
      // 縦線のパスを作成
      contextGrid.moveTo(i*w, 0);
      contextGrid.lineTo(i*w, canvasGrid.height);
      // 横線のパスを作成
      contextGrid.moveTo(0, i*w);
      contextGrid.lineTo(canvasGrid.width, i*w);
    }
    // 作成したパスの描画
    contextGrid.stroke();
  }
}

function startDraw(event) {
  // マウスボタンが押された
  mouseDown = true;
  // 描画用キャンバスの矩形情報を取得
  const canvasRect = canvasDraw.getBoundingClientRect();
  // 始点をセット
  sx = event.clientX - canvasRect.left;
  sy = event.clientY - canvasRect.top;
}

function draw(event) {
  // マウスボタンが押されているとき描画
  if (mouseDown) {
    // 描画用キャンバスの矩形情報を取得
    const canvasRect = canvasDraw.getBoundingClientRect();
    // 終点をセット
    const ex = event.clientX - canvasRect.left;
    const ey = event.clientY - canvasRect.top;
    
    // 描画する線の設定
    // 線端の形を丸にする
    contextDraw.lineCap = "round";
    // 線の太さを画面から取得してセットする
    contextDraw.lineWidth = document.getElementById("pen").value;
    // 線の色を画面から取得してセットする
    contextDraw.strokeStyle = document.getElementById("color").value;

    // 線を描画する
    // 現在のパスをリセットする
    contextDraw.beginPath();
    // パスの始点を指定する
    contextDraw.moveTo(sx, sy);
    // 指定した座標までパスを作成
    contextDraw.lineTo(ex, ey);
    // 作成したパスの描画
    contextDraw.stroke();

    // 終点を始点にセットする
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
  // パターンキャンバスに表示する描画用キャンバス画像のサイズを取得
  const size = getSize();

  // パターンキャンバスのサイズを設定
  canvasPattern.width = size * canvasDraw.width;
  canvasPattern.height = size * canvasDraw.height;

  // 地紋パーツを取得
  // 画像オブジェクトの作成
  const image = new Image();
  // 描画用キャンバスの内容を画像に設定
  image.src = canvasDraw.toDataURL("image/png");

  // 上下左右反転繰り返し描画
  // 画像を取得した際に実行
  image.onload = function() {
    for(let x=0; x<size/2; x++) {
      for(let y=0; y<size/2; y++) {
        // 画像をそのまま表示
        reverse(image, x, y, 1, 1);
        // 右隣に左右反転して表示
        reverse(image, x+1, y, -1, 1);
        // 下に上下反転して表示
        reverse(image, x, y+1, 1, -1);
        // 右斜め下に上下左右反転して表示
        reverse(image, x+1, y+1, -1, -1);
      }
    }
  }
}

// パターンキャンバスに表示する描画用キャンバス画像のサイズを取得
function getSize() {
  const sizeArr = [4, 8, 16];

  for(let i in sizeArr) {
    if(document.getElementById("size_" + sizeArr[i]).checked) {
      return sizeArr[i];
    }
  }
}

// パターンキャンバスに描画用キャンバスの画像を表示する
function reverse(image, x, y, sx, sy){
  // 現在の描画スタイル（線の色や太さ）を保存
  contextPattern.save();
  // キャンバスを移動
  contextPattern.translate(x*2*canvasDraw.width, y*2*canvasDraw.height);
  // 引数にマイナスの値が指定された場合キャンバスを反転
  contextPattern.scale(sx, sy);
  // 幅と高さを指定してイメージを描画する
  contextPattern.drawImage(image, 0, 0, canvasDraw.width, canvasDraw.height);
  // 保存した描画スタイルを呼び出す
  contextPattern.restore();
}

// キャンパスをクリア
function clearPattern() {
  contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
  contextPattern.clearRect(0, 0, canvasPattern.width, canvasPattern.height);
}

// 
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
      // msToBlobを使用できるブラウザ（IE, Edgeの場合）
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
