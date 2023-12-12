<script setup>
import AppHeader from "./components/AppHeader.vue";
import { ref, onMounted } from "vue";
import Konva from "konva";

const canvasWidth = ref(620);
const canvasHeight = ref(620);
const canvas = ref(0);
const ctx = ref(null);
const stage = ref(null);
const layer = ref(null);

const circle = ref(null);
const circleRadius = ref(300);
const centerCircle = ref(null);
const startNumberPosition = ref(0.82);
const sizeNumber = ref(40);
const startLinePosition = ref(0.7);
const shortLine = ref(null);
const boldLine = ref(null);
const circleStart = ref(null);
const circleEnd = ref(null);
const arc = ref(null);
const arcOuterRadius = ref(217);

const buttonMode = ref("seconds");
const timerMode = ref("seconds");
const timerInputSeconds = ref(30);
const timerInputMinutes = ref(1800);
const timerDuration = ref(0); // 5 ~ 3600
const elapsedSeconds = ref(0); // 0 ~ 3600

const colorWhite = ref("#ffffff");
const colorBlack = ref("#32383f");
const colorMain = ref("#FFCA80");
const colorAccent = ref("#BFE4FF");

const isActive = ref({ seconds: true });
const isStop = ref(true);
const isResume = ref(false);
const isTimerRunning = ref(true);
const breakPoint = ref("(max-width: 1023px)");

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

const worker = ref(null);

onMounted(() => {
  initCanvas();
  drawCountDown();
  drawTimerFace();
});

const startWorker = () => {
  if (worker.value) {
    worker.value.terminate();
  }

  worker.value = new Worker(new URL("./worker.js", import.meta.url));

  if (window.Worker) {
    // メッセージを受信したときの処理
    worker.value.addEventListener("message", (event) => {
      if (event.data === "timerFinished") {
        alert("タイマー終了！");
      } else if (event.data.type === "timerUpdate") {
        drawCountDown();
        elapsedSeconds.value = event.data.elapsedSeconds;
      }
    });
  } else {
    console.error("Web Workers are not supported in this environment.");
  }
};

const changeButtonMode = (mode) => {
  buttonMode.value = mode;

  // クリックしたボタンの色をactiveにする
  if (isActive.value[mode] === true) {
    return;
  }

  // 全てのボタンのactiveを外してから、該当ボタンにactiveを追加
  Object.keys(isActive.value).forEach((mode) => {
    isActive.value[mode] = false;
  });
  isActive.value[mode] = true;
};

const startTimer = () => {
  // 初期化
  elapsedSeconds.value = 0;
  timerMode.value = buttonMode.value;

  if (timerMode.value === "seconds") {
    timerDuration.value = timerInputSeconds.value;
  } else if (timerMode.value === "minutes") {
    timerDuration.value = timerInputMinutes.value;
  }

  // Web Workerを開始
  startWorker();
  worker.value.postMessage({
    type: "start",
    timerDuration: timerDuration.value,
  });
};

const stopTimer = () => {
  if (worker.value) {
    worker.value.postMessage({ type: "pause" });
    isTimerRunning.value = false;
    isStop.value = false;
    isResume.value = true;
  }
};

const resumeTimer = () => {
  if (worker.value) {
    worker.value.postMessage({ type: "resume" });
    isTimerRunning.value = true;
    isStop.value = true;
    isResume.value = false;
  }
};

const toggleTimer = () => {
  if (isTimerRunning.value) {
    stopTimer();
  } else {
    resumeTimer();
  }
};

const initCanvas = () => {
  if (window.matchMedia(breakPoint.value).matches) {
    canvasWidth.value = 340;
    canvasHeight.value = 340;
    circleRadius.value = 160;
  }

  ctx.value = canvas.value.getContext("2d");

  stage.value = new Konva.Stage({
    container: "container",
    width: canvasWidth.value,
    height: canvasHeight.value,
  });

  layer.value = new Konva.Layer();

  circle.value = new Konva.Circle({
    x: canvasWidth.value / 2,
    y: canvasHeight.value / 2,
    radius: circleRadius.value,
    fill: colorWhite.value,
    stroke: colorBlack.value,
    strokeWidth: 0,
    shadowColor: colorBlack.value,
    shadowBlur: 15,
    shadowOpacity: 0.2,
  });

  // レイヤーに円を追加
  layer.value.add(circle.value);

  // ステージにレイヤーを追加
  stage.value.add(layer.value);
};

const drawTimerFace = () => {
  if (window.matchMedia(breakPoint.value).matches) {
    startNumberPosition.value = 0.75;
    sizeNumber.value = 30;
    startLinePosition.value = 0.59;
  }

  const center = { x: circle.value.x(), y: circle.value.y() };

  // 中心の丸点
  centerCircle.value = new Konva.Circle({
    x: canvasWidth.value / 2,
    y: canvasHeight.value / 2,
    radius: 4,
    fill: colorBlack.value,
  });

  layer.value.add(centerCircle.value);

  // 文字盤の数字の描画
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      continue;
    }

    const radian = (i / 60) * 2 * Math.PI;
    const x =
      center.x + center.x * startNumberPosition.value * Math.sin(radian);
    const y =
      center.y - center.y * startNumberPosition.value * Math.cos(radian);

    const number = new Konva.Text({
      x: x,
      y: y,
      text: i.toString(),
      fontSize: sizeNumber.value,
      fontFamily: "Inter",
      fill: colorBlack.value,
    });

    number.offsetX(number.width() / 2);
    number.offsetY(number.height() / 2);

    layer.value.add(number);
  }

  // 円を等分する線の描画
  for (let i = 0; i < 60; i++) {
    const radian = (i / 60) * 2 * Math.PI;
    const endLinePosition = startLinePosition.value - 0.02;
    const startX =
      center.x + center.x * startLinePosition.value * Math.sin(radian);
    const startY =
      center.y - center.y * startLinePosition.value * Math.cos(radian);
    const endX = center.x + center.x * endLinePosition * Math.sin(radian);
    const endY = center.y - center.y * endLinePosition * Math.cos(radian);

    if (i % 5 === 0) {
      // 太線
      boldLine.value = new Konva.Line({
        points: [startX, startY, endX, endY],
        stroke: colorAccent.value,
        strokeWidth: 8,
      });

      circleStart.value = new Konva.Circle({
        x: startX,
        y: startY,
        radius: 3.5,
        fill: colorAccent.value,
      });

      circleEnd.value = new Konva.Circle({
        x: endX,
        y: endY,
        radius: 3.5,
        fill: colorAccent.value,
      });

      layer.value.add(boldLine.value, circleStart.value, circleEnd.value);
    } else if (i % 5 !== 0) {
      // 短線
      shortLine.value = new Konva.Line({
        points: [startX, startY, endX, endY],
        stroke: colorBlack.value,
        strokeWidth: 1,
      });

      layer.value.add(shortLine.value);
    }
  }
};

const drawCountDown = () => {
  if (window.matchMedia(breakPoint.value).matches) {
    arcOuterRadius.value = 99;
  }

  const center = { x: circle.value.x(), y: circle.value.y() };

  if (arc.value) {
    arc.value.angle(getEndAngle());
  } else {
    arc.value = new Konva.Arc({
      x: center.x,
      y: center.y,
      innerRadius: 0,
      outerRadius: arcOuterRadius.value,
      angle: getEndAngle(),
      fill: colorMain.value,
      opacity: 0.8,
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
      <canvas ref="canvas" class="canvas"></canvas>
    </div>

    <div class="timer-items">
      <div class="timer-mode">
        <button
          class="btn"
          :class="{ 'is-active': isActive['seconds'] }"
          @click="changeButtonMode('seconds')"
        >
          びょう(秒)
        </button>
        <button
          class="btn"
          :class="{ 'is-active': isActive['minutes'] }"
          @click="changeButtonMode('minutes')"
        >
          ふん(分)
        </button>
        <!-- <button class="btn" @click="changeButtonMode('hours')">とけい</button> -->
      </div>

      <div class="timer-select">
        <label>じかんをえらんでね</label>
        <v-select
          v-if="buttonMode === 'seconds'"
          v-model="timerInputSeconds"
          :options="seconds"
          :reduce="(seconds) => seconds.value"
          :clearable="false"
          :searchable="false"
          placeholder="30秒"
        ></v-select>

        <v-select
          v-if="buttonMode === 'minutes'"
          v-model="timerInputMinutes"
          :options="minutes"
          :reduce="(minutes) => minutes.value"
          :clearable="false"
          :searchable="false"
          placeholder="30分"
        >
        </v-select>
      </div>

      <div class="timer-action">
        <button class="btn btn-start" @click="startTimer()">
          タイマーをはじめる
        </button>
        <button
          class="btn"
          :class="{ 'is-stop': isStop, 'is-resume': isResume }"
          @click="toggleTimer()"
        >
          {{ isTimerRunning ? "とめる" : "さいかい" }}
        </button>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.header {
  max-width: 1280px;
  height: 70px;
  display: flex;
  justify-content: space-between;

  @include mq(md) {
    height: 20px;
  }
}

.container {
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;

  @include mq(md) {
    padding-left: 10px;
    padding-right: 10px;
  }
}

.main {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  gap: 100px;

  @include mq(md) {
    flex-direction: column-reverse;
    align-items: center;
    gap: none;
  }

  @include mq(ls) {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    gap: 100px;
  }
}

@media (max-width: 1140px) {
  .main {
    gap: 20px;
  }
}

.timer-items {
  display: flex;
  flex-direction: column;
  justify-content: center;

  @include mq(md) {
    align-items: center;
  }
}

.timer-mode {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.timer-select {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  gap: 10px;

  @include mq(md) {
    margin-bottom: 40px;
  }

  @include mq(ls) {
    gap: 5px;
  }
}

.timer-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 70px;

  @include mq(md) {
    gap: 20px;
  }

  @include mq(ls) {
    flex-direction: row;
  }
}

.v-select {
  width: 165px;

  &:focus-within {
    box-shadow: 0px 0px 10px $color-main;
    outline: solid 2px $color-main;
    border-radius: 4px;
  }

  @include mq(ls) {
    width: 120px;
  }
}

.btn-start {
  width: 300px;

  @include mq(md) {
    width: 210px;
  }
}

.is-active {
  background-color: $color-main;
  color: $color-white;
  border: 1px solid $color-main;
}

.is-stop {
  background-color: $color-black;
  color: $color-white;
  opacity: $opacity;

  &:hover {
    opacity: 0.9;
  }
}

.is-resume {
  background-color: $color-white;
  color: $color-black;
  box-shadow: 0px 0px 10px $color-main;
  border: 1px solid $color-main;

  &:hover {
    background-color: $color-main-button-hover;
    color: $color-white;
    border: 1px solid $color-main;
  }
}
</style>
