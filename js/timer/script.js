// タイマーの秒数
const timerDuration = 10;

// タイマーの初期化
let elapsedTime = 0;

// Canvas要素の取得
const canvas = document.getElementById("timerCanvas");
const ctx = canvas.getContext("2d");

// タイマー開始
const timerInterval = setInterval(updateTimer, 1000);

function updateTimer() {
  if (elapsedTime > timerDuration) {
    // タイマー終了時の処理
    clearInterval(timerInterval);
    // alert("タイマー終了！");
  } else {
    drawTimer(elapsedTime);
    elapsedTime++;
  }
}

function drawTimer(seconds) {
  canvas.width = 500;
  canvas.height = 500;

  // カウントダウンの色の描画
  drawColoredSection(seconds);

  // 文字盤の描画
  drawClockFace();
}

function drawColoredSection(seconds) {
  // Canvasの中心座標を計算
  const center = { x: canvas.width / 2, y: canvas.height / 2 };

  // 新しいパスを開始
  ctx.beginPath();

  // パスの始点を中心に移動
  ctx.moveTo(center.x, center.y);

  // 円弧を描画
  // arcメソッドの引数: (x, y, radius, startAngle, endAngle, anticlockwise)
  var startAngle = -0.5 * Math.PI + (seconds / timerDuration) * 2 * Math.PI;
  ctx.arc(center.x, center.y, center.x, startAngle, 1.5 * Math.PI);

  // パスを閉じる
  ctx.closePath();

  // 円弧の内部を赤色で塗りつぶす
  ctx.fillStyle = "#FF0000"; // 赤色
  ctx.fill();
}

function drawClockFace() {
  const center = { x: canvas.width / 2, y: canvas.height / 2 };

  // 文字盤の数字の描画
  ctx.font = "20px 'sans-serif'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#333";
  for (let i = 0; i <= timerDuration - 1; i++) {
    const radian = (i / timerDuration) * 2 * Math.PI;
    const x = center.x + center.x * 0.8 * Math.sin(radian);
    const y = center.y - center.y * 0.8 * Math.cos(radian);
    ctx.fillText(i, x, y);
  }

  // 円を等分する線の描画
  ctx.strokeStyle = "#333"; // 線の色
  ctx.lineWidth = 1; // 線の幅
  ctx.beginPath();
  for (let i = 0; i < timerDuration; i++) {
    const radian = (i / timerDuration) * 2 * Math.PI;
    const startX = center.x + center.x * Math.sin(radian);
    const startY = center.y - center.y * Math.cos(radian);
    const endX = center.x + center.x * 0.9 * Math.sin(radian);
    const endY = center.y - center.y * 0.9 * Math.cos(radian);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
  }
  ctx.stroke();
}
