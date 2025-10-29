<template>
  <q-btn
    :label="label"
    color="primary"
    unelevated
    @click="$emit('click')"
  />
</template>

<script setup>
    defineProps({
    label: {
        type: String,
        default: 'Botão'
    }
    })
</script>