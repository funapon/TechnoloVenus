// 変数の宣言
// 実際に模様を書くキャンバス（描画用キャンバス）
const canvasDraw = document.getElementById("canvasDraw");
// 描画機能にアクセスするための2Dコンテキストを取得
const contextDraw = canvasDraw.getContext("2d");

// 描画用キャンバス上に重ねるグリッド（グリッドキャンバス）
const canvasGrid = document.getElementById("canvasGrid");
// 描画機能にアクセスするための2Dコンテキストを取得
const contextGrid = canvasGrid.getContext("2d");

// 生成された地紋が表示されるキャンバス（パターンキャンバス）
const canvasPattern = document.getElementById("canvasPattern");
// 描画機能にアクセスするための2Dコンテキストを取得
const contextPattern = canvasPattern.getContext("2d");

// グリッドの色
const gridColor = "#CCCCCC";

// 描画するラインの始点
let startX;
let startY;

// マウスのボタンが押されているかの状態
let isMouseDown = false;

// 描画用キャンバスの背景色一時保存用
let tmpCanvasDrawColor;

// ページ読み込み時に描画用キャンバスを初期化してグリッドを表示する
setupCanvasDraw();
showGrid();


// 描画用キャンバスの初期化処理
function setupCanvasDraw() {
  // 描画用キャンバスのクリア
  contextDraw.clearRect(0, 0, canvasDraw.width, canvasDraw.height);
  // パターンキャンバスの描画内容が残ってしまうので、パターンキャンバスもクリアする
  contextPattern.clearRect(0, 0, canvasPattern.width, canvasPattern.height);

  // 描画用キャンバスの背景色を取得
  const canvasDrawColor = getCanvasDrawColor();
  // 塗りつぶしのスタイルに取得した背景色を設定する
  contextDraw.fillStyle = canvasDrawColor;
  // 描画用キャンバスの塗りつぶしを実行する
  contextDraw.fillRect(0, 0, canvasDraw.width, canvasDraw.height);

  // 背景色を一時保存する
  tmpCanvasDrawColor = canvasDrawColor;
}

// 描画用キャンバスの背景色を取得する処理
function getCanvasDrawColor() {
  return document.getElementById("background-color").value;
}

// 描画用キャンバスにグリッド線を描画する処理
function showGrid() {
  // 画面項目「グリッド」にチェックありの場合、グリッドを表示する
  if (document.getElementById("grid").checked) {
    // 線の色を設定する
    contextGrid.strokeStyle = gridColor;
    // 線の種類を点線にする、線の長さ、空白の長さの順で引数を指定
    contextGrid.setLineDash([2,2]);
    // 現在のパスをリセットする
    contextGrid.beginPath();
    
    // グリット線の間隔（キャンバス幅の1/4）
    const gridWidth = canvasGrid.width / 4;

    // グリッド線の描画設定
    for(let i=1; i<4; i++) {
      // 縦のグリッド線を描画
      // 開始座標の移動
      contextGrid.moveTo(i*gridWidth, 0);
      // 現在の位置から指定座標までグリッド線を引く
      contextGrid.lineTo(i*gridWidth, canvasGrid.height);
      
      // 横のグリッド線を描画
      // 開始座標の移動
      contextGrid.moveTo(0, i*gridWidth);
      // 現在の一から指定座標までグリッド線を引く
      contextGrid.lineTo(canvasGrid.width, i*gridWidth);
    }
    // グリッド線の描画
    contextGrid.stroke();
  } 
  // チェックなしの場合、グリッドを非表示にする
  else {
    contextGrid.clearRect(0, 0, canvasGrid.width, canvasGrid.height);
  }
}

function startDraw(event) {
  // マウスボタンの状態を更新
  isMouseDown = true;
  // 描画用キャンバスの矩形情報を取得
  const canvasRect = canvasDraw.getBoundingClientRect();
  // 始点をセット
  startX = event.clientX - canvasRect.left;
  startY = event.clientY - canvasRect.top;
}

function draw(event) {
  // マウスボタンが押されているとき描画
  if(isMouseDown) {
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
    contextDraw.moveTo(startX, startY);
    // 指定した座標までパスを作成
    contextDraw.lineTo(ex, ey);
    // 作成したパスの描画
    contextDraw.stroke();

    // 終点を始点にセットする
    startX = ex;
    startY = ey;

    // 地紋画像を描画
    drawPattern();
  }
}

function endDraw(event) {
  // マウスボタンが離された
  isMouseDown = false;
}

function drawPattern(e) {
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
  // 画像サイズのラジオボタンを取得
  const elms = document.getElementsByClassName("size");

  // 選択されているラジオボタンのサイズを取得する
  for(let i=0; i < elms.length; i++) {
    const item = elms.item(i);
    if(item.checked) {
      return parseInt(item.dataset["size"]);
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

// 画像保存 
function savePattern(target) {
  // 保存するキャンバス
  const targetCanvas = target;

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

// イベントリスナーの追加
// クリアボタンが押された時
document.getElementById("clear_btn").addEventListener("click", setupCanvasDraw);

// 表示サイズのラジオボタンを変更した時
// 表示サイズのラジオボタンのHTML1Collectionを取得
const sizeElms = document.getElementsByClassName("size");
// 取得した要素に対し1件ずつイベント追加
for(let i=0; i < sizeElms.length; i++) {
  sizeElms[i].addEventListener("change", drawPattern);
}
// 画像保存ボタンを押した時
// 画像保存ボタンのHTMLCollectionを取得
const saveElms = document.getElementsByClassName("save");
// 取得した要素に対し1兼ずつイベント追加
for(let i=0; i < saveElms.length; i++) {
  saveElms.item(i).addEventListener("click", function(e) {
    // 保存対象キャンバスをボタンのidから取得
    const targetId = e.target.id;

    // 対象キャンバスを画像として保存する
    if(targetId === "save_draw") {
      savePattern("canvasDraw");
    } else if(targetId === "save_pattern") {
      savePattern("canvasPattern");
    }
  });
}

// グリッドキャンバス上でマウスのボタンを押した時
canvasGrid.addEventListener("mousedown", startDraw);
// グリッドキャンバス上でマウスを移動した時
canvasGrid.addEventListener("mousemove", draw);
// グリッドキャンバス上でマウスのボタンを離したとき
canvasGrid.addEventListener("mouseup", endDraw);
// グリッドキャンバス上からマウスボタンが離れたとき
canvasGrid.addEventListener("mouseleave", endDraw);

// グリッドチェックボックスを変更した時
document.getElementById("grid").addEventListener("change", showGrid);

// 描画用キャンバスの背景色の変更時
document.getElementById("background-color").addEventListener("change", function(e) {
  if(confirm("作成した内容がクリアされますがよろしいですか。")) {
    // はいの場合キャンバスのクリア
    setupCanvasDraw();
  } else {
    // キャンセルの場合、背景色に前回一時保存した背景色をセット
    document.getElementById("background-color").value = tmpCanvasDrawColor;
  }
});