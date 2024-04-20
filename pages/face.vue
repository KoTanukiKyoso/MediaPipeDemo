// 「N-DEV」により作成されました。
<script setup lang="ts">
import {FaceLandmarker, FilesetResolver, DrawingUtils} from "@mediapipe/tasks-vision";

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
let faceLandmarker: FaceLandmarker;
let video: HTMLVideoElement, canvasElement: HTMLCanvasElement, canvasCtx;
let drawingUtils;
let videoBlendShapes;
let videoWidth = 640;

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
  canvasElement = document.getElementById("output_canvas") as HTMLCanvasElement;
  canvasCtx = canvasElement.getContext("2d");
  drawingUtils = new DrawingUtils(canvasCtx);
  videoBlendShapes = document.getElementById("video-blend-shapes");
  videoWidth = video.clientWidth;
  console.log("videoWidth", videoWidth);

  const vision = await FilesetResolver.forVisionTasks(
    // "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    "wasm/"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "/tasks/face_landmarker.task",
        delegate: "CPU",
      },
      outputFaceBlendshapes: true,
      runningMode: "VIDEO",
      numFaces: 1
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
const predictWebcam = async () => {
  const radio = video.videoHeight / video.videoWidth;
  video.style.width = videoWidth + "px";
  video.style.height = videoWidth * radio + "px";
  canvasElement.style.width = videoWidth + "px";
  canvasElement.style.height = videoWidth * radio + "px";
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;

  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = faceLandmarker.detectForVideo(video, startTimeMs);
  }
  if (results.faceLandmarks) {
    for (const landmarks of results.faceLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
        {color: "#C0C0C070", lineWidth: 1}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
        {color: "#FF3030"}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
        {color: "#FF3030"}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
        {color: "#30FF30"}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
        {color: "#30FF30"}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
        {color: "#E0E0E0"}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LIPS,
        {color: "#E0E0E0"}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
        {color: "#FF3030"}
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
        {color: "#30FF30"}
      );
    }
  }
  // drawBlendShapes(videoBlendShapes, results.faceBlendshapes);
  if (webcamRunning.value) window.requestAnimationFrame(predictWebcam);
}

const drawBlendShapes = (el: HTMLElement, blendShapes: any[]) => {
  if (!blendShapes.length) return;
  // console.log(blendShapes[0]);
  let htmlMaker = "";
  blendShapes[0].categories.map((shape) => {
    htmlMaker += `
      <li class="blend-shapes-item">
        <span class="blend-shapes-label">${
      shape.displayName || shape.categoryName
    }</span>
        <span class="blend-shapes-value" style="width: calc(${
      +shape.score * 100
    }% - 120px)">${(+shape.score).toFixed(4)}</span>
      </li>
    `;
  });
  el.innerHTML = htmlMaker;
}

</script>

<template>
  <l-page-container :max-width="980">
    <div>
      <div v-if="canUseWebcam" class="pb-2">
        <v-btn v-if="!webcamRunning" text="Start Video" @click="startVideo"/>
        <v-btn v-else text="Stop Video" @click="stopVideo"/>
      </div>
      <div style="position: relative; width: 100%;">
        <video id="webcam" style="position: absolute;" autoplay playsinline width="640"/>
        <canvas class="output_canvas" id="output_canvas" width="640" style="position: absolute; left: 0; top: 0;"/>
      </div>
      <div class="blend-shapes">
        <ul class="blend-shapes-list" id="video-blend-shapes"/>
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

.blend-shapes {
  position: relative;
  float: left;
  width: 48%;
  margin: 2% 1%;
  cursor: pointer;
}


.blend-shapes-item {
  display: flex;
  align-items: center;
  height: 20px;
}

.blend-shapes-label {
  display: flex;
  width: 120px;
  justify-content: flex-end;
  align-items: center;
  margin-right: 4px;
}

.blend-shapes-value {
  display: flex;
  height: 16px;
  align-items: center;
  background-color: #007f8b;
}
</style>
