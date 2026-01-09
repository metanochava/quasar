
let result = false
export const localStorageSetItem = (key, value) => {
  Object.keys(localStorage).forEach(function (keyLocal) {
    if (key === decrypt(keyLocal)) {
      localStorage.removeItem(keyLocal)
    }
  })
  localStorage.setItem(encrypt(key), (value))
}


export const IsAuthorized = {
  bind (el, binding, vnode) {
    const store = vnode.context.$store
    const permissions = store.getters['auth/getPermissions']

    permissions.forEach(element => {
      if (element.nome === binding.value) {
        result = true
      }
    })

    if (!result) {
      el.style.display = 'none'
    }
  }
}

export const pegaDominio = function () {
  let pagelocalurl = location.href // pega endereço que esta no navegador
  pagelocalurl = pagelocalurl.split('/') // quebra o endeço de acordo com a / (barra)
  const dominiourl = pagelocalurl[0] + '//' + pagelocalurl[2]
  return dominiourl // retorna a parte www.endereco.com.brs@
}

export const MeIsAuthorized = function (permissions, permission) {
  let result = false
  // permissions.forEach(element => {
  //   if (element.nome === permission) {
  //     result = true
  //   }
  // })
  result = true
  return result
}

export const traducao = function (texto = '') {
  let returne = ''
  try {
    if (this.$store?.state?.lingua?.Traducao !== '') {
      for (const txt in this.$store?.state?.lingua?.Traducao) {
        for (const key in this.$store?.state?.lingua?.Traducao[txt]) {
          if (remocao(key) === remocao(texto)) {
            const traducao = this.$store?.state?.lingua?.Traducao[txt][key]
            returne = replaceTraducao(texto, traducao)
          }
        }
      }
    }
  } catch (error) {

  }
  if (returne === '') {
    returne = texto
  }
  return returne
}

function remocao (texto) {
  const re = /(\s*%-\s*[a-zA-Z-0-9\s*]+\s*-%\s*)/g
  const newstr = texto?.replace(re, ' ')
  return newstr
}

function captura (texto) {
  const re = /(\s*%-\s*[a-zA-Z-0-9\s*]+\s*-%\s*)/g
  const newstr = texto.match(re)
  return newstr
}

function replaceTraducao (texto, textDeTraducao) {
  const array = captura(texto)
  if (array != null) {
    array.forEach(element => {
      element = element.replace('%-', '')
      element = element.replace('-%', '')
      const text = element.trim()
      const re = /(\s*%-\s*[a-zA-Z-0-9\s*]+\s*-%\s*)/
      textDeTraducao = textDeTraducao.replace(re, ' ' + text + ' ')
    })
  }
  return textDeTraducao
}

export const MeIsTipoEntidade = function (entidade, permission) {
  let result = false
  // console.log(entidade.nome, permission)
  if (entidade.nome === permission) {
    result = true
  }

  return result
}

// Initialize the annoying-background directive.
export const IsTipoEntidade = {
  bind (el, binding, _vnode) {
    if (el) {
      const ite = decrypt(localStorage.getItem(('tipo_entidade_nome')) + '')

      if (!(binding.value === ite)) {
        el.style.display = 'none'
      }
    }
  }
}

export const isTipoEntidadeMe = function (x) {
  const ite = decrypt(localStorage.getItem(('tipo_entidade_nome')) + '')
  if (x === ite) { return true } else { return false }
}

export const urlBase = (url = '') => {
  if (url === '') {
    return process.env.API
  }

  if (url != null) {
    if (url[0] === '/') {
      return process.env.API + url
    }
    if (url[0] === 'h') {
      return url
    }
  }
}

function base64url (source) {
  const CryptoJS = require('crypto-js')
  // Encode in classical base64
  let encodedSource = CryptoJS.enc.Base64.stringify(source)

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '')

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-')
  encodedSource = encodedSource.replace(/\//g, '_')

  return encodedSource
}

export const createToken = (data, secret = 'se') => {
  // const base64url = require('base64url');
  const CryptoJS = require('crypto-js')
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header))
  const encodedHeader = base64url(stringifiedHeader)

  const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data))
  const encodedData = base64url(stringifiedData)

  const token = encodedHeader + '.' + encodedData

  let signature = CryptoJS.HmacSHA256(token, secret)
  signature = base64url(signature)

  const signedToken = token + '.' + signature

  return signedToken
}

export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

export const setStorage = (_type, _cname, _cvalue, _exdays) => {
  if (_type === 'l') {
    localStorage.setItem(_cname, _cvalue)
  }

  if (_type === 'c') {
    setCookie(_cname, _cvalue, _exdays)
  }
}

export const getCookie = (cname, _help = 0) => {
  const name = cname + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  if (_help === 0) {
    return ''
  } else {
    return null
  }
}

export const getStorage = (_type, _cname, _help = 0) => {
  let result = null
  if (_type === 'l') {
    result = localStorage.getItem(_cname)
  }

  if (_type === 'c') {
    if (_help === 0) {
      result = getCookie(_cname)
    } else {
      result = getCookie(_cname, _help)
    }
  }
  return result
}

export const deleteStorage = (_type, _cname) => {
  let result = null
  if (_type === 'l') {
    result = localStorage.removeItem(_cname)
  }

  if (_type === 'c') {
    setCookie(_cname, null, 0)
  }
  return result
}


