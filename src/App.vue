<script setup>
import AppHeader from "./components/AppHeader.vue";
import TimerSelection from "./components/TimerSelection.vue";
import TimerController from "./components/TimerController.vue";
import { ref, onMounted } from "vue";
import Konva from "konva";

const stage = ref(null);
const layer = ref(null);
const circle = ref(null);
const arc = ref(null);
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
  initCanvas();
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
    alert("タイマー終了！");
  } else {
    drawCountDown();
    elapsedSeconds.value++; // 1, 2, 3 ..., 3600
  }
};

const initCanvas = () => {
  ctx.value = canvas.value.getContext("2d");

  stage.value = new Konva.Stage({
    container: "container",
    width: 600,
    height: 600,
  });

  layer.value = new Konva.Layer();

  circle.value = new Konva.Circle({
    x: stage.value.width() / 2,
    y: stage.value.height() / 2,
    radius: 290,
    fill: "#FFF",
    stroke: "#32383F",
    strokeWidth: 0,
    shadowColor: "#32383F",
    shadowBlur: 8,
  });

  // レイヤーに円を追加
  layer.value.add(circle.value);

  // ステージにレイヤーを追加
  stage.value.add(layer.value);
};

const drawClockFace = () => {
  const center = { x: circle.value.x(), y: circle.value.y() };

  // 文字盤の数字の描画
  for (let i = 0; i < 60; i++) {
    const radian = (i / 60) * 2 * Math.PI;

    if (i % 5 !== 0) {
      continue;
    }

    const startNumberPosition = 0.85;
    const x = center.x + center.x * startNumberPosition * Math.sin(radian);
    const y = center.y - center.y * startNumberPosition * Math.cos(radian);

    const number = new Konva.Text({
      x: x,
      y: y,
      text: i.toString(),
      fontSize: 40,
      fontFamily: "Inter",
      fill: "#32383F",
    });
    number.offsetX(number.width() / 2);
    number.offsetY(number.height() / 2);

    layer.value.add(number);
  }

  // 円を等分する線の描画
  for (let i = 0; i < 60; i++) {
    const radian = (i / 60) * 2 * Math.PI;
    const startLinePosition = 0.7;
    const endLinePosition = startLinePosition - 0.03;
    const startX = center.x + center.x * startLinePosition * Math.sin(radian);
    const startY = center.y - center.y * startLinePosition * Math.cos(radian);
    const endX = center.x + center.x * endLinePosition * Math.sin(radian);
    const endY = center.y - center.y * endLinePosition * Math.cos(radian);

    if (i % 5 === 0) {
      // 太線
      const line = new Konva.Line({
        points: [startX, startY, endX, endY],
        stroke: "#5A77D5",
        strokeWidth: 8,
      });

      const circleStart = new Konva.Circle({
        x: startX,
        y: startY,
        radius: 3.5,
        fill: "#5A77D5",
      });

      const circleEnd = new Konva.Circle({
        x: endX,
        y: endY,
        radius: 3.5,
        fill: "#5A77D5",
      });

      layer.value.add(line, circleStart, circleEnd);
    } else if (i % 5 !== 0) {
      // 短線
      const line = new Konva.Line({
        points: [startX, startY, endX, endY],
        stroke: "#32383F",
        strokeWidth: 1,
      });

      layer.value.add(line);
    }
  }
};

const drawCountDown = () => {
  const center = { x: circle.value.x(), y: circle.value.y() };

  if (arc.value) {
    arc.value.angle(getEndAngle());
  } else {
    arc.value = new Konva.Arc({
      x: center.x,
      y: center.y,
      innerRadius: 0,
      outerRadius: 190,
      angle: getEndAngle(),
      fill: "#f07317",
      opacity: 0.7,
      rotation: -90, // 開始角度を設定（-90度は12時の位置）
    });

    layer.value.add(arc.value);
  }
};

const getEndAngle = () => {
  if (timerMode.value === "seconds") {
    return (timerDuration.value - elapsedSeconds.value) * 6;
  }
  // else if (timerMode.value === "minutes") {
  // return ((timerDuration.value - elapsedSeconds.value) * 6);
  // }
};
</script>

<template>
  <header class="header container">
    <AppHeader />
  </header>

  <main class="main container">
    <div id="container" class="timer">
      <canvas ref="canvas"></canvas>
    </div>

    <div class="timer-items">
      <div class="timer-selection">
        <TimerSelection />
      </div>
      <div class="timer-controller">
        <TimerController
          v-model:timerInputSec="timerInputSec"
          @start-timer="startTimer"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
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

.timer{
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
