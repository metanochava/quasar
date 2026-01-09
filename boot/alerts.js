
import { Notify } from 'quasar'
import { tdc } from './app'
import { AlertStore } from '../stores/AuthStore'

const AlertSuccess = (data) => {
  let sms = data
  let tipo = 'success'
  let go = false
  if (typeof data !== 'string') {
    if (data?.status === 201) {
      sms = tdc('Criado com sucesso!')
      go = true
    }
    if (data?.status === 202) {
      sms = tdc('Processado com sucesso!')
      go = true
    }
    if (data?.status === 203) {
      sms = tdc('Modificado com sucesso!')
      go = true
    }

    if (data?.status === 204) {
      sms = tdc('Apagado com sucesso!')
      go = true
    }

    if (data?.status === 413) {
      sms = tdc('Request Entity Too Large')
      go = true
    }

    if (Object.keys(data?.data).includes('alert_success')) {
      sms = data?.data?.alert_success
      go = true
    }
    if (Object.keys(data?.data).includes('alert_info')) {
      tipo = 'info'
      sms = data?.data?.alert_info
      go = true
    }
  }

  if (typeof data === 'string') {
    go = true
  }

  if (go) {
    Alerta = AlertStore()
    Alerta.add({id: crypto.randomUUID(), sms:  tdc(sms), type: tipo })
    Notify.create({
      type: 'positive',
      message: tdc(sms),
      position: 'top-right',
      html: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { } }
      ]
    })
  }
}

const AlertError = (data) => {
  let sms = data
  tipo = 'error'
  let go = false
  if (typeof data !== 'string') {
    data = data?.response

    if (data?.status === 400) {
      sms = tdc(data?.data)
      go = true
    }
    if (data?.status === 401) {
      sms = tdc(data?.data)
      go = true
    }

    if (data?.status === 403) {
      sms = tdc(data?.data)
      go = true
    }

    if (data?.status === 404) {
      sms = tdc(data?.data)
      go = true
      if (Object.keys(data?.data).includes('detail')) {
        sms = tdc(data?.data?.detail)
        go = true
      }
    }

    if (data?.status === 413) {
      sms = tdc('Request Entity Too Large')
      go = true
    }

    if (data?.status === 500) {
      try {
        sms = tdc(data?.data?.replaceAll('h1', 'b').replace('p', ''))
      } catch (error) {

      }
      go = true
    }

    if (data) {
      if (Object.keys(data?.data).includes('alert_error')) {
        sms = tdc(data?.data?.alert_error)
        go = true
      }
    }
  }

  if (typeof data === 'string') {
    go = true
  }

  if (go) {
    Alerta.add({id: crypto.randomUUID(), sms:  tdc(sms), type: tipo })
    Notify.create({
      type: 'negative',
      message: tdc(sms),
      position: 'top-right',
      html: true,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => { } }
      ]
    })
  }
}

const AlertInfo = (data) => {

  Alerta.add({id: crypto.randomUUID(), sms:  tdc(sms), type: 'info' })
  Notify.create({
    type: 'info',
    position: 'top-right',
    message: tdc(data),
    html: true,
    actions: [
      { icon: 'close', color: 'white', round: true, handler: () => { } }
    ]
  })
}

const Alert= (data) => {
  console.log(data)
}

export { AlertError, AlertInfo, AlertSuccess, Alert }
