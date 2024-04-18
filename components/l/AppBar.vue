// 「N-DEV」により作成されました。
<script lang="ts">
export default defineComponent({
  layout: true,
  name: "AppBar",
});
</script>
<script setup lang="ts">
import {useStore, useFirebaseAuth} from "~/composables";
import {useDisplay} from "vuetify";

let {isSignedIn, user, emailVerified} = useStore();
const router = useRouter();
const {xs} = useDisplay();
const {pages} = useStore();
let firebaseAuth: any;
let tab: Ref<string | null> = ref(null);
watch(router.currentRoute, () => {
  tab.value = router.currentRoute.value.path;
});

onMounted(() => {
  firebaseAuth = useFirebaseAuth();
})

const logout = () => {
  firebaseAuth.logout();
  navigateTo("/login");
};

const goTo = (page: string) => {
  navigateTo(page);
};

</script>
<template>
  <div>
    <v-app-bar scroll-behavior="hide">
      <template v-slot:prepend>
        <nuxt-link to="/">
          <div class="d-flex align-center">
            <v-img contain src="/icon.png" class="ml-4 d-inline-block" :width="xs ? 34 : 40"/>
            <span style="font-size: 22px;" class="ml-4 font-weight-bold text-primary oswald-font">N-Dev</span>
          </div>
        </nuxt-link>
      </template>
      <v-spacer/>
      <template #append>
        <template v-if="isSignedIn">
          <v-menu location="bottom">
            <template v-slot:activator="{ props }">
              <button v-bind="props" class="mr-4">
                <v-badge v-if="!emailVerified()" :dot="true" color="#FF3333" overlap>
                  <v-avatar size="30" style="background: white;">
                    <v-icon style="color: #AAAAAA;" size="30">mdi-account</v-icon>
                  </v-avatar>
                </v-badge>
                <v-avatar v-else size="30" style="background: white;">
                  <v-icon style="color: #AAAAAA;" size="30">mdi-account</v-icon>
                </v-avatar>
              </button>
            </template>
            <v-list max-width="280">
              <v-list-item class="font-weight-bold" to="/">
                <template v-slot:prepend>
                  <div class="pr-2">
                    <v-icon style="color: grey;" large>mdi-account</v-icon>
                  </div>
                </template>
                <v-list-item-title class="align-center d-flex pb-1">
                  <v-icon v-if="!emailVerified()" color="error" small class="mr-2">mdi-alert-circle</v-icon>
                  {{ user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider class="my-2" color="#AAAAAA"/>
              <v-list-item @click="logout">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>ログアウト</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <div v-else class="pr-3">
          <my-btn variant="outlined" color="white" to="/login" icon="login" shorten append-icon text="ログイン"/>
        </div>
      </template>
    </v-app-bar>
    <v-app-bar style="border-bottom: solid 1px #DDDDDD;" density="compact">
      <v-tabs v-model="tab" align-tabs="title" color="primary" class="ml-16" selected-class="selected" nuxt>
        <template v-for="p of pages" :key="p.to">
          <v-tab v-if="!(p.conds.signedIn && !isSignedIn)"
                 :value="p.to" class="mx-0" :prepend-icon="p.icon" :to="p.to" exact :text="p.title"/>
        </template>
      </v-tabs>
    </v-app-bar>
  </div>
</template>
<style scoped lang="scss">
.selected {
  background: #F5FAFA;
}
</style>
