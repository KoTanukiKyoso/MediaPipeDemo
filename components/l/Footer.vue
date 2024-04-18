// 「N-DEV」により作成されました。
<script lang="ts">
export default defineComponent({
  layout: true,
  name: "Footer",
});
</script>
<script setup lang="ts"></script>
<template>
  <v-footer :app="true" border order="2" absolute class="py-8">
    <div class="mx-auto d-flex" style="max-width: 1200px; width: 100%;">
      <div class="mr-8">
        <nuxt-link target="_blank" style="text-decoration: none;" href="https://top.nexsjp.com">
          <v-img src="/logo.webp" alt="nexs logo" width="120"/>
        </nuxt-link>
        <div class="pa-2" style="font-size: 12px;">&copy; {{ new Date().getFullYear() }} NEXS Co., Ltd.</div>
      </div>
      <v-spacer/>
      <div class="mx-8">
        <div class="font-weight-bold mb-2 oswald-font">SERVICE</div>
        <div class="px-4">
          <span style="font-size: 12px;" class="pl-1">開発を強力に支援 N-Dev</span>
          <nuxt-link target="_blank" to="https://n-dev.nexsjp.com" class="rounded pa-2 hover d-flex align-center justify-start font-weight-bold oswald-font">
            <v-img src="/icon.png" max-width="22" width="22" height="22" alt="nexsm logo" class="mr-2"/>
            N-Dev
          </nuxt-link>
        </div>
      </div>
      <div class="ml-8">
        <div class="font-weight-bold mb-2 oswald-font">CONTACT</div>
        <div class="px-4">
          <div>
            <nuxt-link target="_blank" to="https://twitter.com/NEXS_jp" class="d-flex align-center hover pa-2 rounded justify-start">
              <span class="mr-3 font-weight-bold">X</span>
              NEXS公式
            </nuxt-link>
          </div>
          <div class="mt-1">
            <nuxt-link class="rounded pa-2 hover" target="_blank" to="">
              お問合せ（Google フォーム）
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </v-footer>
</template>
<style scoped lang="scss">
.hover:hover {
  cursor: pointer;
  background: #F0F0F0;
}
</style>
