// 「N-DEV」により作成されました。
<script setup lang="ts">
import {FilesetResolver, HandLandmarker} from "@mediapipe/tasks-vision";

definePageMeta({
  layout: false,
});

onMounted(() => {
  init();
});


let lastVideoTime = -1;
let initialized = false;
let webcamRunning: Ref<boolean> = ref(false);
let canUseWebcam: Ref<boolean> = ref(false);
let handLandmarker: HandLandmarker;
let video: HTMLVideoElement, canvasElement: HTMLCanvasElement, canvasCtx;

const init = async () => {
  if (initialized) return;
  initialized = true;

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
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    // "@mediapipe/tasks-vision/wasm/"
  );
  handLandmarker = await HandLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "/tasks/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2
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

      landmarks.forEach((lm, i) => {
        canvasCtx.beginPath();
        canvasCtx.arc(lm.x * canvasElement.width, lm.y * canvasElement.height, 5, 0, 2 * Math.PI);
        canvasCtx.fillStyle = "#FF0000";
        canvasCtx.fill();
      });
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
      </div>
    </div>
  </l-page-container>
</template>
<style scoped lang="scss">
video {
  clear: both;
  display: block;
  transform: rotateY(180deg);
}

canvas {
  clear: both;
  display: block;
  transform: rotateY(180deg);
}
</style>
