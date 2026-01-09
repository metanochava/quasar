
<template>
   <div class="">
        <q-card>
          <q-bar :class="$q.dark.isActive ? 'bg-primary text-white' : 'bg-primary text-white'">
            &nbsp; {{tdc('Enviar comentário ou opinião')}} 
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>{{tdc('Fechar')}}</q-tooltip>
            </q-btn>
          </q-bar>

          <q-card-section >
            <q-input outlined
                v-model="comment_text"
                class=""
                dense
                :placeholder="tdc('Tem algum feedback? Adoraríamos ouvir; mas não compartilhe informações confidenciais. Tem perguntas? Tente ajuda ou suporte.')"
                type="textarea"
                :rules="[ val => val && val.length > 0 || tdc('Este campo e obrigatório.')]"
                />
          </q-card-section>

          <q-card-section >
            {{tdc('Algumas informações da conta e do sistema podem ser enviadas para a Mytech. Nós o usaremos para corrigir problemas e melhorar nossos serviços de acordo com nossa Política de Privacidade e Termos de Serviço. Podemos enviar um e-mail para mais informações ou atualizações. Vá para a Ajuda Jurídica para solicitar alterações de conteúdo por motivos legais.')}}
          </q-card-section>
          <q-separator />

          <q-card-actions align="right">
            <q-btn  v-close-popup   :color="$q.dark.isActive ? '' : 'dark'" >{{tdc('Cancelar')}}</q-btn>
            <q-btn   :color="$q.dark.isActive ? 'primary' : 'primary'" type="submit" @click="comentar" > {{tdc('Enviar')}}</q-btn>
          </q-card-actions>
        </q-card>
    
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { tdc } from '../../boot/app'

export default defineComponent({

  setup () {
    return {
      
    }
  },
  props: {
    css: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      tdc: tdc
    }
  },
  created () {
  },
  computed: {
  },
  mounted () {
    
  },

  methods: {

    modal_comment () {
      this.comment = !this.comment
    }
  }
})
</script>
