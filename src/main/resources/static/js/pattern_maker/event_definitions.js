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
