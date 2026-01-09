<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">
      <q-toolbar class="no-wrap q-px-md">
        <HeaderBrand />
        <q-space />
        <HeaderDarkModeToggle />
        <HeaderFullScreen />
        <HeaderLanguage />
        <Servicos />
      </q-toolbar>
    </q-header>

    <q-page-container class="">
      <router-view :showing="Load.count === 0" />
      <q-inner-loading :showing="Load.count !== 0">
        <q-spinner-gears size="80px" color="primary" />
      </q-inner-loading>
    </q-page-container>

    <Rodape />

    <q-page-scroller position="bottom-right" :scroll-offset="50" :offset="[18, -10]">
      <q-btn icon="keyboard_arrow_up" color="primary" round />
    </q-page-scroller>
  </q-layout>
</template>

<script>
/* -------------------- IMPORT STORES -------------------- */

import { AuthStore, LoadStore, UserStore } from '../stores/AuthStore'

/* -------------------- IMPORT COMPONENTS -------------------- */
import HeaderBrand from '../components/header/HeaderBrand.vue'
import HeaderDarkModeToggle from '../components/header/HeaderDarkModeToggle.vue'
import HeaderLanguage from '../components/header/HeaderLanguage.vue'
import HeaderFullScreen from '../components/header/HeaderFullScreen.vue'
import Servicos from '../components/header/HeaderServices.vue'
import Rodape from '../components/footer/MainFooter.vue'

import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    HeaderBrand,
    HeaderDarkModeToggle,
    HeaderLanguage,
    HeaderFullScreen,
    Servicos,
    Rodape,
  },
  setup() {
    const Auth = AuthStore()
    const User = UserStore()
    const Load = LoadStore()
    return {
      Auth,
      User,
      Load,
    }
  },
  data() {
    return {}
  },
  computed: {},

  mounted() {},

  methods: {},
})
</script>

<style></style>
