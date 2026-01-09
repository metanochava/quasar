
<template>
  <q-page-container>
  <q-page class=" row items-center justify-evenly">
    <div class="row">
      <q-card square  flat class="text-center">
        <q-card-section class="text-left justify-evenly">
          <q-card  v-if="incorrectAuth" class="my-card bg-red text-white">
            <q-card-section>
              <div class="text-subtitle2">{{ tdc('Incorrect username or password entered') }} <br> {{ tdc('please try again') }}</div>
            </q-card-section>

          </q-card>
          <q-card  v-if="correctAuth" class="my-card bg-green text-white">
            <q-card-section>
              <div class="text-subtitle2"> {{ tdc('Login successfuly') }} <br>
                {{ tdc('Redirect to home page') }} ...</div>
            </q-card-section>

          </q-card>
          <br>
          <q-form class="">

            <q-input outlined dense   clearable v-model="email" type="email" :label="tdc('Usuario ou Celular ou Email')">
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
              <template v-slot:append>
                <q-icon name="phone" />
              </template>
            </q-input>
            <br/>
            <q-input outlined dense   :readonly="readonly" clearable v-model="password" :type="isPwd ? 'password': 'text'" :label="tdc('Senha')">

              <template v-slot:prepend>
                <q-icon
                  name="lock"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <br/>
            <q-checkbox  class="text-grey-7" dense   clearable v-model="User.manterLogado"  @click="check" :label="tdc('Manter-me logado')">
            </q-checkbox>
          </q-form>
        </q-card-section>

        <q-card-actions class="q-px-md" >
          <q-btn  :readonly="readonly" size="md" @click="login()"  color="positive" dense class="full-width " :label="tdc('Entrar')" />
          <p></p>
        </q-card-actions>
        <q-card-actions align="around" >
          <q-btn flat :to="{name:'esquecerpassword'}"  size="md"  color="purple" :label="tdc('Esqueci minha') + ' ' + tdc('Senha')" />
          <q-btn flat :to="{name:'registarUser'}"  size="md" color="primary" class="" :label="tdc('Registar')" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
  </q-page-container>
</template>
<style scoped>

</style>
<script >

import { defineComponent } from 'vue'
import { tdc } from '../boot/app'
import { AuthStore, UserStore } from '../stores/AuthStore'
import { setStorage, getStorage } from '../boot/storage';
import { useQuasar } from 'quasar'


export default defineComponent({
  name: 'FormLogin',

  props: {

  },

  components: {

  },
  setup () {
    const Auth = AuthStore()
    const  User = UserStore()
    const $q = useQuasar()
    return {
      Auth,
      tdc,
      User,
      $q
    }
  },
  data () {
    return {
      user_id: null,
      entidade_id: null,
      isPwd: true,
      readonly: false,
      email: '',
      password: '',
      incorrectAuth: false,
      correctAuth: false,
      latitude: '',
      longitude: '',
      local: '',
      ipAddress: '0.0.0.0'
    }
  },
  computed: {

  },
  watch: {
    'User.Grupo' (val) {
      if (!val) return
      this.$router.push({ name: 'wellcome' })
    },
  },
  mounted () {

   if (getStorage('c', 'manterlogado') === 'true') {
      this.User.manterLogado = true
    } else {
      this.User.manterLogado = false
    }
    this.getGeolocation()
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        this.ipAddress = data.ip
      })
      .catch(error => {
        console.error('Error fetching IP address:', error)
      })
  },
  methods: {
    check () {
      setStorage('c', 'manterlogado', this.User.manterLogado, 365)
    },
    getGeolocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setPosition, this.errorPosition)
      } else {
        this.errorPosition()
      }
    },
    async getLocalFromCoords(lat, lon) {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt`

      const res = await fetch(url, {
        headers: {
          // 'User-Agent': 'SeuApp/1.0'
        }
      })

      const data = await res.json()

      return {
        cidade: data.address.city
          || data.address.town
          || data.address.village
          || '',
        bairro: data.address.suburb || '',
        pais: data.address.country || '',
        nomeCompleto: data.display_name || '.'
      }
    },
    setPosition (position) {
      const coords = position.coords
      this.latitude = coords.latitude
      this.longitude = coords.longitude

      this.local = this.getLocalFromCoords(this.latitude, this.longitude)
      console.log(this.local)

    },
    errorPosition () {
      this.$q.notify({
        position: 'bottom',
        timeout: 3000,
        color: 'negative',
        textColor: 'white',
        actions: [{ icon: 'close', color: 'white' }],
        message: 'Não foi possível recupera sua posição!'
      })
    },

    async login () {
      const availScreenWidth = window.screen.availWidth
      const availScreenHeight = window.screen.availHeight

      setStorage('c', 'manterlogado', this.User.manterLogado, 365)

      this.correctAuth = false

      await this.User.login({
        email: this.email,
        password: this.password,
        info: navigator.platform + ' ' + this.ipAddress,
        dispositivo: navigator.userAgent,
        local_lat: this.latitude || '-26.372109',
        local_lon: this.longitude || '28.233608',
        local: JSON.stringify(this.local)
      }, this.$q)
    }
  }
})
</script>
