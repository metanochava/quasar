import axios from 'axios'
import { getStorage, setStorage } from './storage'

const apiBaseUrl = process.env.API
axios.defaults.baseURL = apiBaseUrl
axios.defaults.withCredentials = false


const api = apiBaseUrl
export const apiUrl = (payload = { type: '', url: '', params: {} }) => {
  let tipoEntidadeNome = null

  if (process.env.API_TIPO_ENTIDADE_NOME !== undefined) {
    tipoEntidadeNome = process.env.API_TIPO_ENTIDADE_NOME
  } else {
    tipoEntidadeNome = JSON.parse(getStorage('c', 'tipoEntidade'))?.nome.toLowerCase()
  }

  
  let urlFinal = ''

  if (payload.type === 'u') {
    urlFinal = payload.url
  }

  if (payload.type === 'au') {
    urlFinal = api + '/' + payload.url
  }

  if (payload.type === 'anu') {
    urlFinal = api + '/' + tipoEntidadeNome.toLowerCase() + '/' + payload.url
  }

  let lang = 'PT-PT'
  if (getStorage('c', 'lingua') !== null) {
    lang = JSON.parse(getStorage('c', 'lingua')).code
  }

  urlFinal = urlFinal + '?format=json&lang=' + lang
  for (const [key, value] of Object.entries(payload.params)) {
    urlFinal = urlFinal + `&${key}=${value}`
  }

  return urlFinal
}

axios.defaults.headers = {
  Accept: 'application/json'
}

export const wsApi = process.env.API.replace('http', 'ws') + '/' + api

// const TOKKEN = JSON.parse(getStorage('c', 'user'))?.tokens?.access

export const HTTPClient = axios.create({
  baseURL: process.env.API,
  headers: {
    FEK: process.env.FRONT_END_KEY,
    FEP: process.env.FRONT_END_PASSWORD
  }
})

export const HTTPClientBlob = axios.create({
  baseURL: process.env.API,
  headers: {
    FEK: process.env.FRONT_END_KEY,
    FEP: process.env.FRONT_END_PASSWORD
  }
})

export const HTTPAuth = axios.create({
  baseURL: process.env.API,
  
  headers: {
    FEK: process.env.FRONT_END_KEY,
    FEP: process.env.FRONT_END_PASSWORD,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export const HTTPAuthBlob = axios.create({
  baseURL: process.env.API,
  headers: {
    FEK: process.env.FRONT_END_KEY,
    FEP: process.env.FRONT_END_PASSWORD,
    Accept: 'application/json'
  },
  responseType: 'blob'
})

// export { wsApi, apiUrl, apiBaseUrl, HTTPClient, HTTPAuth, HTTPClientBlob, HTTPAuthBlob, axios }