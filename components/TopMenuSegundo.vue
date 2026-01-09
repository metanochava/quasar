<template>
    <div >
      <q-btn class="q-mr-xs" flat square
        v-for="App in Auth.TipoEntidadeMenus" :key="App"
        style="padding: 0px;"
        v-show="User.EntidadeModulos.includes(App.app) && User.isAuthorized(App.app.toLowerCase())"
        :icon="App.icon"
        :label="tdc(App.menu)"
      >
        
        <q-menu auto-close>
          <q-list  style="min-width: 155px">
            <q-item  v-for="sm in App.submenu" :key="sm"
              dense
              clickable v-ripple
              :to="{name: sm?.rota}"
              v-show="User.isAuthorized(sm.role.toLowerCase())"
            >
              <q-item-section avatar>
                <q-icon :name="sm.icon" :color="$q.dark.isActive ? '' : 'text-primary'" />
              </q-item-section>
              <q-item-section :color="$q.dark.isActive ? '' : 'text-primary'">{{tdc(sm.menu)}}</q-item-section>
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
          </q-list>
        </q-menu>
      </q-btn>
      </div>
</template>

<script >

import { defineComponent } from 'vue'
import { tdc } from '../boot/app'
import { UserStore, AuthStore } from '../stores/AuthStore'



export default defineComponent({
  name: 'TopeMenuSegundo',

  components: {
  },
  setup () {

    const User = UserStore()
    const Auth = AuthStore()

    return {
      User,
      Auth,
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
