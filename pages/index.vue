// 「N-DEV」により作成されました。
<script setup lang="ts">

definePageMeta({
  layout: false,
});


</script>
<template>
  <l-page-container>
    <my-section-card white>
      <template #title>
        <h2 class="d-flex align-center justify-start text-primary oswald-font">
          <v-img src="/icon.png" max-width="46" width="46" height="46" class="mr-4"/>
          MediaPipe Demo
        </h2>
      </template>
      <template #subtitle>
        メディアパイプのデモ
      </template>
      <p class="pt-4">
        PythonやWEB（JavaScript）で使用できるAI、特に映像・画像に関するAI群です。
      </p>
      <div class="mt-8 d-flex justify-center">
        <v-btn variant="elevated" to="/hand" class="mx-1">手認識 Demo</v-btn>
        <v-btn variant="elevated" to="/face" class="mx-1">顔認識 Demo</v-btn>
      </div>
    </my-section-card>
  </l-page-container>
</template>
<style scoped lang="scss"></style>

