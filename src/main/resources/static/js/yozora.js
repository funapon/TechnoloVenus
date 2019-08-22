/*
 * runstant
 */

phina.globalize();

var ASSETS = {
  image: {
    'majokko': 'https://raw.githubusercontent.com/funayu/storage/images/008.png',
    'bg': 'https://raw.githubusercontent.com/funayu/storage/master/images/bg/yozora800600_1.png'
  }
}

phina.define('MainScene', {
  superClass: 'CanvasScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit();
    
    // 背景
    Sprite('bg').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

    // TODO: ここにコードを書いていく
    //魔女っ子の表示  
  　var majokko = Sprite('majokko').addChildTo(this);
  　
  　majokko.x = (this.gridX.center())-200;
  　majokko.y = this.gridY.center();
  　majokko.width = 150;
  　majokko.height = 150;
  　//移動速度
  　majokko.vx = 3;
    majokko.update = function(){
      //移動
      this.x += this.vx;
    }

    var self = this;
    self.backgroundColor = 'skyblue';
  },
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    assets: ASSETS,
  });
  
  app.run();
});
