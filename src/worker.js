self.addEventListener("message", (event) => {
  if (event.data.type === "start") {
    // 初期化
    let timerDuration = 0;
    let elapsedSeconds = 0;

    timerDuration = event.data.timerDuration;

    const updateTimer = () => {
      if (elapsedSeconds > timerDuration) {
        // タイマー終了の処理
        clearInterval(timerInterval);
        self.postMessage("timerFinished");
      } else {
        // タイマー更新の処理
        elapsedSeconds++;
        self.postMessage({ type: "timerUpdate", elapsedSeconds });
      }
    };

    const timerInterval = setInterval(updateTimer, 1000);
  }
});
