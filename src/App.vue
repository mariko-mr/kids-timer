<script setup>
import { ref, onMounted } from "vue";

// Canvas要素の取得
const canvas = ref(null);
const ctx = ref(null);
const timerInput = ref("");
const timerDuration = ref();
const elapsedTime = ref(0);
const timerInterval = ref(null);

// onMounted フックで canvas 要素とコンテキストを取得
onMounted(() => {
  ctx.value = canvas.value.getContext("2d");
  canvas.value.width = 500;
  canvas.value.height = 500;
  drawClockFace();
});

const startTimer = () => {
  timerDuration.value = parseInt(timerInput.value, 10); // タイマーの秒数
  elapsedTime.value = 0; //タイマーの初期化

  // Clear any existing timer intervals
  clearInterval(timerInterval.value);

  // タイマー開始
  timerInterval.value = setInterval(updateTimer, 1000);
};

const updateTimer = () => {
  if (elapsedTime.value > timerDuration.value) {
    // タイマー終了時の処理
    clearInterval(timerInterval.value);
    // alert("タイマー終了！");
  } else {
    drawTimer(elapsedTime.value);
    elapsedTime.value++;
  }
};

const drawTimer = (seconds) => {
  canvas.value.width = 500;
  canvas.value.height = 500;

  drawColoredSection(seconds); // カウントダウンの色の描画
  drawClockFace(); // 文字盤の描画
};

// 選択した秒数を塗りつぶす
const drawColoredSection = (seconds) => {
  // Canvasの中心座標を計算
  const center = { x: canvas.value.width / 2, y: canvas.value.height / 2 };

  // 新しいパスを開始
  ctx.value.beginPath();

  // パスの始点を中心に移動
  ctx.value.moveTo(center.x, center.y);

  // 円弧を描画
  // arcメソッドの引数: (x, y, radius, startAngle, endAngle, anticlockwise)
  const startAngle = -0.5 * Math.PI;
  const endAngle =
    -0.5 * Math.PI +
    (((360 / 60) * timerDuration.value) / 180) * Math.PI -
    (((360 / 60) * seconds) / 180) * Math.PI;
  ctx.value.arc(center.x, center.y, center.x, startAngle, endAngle);

  // パスを閉じる
  ctx.value.closePath();

  // 円弧の内部で塗りつぶす
  ctx.value.fillStyle = "#f06060";
  ctx.value.fill();
};

const drawClockFace = () => {
  const center = { x: canvas.value.width / 2, y: canvas.value.height / 2 };

  // 文字盤の数字の描画
  ctx.value.font = "20px 'sans-serif'";
  ctx.value.textAlign = "center";
  ctx.value.textBaseline = "middle";
  ctx.value.fillStyle = "#333";
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      continue;
    }

    const radian = (i / 60) * 2 * Math.PI;
    const x = center.x + center.x * 0.75 * Math.sin(radian);
    const y = center.y - center.y * 0.75 * Math.cos(radian);
    ctx.value.fillText(i, x, y);
  }

  // 円を等分する線の描画
  ctx.value.strokeStyle = "#333"; // 線の色
  ctx.value.lineWidth = 1.5; // 線の幅
  ctx.value.beginPath();
  for (let i = 0; i < 60; i++) {
    const radian = (i / 60) * 2 * Math.PI;
    const startX = center.x + center.x * Math.sin(radian);
    const startY = center.y - center.y * Math.cos(radian);
    const endX = center.x + center.x * 0.9 * Math.sin(radian);
    const endY = center.y - center.y * 0.9 * Math.cos(radian);
    ctx.value.moveTo(startX, startY);
    ctx.value.lineTo(endX, endY);

    if (i % 5 === 0) {
      const endX = center.x + center.x * 0.85 * Math.sin(radian);
      const endY = center.y - center.y * 0.85 * Math.cos(radian);
      ctx.value.moveTo(startX, startY);
      ctx.value.lineTo(endX, endY);
    }
  }
  ctx.value.stroke();
};
</script>

<template>
  <div class="container">
    <div>
      <select v-model="timerInput">
        <option value="" hidden>選択してください</option>
        <option value="5">5秒</option>
        <option value="10">10秒</option>
        <option value="15">15秒</option>
        <option value="20">20秒</option>
        <option value="25">25秒</option>
        <option value="30">30秒</option>
        <option value="35">35秒</option>
        <option value="40">40秒</option>
        <option value="45">45秒</option>
        <option value="50">50秒</option>
        <option value="55">55秒</option>
        <option value="60">60秒</option>
      </select>
      <button class="btn" @click="startTimer()">
        すたーと - START -
      </button>
    </div>

    <canvas ref="canvas"></canvas>
  </div>
</template>

<style>
canvas {
  border: 2px solid #333;
  border-radius: 50%;
}
</style>
