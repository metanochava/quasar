<template>
    <div class="col-12" style="margin-top: 2px;">
      <search-menu />
        <q-card square flat  class=" col-xs-12 col-md-12 col-lg-12 q-bt-md"
          v-for="App in Auth.TipoEntidadeMenus" :key="App"
          style="padding: 0px;"
          v-show="User.EntidadeModulos.includes(App.app) && User.isAuthorized(App.app.toLowerCase())"
        >
          <q-expansion-item default-opened
            :class="$q.dark.isActive ? 'bg-dark-custom text-subtitle1' : 'bg-white text-subtitle1 text-primary'"
            :icon="App.icon"
            dense
            :label="tdc(App.menu)"
            :header-class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'"
            :expand-icon-class="$q.dark.isActive ? 'text-white' : 'text-white'"
          >
            <q-separator />

            <q-item  v-for="sm in App.submenu " :key="sm"
              dense
              clickable v-ripple
              :to="{name: sm?.rota}"
              v-show="User.isAuthorized(sm.role.toLowerCase())"
            >
              <q-item-section avatar>
                <q-icon :name="sm.icon" />
              </q-item-section>
              <q-item-section>{{tdc(sm.menu)}}</q-item-section>
              <q-item-section side >
                <q-item dense  style="margin-right: -20px;"
                  v-show="User.isAuthorized('add_' + sm.menu.toLowerCase())"
                  clickable v-ripple
                  :to="{name: 'add_' + sm.menu.toLowerCase()}"
                >
                  <q-icon name="add" size="sm" :color="$q.dark.isActive ? '' : 'primary'">
                    <q-tooltip :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
                      {{ tdc('Adicionar ') }} {{ tdc(sm.menu) }}
                    </q-tooltip>
                  </q-icon>
                </q-item>
              </q-item-section>
            </q-item>
            <q-separator />
          </q-expansion-item>
        </q-card>
      </div>
</template>

<style scoped>
  .bg-dark-custom {
    background-color: #121212 !important;
  }
</style>
<script >


import { defineComponent } from 'vue'
import { tdc } from '../boot/app'
import { AuthStore, UserStore } from '../stores/AuthStore'
import SearchMenu from './SearchMenu.vue';


export default defineComponent({
  name: 'LeftMenuSegundo',

  components: {
    SearchMenu
  },
  setup () {
    const Auth = AuthStore()
    const  User = UserStore()
    return {
      Auth,
      User,
      tdc
    }
  },
  data () {
    return {
      
    }
  },
  computed: {

  },
  watch: {
    
  },
  mounted () {
    
  },
  methods: {
    
  }
})
</script>
