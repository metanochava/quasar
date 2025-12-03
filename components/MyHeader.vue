<template>
  <q-page>
  <q-btn
    :label="label"
    color="primary"
    unelevated
    @click="$emit('click')"
  />
  {{ apiUrl }}
  {{h}}
  </q-page>
</template>


<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { HTTPClient } from '../boot/axios'

const apiUrl = process.env.API
var h

defineProps({
  label: {
    type: String,
    default: 'Botão'
  }
})

const message = ref('')

async function  handleClick() {
  console.log('API atual:', apiUrl)
  message.value = `Chamando ${apiUrl}...`
  await HTTPClient.get(apiUrl+'')
  .then(res => {
    h = res
    
  }).catch(err => {
    console.log(err)
  })
}

onMounted(() => {
  console.log('Componente montado!')
  console.log('Endpoint da API:', apiUrl)
  handleClick()
})

onBeforeUnmount(() => {
  console.log('Componente será desmontado!')
})
</script>
