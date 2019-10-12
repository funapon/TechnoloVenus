// 描画するラインの始点
let startX;
let startY;

// マウスのボタンが押されているかの状態
let isMouseDown = false;

// 描画用キャンバスの背景色一時保存用
let tmpCanvasDrawColor;

class Draw {
  // 線端の形、丸にする
  static LINE_CAP = "round";

  // 実際に模様を書くキャンバス（描画用キャンバス）
  canvasDraw;
  // 描画機能にアクセスするための2Dコンテキスト
  contextDraw;

  constructor() {
    this.canvasDraw = document.getElementById("canvasDraw");
    this.contextDraw = this.canvasDraw.getContext("2d");
  }

  // キャンバスのクリア
  clearCanvas() {
    this.contextDraw.clearRect(0, 0, this.canvasDraw.width, this.canvasDraw.height);
  }

  // 塗りつぶしのスタイルに取得した背景色を設定する
  setFillColor(color) {
    this.contextDraw.fillStyle = color;
  }

  // キャンバスの塗りつぶしを実行する
  fillCanvas() {
    this.contextDraw.fillRect(0, 0, this.canvasDraw.width, this.canvasDraw.height);
  }

  // 描画用キャンバスへ描画するための事前処理
  startDraw(event) {
    // マウスボタンの状態を更新
    isMouseDown = true;
    // 描画用キャンバスの矩形情報を取得
    // const canvasRect = this.canvasDraw.getBoundingClientRect();
    const canvasRect = this.canvasDraw.getBoundingClientRect();
    // 始点をセット
    startX = event.clientX - canvasRect.left;
    startY = event.clientY - canvasRect.top;
  }

  // 描画用キャンバスへの描画処理
  draw(event) {
    // マウスボタンが押されている場合に描画する
    if(isMouseDown === false) return;
    
    // 描画用キャンバスの矩形情報を取得
    const canvasRect = this.canvasDraw.getBoundingClientRect();
    // 終点をセット
    const endX = event.clientX - canvasRect.left;
    const endY = event.clientY - canvasRect.top;

    // 描画する線の設定
    // 線の先端の形をセットする
    this.contextDraw.lineCap = Draw.LINE_CAP;
    // 線の太さを画面から取得してセットする
    this.contextDraw.lineWidth = document.getElementById("pen").value;
    // 線の色を画面から取得してセットする
    this.contextDraw.strokeStyle = document.getElementById("color").value;
    
    // 線を描画する
    // 現在のパスをリセットする
    this.contextDraw.beginPath();
    // パスの始点を指定する
    this.contextDraw.moveTo(startX, startY);
    // 始点から引数の終点座標までパスを作成
    this.contextDraw.lineTo(endX, endY);
    // 作成したパスの描画
    this.contextDraw.stroke();
  
    // 終点を始点にセットする
    startX = endX;
    startY = endY;
  }

  // 描画用キャンバスへの描画を終了する処理
  endDraw(event) {
  // マウスボタンの状態を更新
  isMouseDown = false;
  }
}

class Grid {
  // グリッドの色
  static GRID_COLOR = "#CCCCCC";

  // 描画用キャンバス上に重ねるグリッド（グリッドキャンバス）
  canvasGrid;
  // 描画機能にアクセスするための2Dコンテキスト
  contextGrid;
  // グリット線の間隔
  gridWidth;

  constructor() {
    this.canvasGrid = document.getElementById("canvasGrid");
    this.contextGrid = this.canvasGrid.getContext("2d");
    this.gridWidth = this.canvasGrid.width / 4;
  }

  // キャンバスのクリア
  clearCanvas() {
    this.contextGrid.clearRect(0, 0, this.canvasGrid.width, this.canvasGrid.height);
  }

  // 描画用キャンバスにグリッド線を描画する処理
  strokeGrid() {
    // 線の色を設定する
    this.contextGrid.strokeStyle = Grid.GRID_COLOR;
    // 線の種類を点線にする、線の長さ、空白の長さの順で引数を指定
    this.contextGrid.setLineDash([2,2]);
    // 現在のパスをリセットする
    this.contextGrid.beginPath();

    // グリッド線の描画設定
    for(let i=1; i<4; i++) {
      // 縦のグリッド線描画設定
      // 開始座標の移動
      this.contextGrid.moveTo(i*this.gridWidth, 0);
      // 現在の位置から指定座標までグリッド線のパスを設定する
      this.contextGrid.lineTo(i*this.gridWidth, this.canvasGrid.height);
      
      // 横のグリッド線描画設定
      // 開始座標の移動
      this.contextGrid.moveTo(0, i*this.gridWidth);
      // 現在の位置から指定座標までグリッド線のパスを設定する
      this.contextGrid.lineTo(this.canvasGrid.width, i*this.gridWidth);
    }
    // グリッド線の描画
    this.contextGrid.stroke();
  }
}

class Pattern {
  // 生成された地紋が表示されるキャンバス（パターンキャンバス）
  canvasPattern;
  // 描画機能にアクセスするための2Dコンテキスト
  contextPattern;
  
  constructor() {
    this.canvasPattern = document.getElementById("canvasPattern");
    this.contextPattern = this.canvasPattern.getContext("2d");
  }
  // キャンバスのクリア
  clearCanvas() {
    this.contextPattern.clearRect(0, 0, this.canvasPattern.width, this.canvasPattern.height);
  }

  // パターンキャンバスへの描画処理
  drawPattern(event, canvasDrawWidth, canvasDrawHeight, canvasDraw) {
    // パターンキャンバスに表示する描画用キャンバス画像のサイズを取得
    const size = this.getSize();

    // パターンキャンバスのサイズを設定
    // this.canvasWidth = size * canvasDrawWidth;
    // this.canvasHeight = size * canvasDrawHeight;
    this.canvasPattern.width = size * canvasDrawWidth;
    this.canvasPattern.height = size * canvasDrawHeight;

    // 描画用キャンバスの描画内容を画像として取得
    // 画像オブジェクトの作成
    const image = new Image();
    // 描画用キャンバスの内容を画像に設定
    image.src = canvasDraw.toDataURL("image/png");

    // 上下左右反転繰り返し描画
    // 画像を取得した際に実行
    image.onload = ()=> {
      for(let x=0; x < size / 2; x++) {
        for(let y=0; y < size / 2; y++) {
          // 画像をそのまま表示
          this.reverseImage(image, x, y, 1, 1, canvasDrawWidth, canvasDrawHeight);
          // 右隣に左右反転して表示
          this.reverseImage(image, x+1, y, -1, 1, canvasDrawWidth, canvasDrawHeight);
          // 下に上下反転して表示
          this.reverseImage(image, x, y+1, 1, -1, canvasDrawWidth, canvasDrawHeight);
          // 右斜め下に上下左右反転して表示
          this.reverseImage(image, x+1, y+1, -1, -1, canvasDrawWidth, canvasDrawHeight);
        }
      }
    }
  }

  // パターンキャンバスに表示する描画用キャンバス画像のサイズを取得
  getSize() {
    // 画像サイズのラジオボタンを取得
    const elms = document.getElementsByClassName("size");

    // 選択されているサイズを取得する
    for(let i=0; i < elms.length; i++) {
      const item = elms.item(i);
      if(item.checked) {
        return parseInt(item.dataset["size"]);
      }
    }
  }

  // 画像をパラメータの値で反転して表示する処理
  reverseImage(image, x, y, sx, sy, canvasDrawWidth, canvasDrawHeight) {
    // 現在の描画スタイル（線の色や太さ）を保存
    this.contextPattern.save();
    // 描画する位置を移動
    this.contextPattern.translate(x * 2 * canvasDrawWidth, y * 2 * canvasDrawHeight);
    // 引数にマイナスの値が指定された場合キャンバスを反転
    this.contextPattern.scale(sx, sy);
    // 幅と高さを指定してイメージを描画する
    this.contextPattern.drawImage(image, 0, 0, canvasDrawWidth, canvasDrawHeight);
    // 保存した描画スタイルを呼び出す
    this.contextPattern.restore();
  }
}

// オブジェクトの作成
const draw = new Draw();
const grid = new Grid();
const pattern = new Pattern();

// ページ読み込み時に描画用キャンバスを初期化してグリッドを表示する
initCanvasDraw();
showGrid();

// 描画用キャンバスの初期化処理
function initCanvasDraw() {
  // 描画用キャンバスのクリア
  draw.clearCanvas();
  // パターンキャンバスの描画内容が残ってしまうので、パターンキャンバスもクリアする
  pattern.clearCanvas();

  // 描画用キャンバスの背景色を取得
  const canvasDrawColor = getCanvasDrawColor();
  // 塗りつぶしのスタイルに取得した背景色を設定する
  draw.setFillColor(canvasDrawColor);
  // 描画用キャンバスの塗りつぶしを実行する
  draw.fillCanvas();

  // 背景色を一時保存する
  tmpCanvasDrawColor = canvasDrawColor;
}

// 描画用キャンバスの背景色を取得する処理
function getCanvasDrawColor() {
  return document.getElementById("background-color").value;
}

// 描画用キャンバスのグリッド線の表示非表示を判定する処理
function showGrid() {
  // 画面項目「グリッド」にチェックありの場合、グリッドを表示する
  if (document.getElementById("grid").checked) {
    grid.strokeGrid();
  } 
  // チェックなしの場合、グリッド線を非表示にする
  else {
    grid.clearCanvas();
  }
}

// キャンバスの画像を保存する処理 
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
document.getElementById("clear_btn").addEventListener("click", initCanvasDraw);

// 表示サイズのラジオボタンを変更した時
// 表示サイズのラジオボタンのHTML1Collectionを取得
const sizeElms = document.getElementsByClassName("size");
// 取得した要素に対し1件ずつイベント追加
for(let i=0; i < sizeElms.length; i++) {
  sizeElms.item(i).addEventListener("change", function(e) {
    pattern.drawPattern(e, draw.canvasDraw.width, draw.canvasDraw.height, draw.canvasDraw);
  });
}
// 画像保存ボタンを押した時
// 画像保存ボタンのHTMLCollectionを取得
const saveElms = document.getElementsByClassName("save");
// 取得した要素に対し1件ずつイベント追加
for(let i=0; i < saveElms.length; i++) {
  saveElms.item(i).addEventListener("click", function(e) {
    // 保存対象キャンバスをボタンのidから取得
    const targetId = e.target.id;

    // 対象キャンバスを画像として保存する
    if(targetId === "save_draw") {
      savePattern(draw.canvasDraw);
    } else if(targetId === "save_pattern") {
      savePattern(pattern.canvasPattern);
    }
  });
}

// グリッドキャンバス上でマウスのボタンを押した時
grid.canvasGrid.addEventListener("mousedown", (e)=> draw.startDraw(e));
// グリッドキャンバス上でマウスを移動した時
grid.canvasGrid.addEventListener("mousemove", function(e) {
  draw.draw(e);
  pattern.drawPattern(e, draw.canvasDraw.width, draw.canvasDraw.height, draw.canvasDraw);
});

// グリッドキャンバス上でマウスのボタンを離したとき
grid.canvasGrid.addEventListener("mouseup", draw.endDraw);

// グリッドキャンバス上からマウスボタンが離れたとき
grid.canvasGrid.addEventListener("mouseleave", draw.endDraw);

// グリッドチェックボックスを変更した時
document.getElementById("grid").addEventListener("change", showGrid);

// 描画用キャンバスの背景色の変更時
document.getElementById("background-color").addEventListener("change", function(e) {
  if(confirm("作成した内容がクリアされますがよろしいですか。")) {
    // はいの場合キャンバスのクリア
    initCanvasDraw();
  } else {
    // キャンセルの場合、背景色に前回一時保存した背景色をセット
    document.getElementById("background-color").value = tmpCanvasDrawColor;
  }
});