<template>
  <q-bar >
    <div class="q-pa-sm q-pl-md  items-center text-body1">
      <div class="q-ml-md cursor-pointer non-selectable">
        <q-item clickable dense replace v-ripple
          :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'"  >
          <q-item-section avatar @click="$router.push({ name: 'home'})" >
            <q-icon  name="home" />
          </q-item-section>
          <q-item-section class="text-body1" @click="$router.push({ name: 'home'})" >{{ tdc('Casa') }}</q-item-section>
          <q-item-section side>
            <q-btn
            round dense flat
            :icon="'settings'" :class="$q.dark.isActive ? 'text-white' : 'text-white'"
            @click="User.toggleSettings()"
          >
            <q-tooltip :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'">{{ tdc('Configurações') }}</q-tooltip>
          </q-btn>
          </q-item-section>
        </q-item>
      </div>
    </div>

    <SearchMenu  style="height: 28px; margin-top:-4px;"/>
    <q-space />
    <TopMenuSegundo ></TopMenuSegundo>
  </q-bar>
</template>
<script >

import TopMenuSegundo from './TopMenuSegundo.vue'
import { defineComponent } from 'vue'
import { tdc } from '../boot/app'
import { UserStore } from '../stores/AuthStore'
import SearchMenu from './SearchMenu.vue';

export default defineComponent({
  components: {
    TopMenuSegundo,
    SearchMenu
  },
  setup () {
    const User = UserStore()
    return {
      User
    }
  },

  data () {
    return {
      tdc: tdc,
    }
  },

  created () {
  },
  computed: {
  },

  mounted () {

  },

  methods: {
   
  }
})
</script>
