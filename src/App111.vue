<script setup>
import { ref, onMounted } from "vue";

const canvas = ref(null);
const ctx = ref(null);
const timerMode = ref("");
const timerInputSec = ref("");
const timerInputMin = ref("");
const timerDuration = ref(); // 5 ~ 3600
const elapsedSeconds = ref(0); // 0 ~ 3600
const timerInterval = ref(null);

// onMounted フックで canvas 要素とコンテキストを取得
onMounted(() => {
  ctx.value = canvas.value.getContext("2d");
  canvas.value.width = 500;
  canvas.value.height = 500;
  drawClockFace();
});

const startTimer = (mode) => {
  timerMode.value = mode;
  if (timerMode.value === "seconds") {
    timerDuration.value = parseInt(timerInputSec.value, 10);
  } else if (timerMode.value === "minutes") {
    timerDuration.value = parseInt(timerInputMin.value, 10);
  }

  // 初期化
  elapsedSeconds.value = 0;
  clearInterval(timerInterval.value);

  timerInterval.value = setInterval(updateTimer, 1000);
};

const updateTimer = () => {
  if (elapsedSeconds.value > timerDuration.value) {
    clearInterval(timerInterval.value);
    // alert("タイマー終了！");
  } else {
    drawTimer(elapsedSeconds.value);
    elapsedSeconds.value++; // 1, 2, 3 ..., 3600
  }
};

const drawTimer = (time) => {
  canvas.value.width = 500;
  canvas.value.height = 500;

  drawColoredSection(time); // カウントダウンの色の描画
  drawClockFace(); // 文字盤の描画
};

const drawColoredSection = (time) => {
  // Canvasの中心座標を計算
  const center = { x: canvas.value.width / 2, y: canvas.value.height / 2 };

  // 新しいパスを開始
  ctx.value.beginPath();

  // パスの始点を中心に移動
  ctx.value.moveTo(center.x, center.y);

  // 円弧を描画
  const startAngle = -0.5 * Math.PI;
  const endAngle = getEndAngle(time);
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
  ctx.value.font = "40px 'Inter'";
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

const getEndAngle = (time) => {
  if (timerMode.value === "seconds") {
    return (
      -0.5 * Math.PI +
      (((360 / 60) * timerDuration.value) / 180) * Math.PI -
      (((360 / 60) * time) / 180) * Math.PI
    );
  } else if (timerMode.value === "minutes") {
    return (
      -0.5 * Math.PI +
      (((360 / 60) * (timerDuration.value / 60)) / 180) * Math.PI -
      (((360 / 60) * time) / 60 / 180) * Math.PI
    );
  }
};
</script>

<template>
  <div class="container">
    <div>
      <select name="timerInputSec" v-model="timerInputSec">
        <option value="" hidden>ここからえらべるよ</option>
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
      <button class="btn" @click="startTimer('seconds')">すたーと</button>
    </div>

    <div>
      <select name="timerInputMin" v-model="timerInputMin">
        <option value="" hidden>ここからえらべるよ</option>
        <option value="60">1分</option>
        <option value="120">2分</option>
        <option value="180">3分</option>
        <option value="240">4分</option>
        <option value="300">5分</option>
        <option value="600">10分</option>
        <option value="900">15分</option>
        <option value="1200">20分</option>
        <option value="1500">25分</option>
        <option value="1800">30分</option>
        <option value="2100">35分</option>
        <option value="2400">40分</option>
        <option value="2700">45分</option>
        <option value="3000">50分</option>
        <option value="3300">55分</option>
        <option value="3600">60分</option>
      </select>
      <button class="btn" @click="startTimer('minutes')">すたーと</button>
      <p>あいうえお12345aiueo</p>
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
