// 「N-DEV」により作成されました。
<script lang="ts">
export default defineComponent({
  layout: false,
  name: "PageContainer",
});
</script>
<script setup lang="ts">

export interface Props {
  maxWidth?: number,
  sideNaviWidth?: number,
}

const Props = withDefaults(defineProps<Props>(), {
  maxWidth: 1280,
  sideNaviWidth: 0,
});
</script>
<template>
  <div class="pa-0 pa-md-4 pa-lg-8 mx-auto d-flex justify-center" :style="{maxWidth: maxWidth + sideNaviWidth + 'px'}">
    <slot name="side-navi"/>
    <div :style="{maxWidth: maxWidth + 'px'}" style="width: 100%;">
      <slot/>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
