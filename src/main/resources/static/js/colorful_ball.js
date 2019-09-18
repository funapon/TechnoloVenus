// ボールの数
const numBalls = 65;
const x = new Array(numBalls);
const y = new Array(numBalls);
const vx = new Array(numBalls);
const vy = new Array(numBalls);
const radius = new Array(numBalls);
const c = new Array(numBalls);

// 初期化
function setup() {
  // キャンバスの作成
  createCanvas(960, 540,);
  
  // ボールの作成
  for (let i=0; i<numBalls; i++){
    radius[i] = randomIntMinMax(25, 50);
    x[i] = random(radius[i], width-radius[i]);
    y[i] = random(radius[i], height-radius[i]);
    vx[i] = random(-2.5, 2.5);
    vy[i] = random(-2.5, 2.5);
    c[i] = color(random(255), random(255), random(255), 85);
  }
}

// メインループ処理
function draw() {
  background(255);

  for(let i=0; i<numBalls; i++) {
    // ボールの位置を更新
    x[i] += vx[i];
    y[i] += vy[i];

    // 左右の壁との当たり判定
    if(x[i]-radius[i] <= 0 || x[i]+radius[i] >= width) {
      vx[i] *= -1;
    }

    // 上下の壁との当たり判定
    if(y[i]-radius[i] <= 0 || y[i]+radius[i] >= height) {
      vy[i] *= -1;
    }
    
    // ボールを描画
    noStroke();
    fill(c[i]);
    ellipse(x[i], y[i], 2*radius[i], 2*radius[i]);
  }
}

// minからmaxの範囲で乱数を発生させる関数
function randomIntMinMax(min, max) {
  const rdm = Math.floor(Math.random() * (max + 1 - min)) + min;
  return rdm;
}