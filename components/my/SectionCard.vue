// 「N-DEV」により作成されました。
<script lang="ts">
export default defineComponent({
  layout: false,
  name: "SectionCard"
});
</script>
<script setup lang="ts">
let tab = defineModel<TabItem | null>()

interface Props {
  white?: boolean,
  maxWidth?: string | number,
  dense?: boolean,
  tabItems?: TabItems,
  showTab?: boolean,
}

const Props = withDefaults(defineProps<Props>(), {
  white: false,
  maxWidth: '1280px',
  dense: false,
  showTab: false,
})
</script>
<style scoped lang="scss"></style>
<template>
  <v-card :variant="white ? 'elevated' : 'text'" elevation="0" :border="white"
          :max-width="(typeof maxWidth === 'number') ? maxWidth + 'px' : maxWidth" class="mx-auto">
    <div class="pa-4 pa-md-8 d-flex align-center" :class="{'py-md-4 px-md-4': dense, 'pb-3 pb-md-3': showTab}">
      <template v-if="!tabItems">
        <div>
          <v-card-title class="d-flex text-sub oswald-font">
            <slot name="title"/>
          </v-card-title>
          <v-card-subtitle>
            <slot name="subtitle"/>
          </v-card-subtitle>
        </div>
      </template>
      <template v-else>
        <v-window v-model="tab">
          <v-window-item v-for="item of tabItems" :value="item">
            <div>
              <v-card-title class="d-flex text-sub oswald-font">
                <h2>{{ item.head }}</h2>
              </v-card-title>
              <v-card-subtitle>
                {{ item.subtitle }}
              </v-card-subtitle>
            </div>
          </v-window-item>
        </v-window>
      </template>
      <v-spacer/>
      <slot name="append"/>
    </div>
    <v-tabs v-if="showTab && tabItems" v-model="tab" color="accent" border class="ml-8">
      <v-tab v-for="t of tabItems" :value="t" :prepend-icon="t.icon">{{ t.title }}</v-tab>
    </v-tabs>

    <slot v-else name="title-bottom"/>
    <v-divider class="mb-4"/>
    <div class="px-6 pa-md-8 pt-md-4" :class="{'pt-md-4 px-md-4': dense}">
      <slot/>
    </div>
  </v-card>
</template>
