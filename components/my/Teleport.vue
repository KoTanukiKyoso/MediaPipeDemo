<script lang="ts">
export default defineComponent({
  layout: false,
  name: "Teleport"
});
</script>
<script setup lang="ts"></script>

<template>
  <div id="teleport"/>
</template>

<style scoped lang="scss">
#teleport {
  position: fixed;
  width: 0;
  height: 0;
  z-index: 2401;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  overflow: visible;
}
</style>
