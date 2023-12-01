<script setup>
import AppHeader from "./components/AppHeader.vue";
import TimerSelection from "./components/TimerSelection.vue";
import TimerController from "./components/TimerController.vue";
import { ref, onMounted } from "vue";

const canvas = ref(0);
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
  resizeCanvas();
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

const resizeCanvas = () => {
  const screenHeight = window.innerHeight;
  canvas.value.width = (screenHeight - 80) * 0.95;
  canvas.value.height = canvas.value.width;
};

const drawTimer = (time) => {
  resizeCanvas();
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
  ctx.value.fillStyle = "#F07317";
  ctx.value.fill();
};

const drawClockFace = () => {
  const center = { x: canvas.value.width / 2, y: canvas.value.height / 2 };

  // 文字盤の数字の描画
  ctx.value.font = "40px 'Inter'";
  ctx.value.textAlign = "center";
  ctx.value.textBaseline = "middle";
  ctx.value.fillStyle = "#32383F";
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
  ctx.value.strokeStyle = "#32383F"; // 線の色
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
  <header class="header container">
    <AppHeader />
  </header>

  <main class="main container">
    <div class="timer">
      <canvas ref="canvas"></canvas>
    </div>

    <div class="timer-items">
      <div class="timer-selection">
        <TimerSelection />
      </div>
      <div class="timer-controller">
        <TimerController
          v-model:timerInputSec="timerInputSec"
          @startTimer="startTimer"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
canvas {
  border: 2px solid var(--vt-c-black);
  border-radius: 50%;
}
.header {
  max-width: 1280px;
  height: 80px;
  display: flex;
  justify-content: space-between;
}

.container {
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;
}

.main {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
}

.timer-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 130px;
}

.timer-selection {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
