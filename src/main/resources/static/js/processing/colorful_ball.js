// キャンバス上のボールの数
const NUM_BALL = 65;

// ボールの半径
const ballRadius = new Array(NUM_BALL);
// ボールの半径最小値
const ballRadiusMin = 25;
// ボールの半径最大値
const ballRadiusMax = 50;

// ボールの中心座標
const ballCenterX = new Array(NUM_BALL);
const ballCenterY = new Array(NUM_BALL);

// ボールの速度
const ballVelocityX = new Array(NUM_BALL);
const ballVelocityY = new Array(NUM_BALL);
// ボールの速度最小値
const ballVelocityMin = -2.5;
// ボールの速度最大値
const ballVelocityMax = 2.5;

// ボールの色
const ballColor = new Array(NUM_BALL);
// ボールの透明度、0～255で設定
const ballAlpha = 85;

// キャンバスの背景色
const BACKGROUND_COLOR = 255;

// 初期化処理
// 一度だけ実行される
function setup() {
  // キャンバスの作成
  createCanvas(960, 540);
  
  // ボールの初期値を設定
  for (let i=0; i<NUM_BALL; i++){
    ballRadius[i] = randomIntMinMax(ballRadiusMin, ballRadiusMax);
    // ボールがキャンバスの壁に埋まった状態でスタートしないように中心座標を設定、widthはキャンバスの幅、heightはキャンバスの高さ
    ballCenterX[i] = random(ballRadius[i], width - ballRadius[i]);
    ballCenterY[i] = random(ballRadius[i], height - ballRadius[i]);
    ballVelocityX[i] = random(ballVelocityMin, ballVelocityMax);
    ballVelocityY[i] = random(ballVelocityMin, ballVelocityMax);
    ballColor[i] = color(random(255), random(255), random(255), ballAlpha);
  }
}

// メインループ処理
// setupの実行後に繰り返し実行される
function draw() {
  // キャンバスの背景色を設定
  background(BACKGROUND_COLOR);

  for(let i=0; i<NUM_BALL; i++) {
    // ボールの位置を更新
    ballCenterX[i] += ballVelocityX[i];
    ballCenterY[i] += ballVelocityY[i];

    // 左右の壁との当たり判定
    if(ballCenterX[i] - ballRadius[i] <= 0 || ballCenterX[i] + ballRadius[i] >= width) {
      ballVelocityX[i] *= -1;
    }

    // 上下の壁との当たり判定
    if(ballCenterY[i] - ballRadius[i] <= 0 || ballCenterY[i] + ballRadius[i] >= height) {
      ballVelocityY[i] *= -1;
    }
    
    // ボールの枠線は無しにする
    noStroke();
    // ボールの塗りつぶし色を設定する
    fill(ballColor[i]);
    // ボールを描画する
    ellipse(ballCenterX[i], ballCenterY[i], 2 * ballRadius[i], 2 * ballRadius[i]);
  }
}

// minからmaxの範囲で乱数を発生させる関数
function randomIntMinMax(min, max) {
  const rdm = Math.floor(Math.random() * (max + 1 - min)) + min;
  return rdm;
}