import axios from 'axios'
import { getStorage, setStorage } from './storage'
import { AuthStore, UserStore } from '../stores/AuthStore'
import { LoadStore } from '../stores/AuthStore'

import { Alert, AlertError, AlertSuccess } from './alerts'

const apiBaseUrl = process.env.API
axios.defaults.baseURL = apiBaseUrl
axios.defaults.withCredentials = false


function safeParse (value) {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export const url = (payload = {type: 'u', url: '', params: {} }) => {
  let tipoEntidadeNome = AuthStore?.TipoEntidate?.nome

  let urlFinal = ''

  if (payload.type === 'u') {
    urlFinal = apiBaseUrl + '/' + payload.url
  }

  if (payload.type === 'nu') {
    urlFinal = apiBaseUrl + '/' + tipoEntidadeNome.toLowerCase() + '/' + payload.url
  }

  const Auth = AuthStore()
  let lang = Auth?.Idioma
  
  urlFinal = urlFinal + '?format=json&lang=' + lang?.nome
  for (const [key, value] of Object.entries(payload?.params)) {
    urlFinal = urlFinal + `&${key}=${value}`
  }
  return urlFinal
}

axios.defaults.headers = {
  Accept: 'application/json'
}

export const wsApi = process.env.API.replace('http', 'ws') + '/' + apiBaseUrl

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



HTTPAuth.interceptors.request.use(async config => {
  const User = UserStore()
  config.withCredentials = false
  if (config.headers.Cookie) {
    delete config.headers.Cookie
  }
  
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  const headersMap = {
    E: 'userEntidade',
    S: 'userSucursal',
    G: 'userGrupo',
    ET: 'tipoEntidade'
  }

  config.headers.Authorization = `Bearer ${getStorage('c', 'access') || ''}`

  Object.entries(headersMap).forEach(([key, storage]) => {
    const data = safeParse(getStorage('c', storage))
    if (data?.id) config.headers[key] = data.id
  })
  const Load = LoadStore()
  Load.inc

  return config
})

HTTPAuth.interceptors.response.use(
  (response) => {
    const User = UserStore()
    const Load = LoadStore()
    Load.dec
    Alert(response)
    return response
  },
  (error) => {
    const User = UserStore()
    const Load = LoadStore()
    Load.dec
    if (error.response) {
      Alert(error.response)
      const status = error.response.status

      if (status === 401 || status === 403) {
        User.logout('N')
      }
    }
    return Promise.reject(error)
  }
)



HTTPAuthBlob.interceptors.request.use(async config => {
  store.commit('load/SET_LOAD', 1)
  const user = JSON.parse(getStorage('c', 'user'))
  setStorage('c', 'user', JSON.stringify(user), 365)
  config.headers.Authorization = 'Bearer ' + user?.tokens?.access

  const Load = LoadStore()
  Load.inc
  return config
})
