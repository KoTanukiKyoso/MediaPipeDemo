// 「N-DEV」により作成されました。
<script lang="ts">
export default defineComponent({
  layout: false,
  name: "IconBtn",
  inheritAttrs: false,
});
</script>
<script setup lang="ts">

interface Props {
  tips?: string,
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain",
  color?: string,
  icon: string,
  size?: string | number,
  disabled?: boolean,
  hover?: boolean,
  density?: "default" | "comfortable" | "compact",
}

const Props = withDefaults(defineProps<Props>(), {
  tips: undefined,
  variant: 'text',
  color: 'primary',
  icon: 'mdi-home',
  size: "default",
  disabled: false,
  hover: true,
  density: "compact",
});

</script>
<template>
  <v-hover #default="{ isHovering, props }">
    <a v-bind="props">
      <v-btn v-bind="$attrs" :variant="variant" icon="" :color="hover ? (isHovering ? color : '#999999') : color" :density="density">
        <v-tooltip v-if="tips" activator="parent" :text="tips" location="top"/>
        <v-icon :icon="icon" :size="size"/>
      </v-btn>
    </a>
  </v-hover>
</template>
<style scoped lang="scss"></style>

