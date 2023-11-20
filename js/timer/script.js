// Canvas要素の取得
const canvas = document.getElementById("timerCanvas");
const ctx = canvas.getContext("2d");

let timerDuration = 0;
let elapsedTime = 0;
let timerInterval = setInterval(updateTimer, 1000);

const timerInput = document.getElementById("timerInput");

// 全角入力を半角入力に変換 ///////////////
const inputNumbers = document.querySelectorAll(".timer-input-numbers");

for (const inputNumber of inputNumbers) {
  inputNumber.addEventListener("input", convertInputNumber);
}

function convertInputNumber(e) {
  let val = this.value;
  // 全角数字を半角数字に変換
  val = val.replace(/[０-９]/g, function (s) {
    return "０１２３４５６７８９".indexOf(s);
  });
  // 半角数字以外が含まれる場合は空にする
  if (val.match(/[^0-9]/)) val = "";
  this.value = val;
}
/////////////////////////////////////////

drawClockFace();

// タイマーを起動
function startTimer(duration) {
  timerDuration = duration; // タイマーの秒数
  elapsedTime = 0; //タイマーの初期化

  // Clear any existing timer intervals
  clearInterval(timerInterval);

  // タイマー開始
  timerInterval = setInterval(updateTimer, 1000);
}

function startTimerFromInput() {
  const inputValue = parseInt(timerInput.value, 10);

  if (!isNaN(inputValue) && inputValue > 0) {
    // 入力が正常な場合はタイマーを開始
    startTimer(inputValue);
  } else {
    // 入力が無効な場合はアラートなどでユーザーに通知
    alert("0より大きな整数を入力してね");
  }
}

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

  drawColoredSection(seconds); // カウントダウンの色の描画
  drawClockFace(); // 文字盤の描画
}

// 選択した秒数を塗りつぶす
function drawColoredSection(seconds) {
  // Canvasの中心座標を計算
  const center = { x: canvas.width / 2, y: canvas.height / 2 };

  // 新しいパスを開始
  ctx.beginPath();

  // パスの始点を中心に移動
  ctx.moveTo(center.x, center.y);

  // // 円弧を描画
  // // arcメソッドの引数: (x, y, radius, startAngle, endAngle, anticlockwise)
  // ここを修正 /////////////////
  var startAngle = -0.5 * Math.PI;
  var endAngle = -0.5 * Math.PI + (((360 / 60) * timerDuration) / 180) * Math.PI - (((360 / 60) * seconds) / 180) * Math.PI;
  ctx.arc(center.x, center.y, center.x, startAngle, endAngle);
  //////////////////////////////

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
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      continue;
    }

    const radian = (i / 60) * 2 * Math.PI;
    const x = center.x + center.x * 0.75 * Math.sin(radian);
    const y = center.y - center.y * 0.75 * Math.cos(radian);
    ctx.fillText(i, x, y);
  }

  // 円を等分する線の描画
  ctx.strokeStyle = "#333"; // 線の色
  ctx.lineWidth = 1; // 線の幅
  ctx.beginPath();
  for (let i = 0; i < 60; i++) {
    const radian = (i / 60) * 2 * Math.PI;
    const startX = center.x + center.x * Math.sin(radian);
    const startY = center.y - center.y * Math.cos(radian);
    const endX = center.x + center.x * 0.9 * Math.sin(radian);
    const endY = center.y - center.y * 0.9 * Math.cos(radian);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    if (i % 5 === 0) {
      const endX = center.x + center.x * 0.85 * Math.sin(radian);
      const endY = center.y - center.y * 0.85 * Math.cos(radian);
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
  }
  ctx.stroke();
}
