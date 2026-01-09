<template>
    <div >
      <q-input  standout v-model="Auth.search"   square :class="[$q.dark.isActive ? 'bg-transparent ' : 'bg-transparent', 'input-28', 'q-pa-0']"  dense @update:model-value="filterMenus"
        :label=" ' ' + tdc(' Procurar') + ' '">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
</template>

<style scoped>
  .input-28 .q-field__control {
    height: 28px;
    min-height: 28px;
  }
</style>

<script >

import { defineComponent } from 'vue'
import { tdc } from '../boot/app'
import { UserStore, AuthStore } from '../stores/AuthStore'



export default defineComponent({
  name: 'SearchMenu',

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
      search: ''
    }
  },
  computed: {

  },
  watch: {
    'User.Permicoes' () {
      this.filterMenus(this.Auth.search)
    },

    'User.Entidade'() {
      this.Auth.setTipoEntidadeMenus()
      this.User.setEntidadeModelos()
      this.User.setEntidadeModulos()
    },

  },
  mounted () {
    this.filterMenus(this.Auth.search)
    this.Auth.setTipoEntidadeMenus()
    this.User.setEntidadeModelos()
    this.User.setEntidadeModulos()
  },
  methods: {
      
    filterMenus (val) {
      console.log(val)
      if (val === '') {
        this.Auth.TipoEntidadeMenus = this.Auth.TipoEntidadeAllMenus
      } else {
        const needle = val.toLowerCase()
        this.Auth.TipoEntidadeMenus  = this.Auth.TipoEntidadeAllMenus.map(v => ({
          ...v,
          submenu: v.submenu.filter(sub =>
            sub.menu && sub.menu.toLowerCase().includes(needle.toLowerCase())
          )
        })).filter(v => v.submenu.length > 0)
      }
    }
  }
})
</script>
