<script setup lang="ts">
import {FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";

definePageMeta({
  layout: false,
});

onMounted(async () => {
  await init();
});

let lastVideoTime = -1;
let initialized = false;
let webcamRunning: Ref<boolean> = ref(false);
let canUseWebcam: Ref<boolean> = ref(false);
let handLandmarker: HandLandmarker;
let video: HTMLVideoElement, canvasElement: HTMLCanvasElement, canvasCtx;
let showText: Ref<string> = ref("指さしで選択してください");
let x8 = ref(0);
let y8 = ref(0);

const init = async () => {
  if (initialized) return;
  initialized = true;
  console.log("init");

  const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
  if (hasGetUserMedia()) {
    canUseWebcam.value = true;
  } else {
    canUseWebcam.value = false;
    alert("この端末、ブラウザではカメラを使用できません。他ブラウザ、端末をご利用ください。");
    navigateTo("/");
  }

  video = document.getElementById("webcam") as HTMLVideoElement;
  canvasElement = document.getElementById(
    "output_canvas"
  ) as HTMLCanvasElement;
  canvasCtx = canvasElement.getContext("2d");

  const vision = await FilesetResolver.forVisionTasks(
    // "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    "wasm/"
  );
  handLandmarker = await HandLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "/tasks/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 1,
    });
};

const startVideo = () => {
  navigator.mediaDevices.getUserMedia({
    video: true
  }).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
  webcamRunning.value = true;
}

const stopVideo = () => {
  webcamRunning.value = false;
  // video.pause();
  // video.srcObject = null;
}

let results;
let connects = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
const predictWebcam = async () => {
  canvasElement.style.width = video.videoWidth;
  canvasElement.style.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;

  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = handLandmarker.detectForVideo(video, startTimeMs);
  }
  if (!results) return
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (results.landmarks) {
    for (const landmarks of results.landmarks) {
      connects.forEach(([i, j]) => {
        const lm = landmarks[i];
        const lm2 = landmarks[j];
        if (!lm || !lm2) return;
        canvasCtx.beginPath();
        canvasCtx.moveTo(lm.x * canvasElement.width, lm.y * canvasElement.height);
        canvasCtx.lineTo(lm2.x * canvasElement.width, lm2.y * canvasElement.height);
        canvasCtx.strokeStyle = "#00FF00";
        canvasCtx.lineWidth = 3;
        canvasCtx.stroke();
      });
      landmarks.forEach((lm) => {
        canvasCtx.beginPath();
        canvasCtx.arc(lm.x * canvasElement.width, lm.y * canvasElement.height, 5, 0, 2 * Math.PI);
        canvasCtx.fillStyle = "#FF0000";
        canvasCtx.fill();
      });
      x8.value = Math.round(landmarks[8].x * canvasElement.width);
      y8.value = Math.round(landmarks[8].y * canvasElement.height);
      let flg = false;
      if (x8.value <= 180) {//右
        if (y8.value <= 80) {
          showText.value = "右上";
          flg = true;
        }
        if (y8.value >= canvasElement.height - 80) {
          showText.value = "右下";
          flg = true;
        }
      } else if (x8.value >= canvasElement.width - 180) {//左
        if (y8.value <= 80) {
          showText.value = "左上";
          flg = true;
        }
        if (y8.value >= canvasElement.height - 80) {
          showText.value = "左下";
          flg = true;
        }
      }
      if (!flg) showText.value = "指さしで選択してください";

    }
  }
  canvasCtx.restore();
  if (webcamRunning.value) window.requestAnimationFrame(predictWebcam);
}
</script>

<template>
  <l-page-container :max-width="980">
    <div>
      <div v-if="canUseWebcam" class="pb-2">
        <v-btn v-if="!webcamRunning" text="Start Video" @click="startVideo"/>
        <v-btn v-else text="Stop Video" @click="stopVideo"/>
      </div>
      <div style="position: relative;">
        <video id="webcam" style="position: absolute;" autoplay playsinline/>
        <canvas class="output_canvas" id="output_canvas" style="position: absolute; left: 0; top: 0;"/>
        <div v-if="webcamRunning" style="width: 100%; max-width: 640px; height: 480px; position: relative;">
          <button class="transparent-btn outline" style="top: 0; left: 0;" :class="{red: showText === '左上'}">左上</button>
          <button class="transparent-btn outline" style="top: 0; right: 0;" :class="{red: showText === '右上'}">右上</button>
          <button class="transparent-btn outline" style="bottom: 0; left: 0;" :class="{red: showText === '左下'}">左下</button>
          <button class="transparent-btn outline" style="bottom: 0; right: 0;" :class="{red: showText === '右下'}">右下</button>
          <div style="color: white; width: 100%; height: 100%;" class="text-center d-flex align-center justify-center">選択：{{ showText }}</div>
        </div>
      </div>
      <div>x:{{ x8 }} y:{{ y8 }}</div>
    </div>
  </l-page-container>
</template>
<style scoped lang="scss">
video {
  clear: both;
  display: block;
  transform: rotateY(180deg);
  background: #AAAAAA;
  width: 100%;
  max-width: 640px;
  height: 480px;

}

canvas {
  clear: both;
  display: block;
  transform: rotateY(180deg);
  width: 100%;
  max-width: 640px;
  height: 480px;
}

.transparent-btn {
  background: #007f8b;
  opacity: 0.5;
  position: absolute;
  width: 180px;
  height: 80px;
  color: white;
  border: solid 2px black;
}

.red {
  background: red;
}
</style>
