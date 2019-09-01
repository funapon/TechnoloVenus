phina.globalize();

// アセットの定義
var ASSETS = {
  image: {
    // 魔女っ子の画像
    'majokko': 'https://raw.githubusercontent.com/funayu/storage/images/008.png',
    // 背景画像
    'bg': 'https://raw.githubusercontent.com/funayu/storage/master/images/bg/yozora800600_1.png'
  }
}

/**
 * メインシーンの処理
 */
phina.define('MainScene', {
  // 繼承
  superClass: 'CanvasScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit();
    
    // 背景に背景画像を指定
    Sprite('bg').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

    //魔女っ子画像作成
  　var majokko = Sprite('majokko').addChildTo(this);
  　
    // 初期位置
  　majokko.x = (this.gridX.center())-200;
  　majokko.y = this.gridY.center();
    // 画像サイズ
  　majokko.width = 150;
  　majokko.height = 150;
  　// 移動速度を指定
  　majokko.vx = 3;

    // 毎フレームごとに実行する処理
    majokko.update = function() {
      // 画像がフレームの右端、または左端まで行ったかを判定する
      if(this.right === 600 || this.left===0){
        // 移動方向を反転する
        this.vx *=-1;
        // 魔女っ子画像の向きを反転する
        this.scaleX *=-1;
      } 
      
      // 魔女っ子の移動
      this.x += this.vx;
    };
  },
});

/** 
 * メインの処理
*/
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // メインシーン ら開始
    startLabel: 'main',
    // アセット読み込み
    assets: ASSETS,
  });
  
  // アプリケーションの実行
  app.run();
});
