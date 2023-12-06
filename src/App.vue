<script setup>
import AppHeader from "./components/AppHeader.vue";
import { ref, onMounted } from "vue";
import Konva from "konva";

const stage = ref(null);
const layer = ref(null);
const circle = ref(null);
const arc = ref(null);
const canvas = ref(0);
const ctx = ref(null);
const buttonMode = ref("seconds");
const timerMode = ref("seconds");
const timerInputSeconds = ref(30);
const timerInputMinutes = ref(1800);
const timerDuration = ref(0); // 5 ~ 3600
const elapsedSeconds = ref(0); // 0 ~ 3600
const timerInterval = ref(0);

const seconds = [
  { label: "5秒", value: 5 },
  { label: "10秒", value: 10 },
  { label: "15秒", value: 15 },
  { label: "20秒", value: 20 },
  { label: "25秒", value: 25 },
  { label: "30秒", value: 30 },
  { label: "35秒", value: 35 },
  { label: "40秒", value: 40 },
  { label: "45秒", value: 45 },
  { label: "50秒", value: 50 },
  { label: "55秒", value: 55 },
  { label: "60秒", value: 60 },
];

const minutes = [
  { label: "1分", value: 60 },
  { label: "2分", value: 120 },
  { label: "3分", value: 180 },
  { label: "4分", value: 240 },
  { label: "5分", value: 300 },
  { label: "10分", value: 600 },
  { label: "15分", value: 900 },
  { label: "20分", value: 1200 },
  { label: "25分", value: 1500 },
  { label: "30分", value: 1800 },
  { label: "35分", value: 2100 },
  { label: "40分", value: 2400 },
  { label: "45分", value: 2700 },
  { label: "50分", value: 3000 },
  { label: "55分", value: 3300 },
  { label: "60分", value: 3600 },
];

// onMounted フックで canvas 要素とコンテキストを取得
onMounted(() => {
  initCanvas();
  drawClockFace();
});

const changeButtonMode = (mode) => {
  buttonMode.value = mode;
};

const startTimer = () => {
  timerMode.value = buttonMode.value;
  if (timerMode.value === "seconds") {
    timerDuration.value = timerInputSeconds.value;
  } else if (timerMode.value === "minutes") {
    timerDuration.value = timerInputMinutes.value;
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
    width: 610, // 600 がいいのか？
    height: 610,
  });

  layer.value = new Konva.Layer();

  circle.value = new Konva.Circle({
    x: stage.value.width() / 2,
    y: stage.value.height() / 2,
    radius: 300, // 290 がいいのか？
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
      outerRadius: 220,
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
  } else if (timerMode.value === "minutes") {
    return (timerDuration.value / 60 - elapsedSeconds.value / 60) * 6;
  }
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
        <button class="btn" @click="changeButtonMode('seconds')">びょう</button>
        <button class="btn" @click="changeButtonMode('minutes')">ふん</button>
        <!-- <button class="btn" @click="changeButtonMode('hours')">とけい</button> -->
      </div>

      <div class="timer-controller">
        <v-select
          v-if="buttonMode === 'seconds'"
          v-model="timerInputSeconds"
          :options="seconds"
          :reduce="(seconds) => seconds.value"
          :clearable="false"
          placeholder="30秒"
        ></v-select>

        <v-select
          v-if="buttonMode === 'minutes'"
          v-model="timerInputMinutes"
          :options="minutes"
          :reduce="(minutes) => minutes.value"
          :clearable="false"
          placeholder="30分"
        ></v-select>

        <button class="btn" @click="startTimer()">すたーと</button>
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
  gap: 100px;
}

.timer {
}
.timer-items {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 80px;
}

.timer-selection {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.timer-controller {
  display: flex;
  align-items: center;
  gap: 20px;
}

.v-select {
  width: 120px;
}
</style>
