<template>
  <div class="q-pa-md">
    <FormLogin />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import { UserStore } from '@metano/quasar/stores/AuthStore'
import FormLogin from '@metano/quasar/components/FormLogin.vue'

export default defineComponent({
  components: {
    FormLogin,
  },
  setup() {
    const User = UserStore()
    return {
      User,
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
