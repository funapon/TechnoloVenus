// キャンバス上のボールの数
const NUM_BALL = 65;
// キャンバスの背景色
const BACKGROUND_COLOR = 255;
const balls = new Array(NUM_BALL);

class Ball {
  // 半径最小値
  static RADIUS_MIN = 25;
  // 半径最大値
  static RADIUS_MAX = 50;
  // 移動速度最小値
  static VELOCITY_MIN = -2.5;
  // 移動速度最大値
  static VELOCITY_MAX = 2.5;
  // 透明度、0～255で設定
  static ALPHA = 85;
  
  // 半径
  radius;
  // 中心座標
  centerX;
  centerY;
  //速度
  velocityX;
  velocityY;
  // 色
  color;

  constructor(width, height) {
    this.radius = 
      Math.floor(Math.random() * (Ball.RADIUS_MAX + 1 - Ball.RADIUS_MIN)) + Ball.RADIUS_MIN;
    // ボールがキャンバスの壁に埋まった状態でスタートしないように中心座標を設定、widthはキャンバスの幅、heightはキャンバスの高さ
    this.centerX = random(this.radius, width - this.radius);
    this.centerY = random(this.radius, height - this.radius);
    this.velocityX = random(Ball.VELOCITY_MIN, Ball.VELOCITY_MAX);
    this.velocityY = random(Ball.VELOCITY_MIN, Ball.VELOCITY_MAX);
    this.color = color(random(255), random(255), random(255), Ball.ALPHA);
  }

  // ボールの位置を更新
  updatePosition() {
    this.centerX += this.velocityX;
    this.centerY += this.velocityY;
  }
}

// 初期化処理
// 一度だけ実行される
function setup() {
  // キャンバスの作成
  createCanvas(960, 540);
  // ボールの初期値を設定
  for (let i=0; i<NUM_BALL; i++){
    balls[i] = new Ball(width, height);
  }

  // ボールの枠線は無しにする
  noStroke();
}

// メインループ処理
// setupの実行後に繰り返し実行される
function draw() {
  // キャンバスの背景色を設定
  background(BACKGROUND_COLOR);

  for(let i=0; i<NUM_BALL; i++) {
    const ball = balls[i];

    // ボールの位置を更新
    ball.updatePosition();

    // 左右の壁との当たり判定
    if(ball.centerX - ball.radius <= 0 || ball.centerX + ball.radius >= width) {
      ball.velocityX *= -1;
    }

    // 上下の壁との当たり判定
    if(ball.centerY - ball.radius <= 0 || ball.centerY + ball.radius >= height) {
      ball.velocityY *= -1;
    }
    
    // ボールの塗りつぶし色を設定する
    fill(ball.color);
    // ボールを描画する
    ellipse(ball.centerX, ball.centerY, 2 * ball.radius, 2 * ball.radius);
  }
}