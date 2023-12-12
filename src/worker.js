// self.addEventListener("message", (event) => {
//   if (event.data.type === "start") {
//     // 初期化
//     let timerDuration = 0;
//     let elapsedSeconds = 0;

//     timerDuration = event.data.timerDuration;

//     const updateTimer = () => {
//       if (elapsedSeconds > timerDuration) {
//         // タイマー終了の処理
//         clearInterval(timerInterval);
//         self.postMessage("timerFinished");
//       } else {
//         // タイマー更新の処理
//         elapsedSeconds++;
//         self.postMessage({ type: "timerUpdate", elapsedSeconds });
//       }
//     };

//     const timerInterval = setInterval(updateTimer, 1000);
//   }
// });

// 初期化
let timerDuration = 0;
let elapsedSeconds = 0;
let timerInterval;

self.addEventListener("message", (event) => {
  if (event.data.type === "start") {
    timerDuration = event.data.timerDuration;
    startTimer();
  } else if (event.data.type === "pause") {
    clearInterval(timerInterval);
  } else if (event.data.type === "resume") {
    startTimer();
  }
});

const startTimer = () => {
  const updateTimer = () => {
    if (elapsedSeconds > timerDuration) {
      clearInterval(timerInterval);
      self.postMessage("timerFinished");
    } else {
      elapsedSeconds++;
      self.postMessage({ type: "timerUpdate", elapsedSeconds });
    }
  };

  timerInterval = setInterval(updateTimer, 1000);
};
