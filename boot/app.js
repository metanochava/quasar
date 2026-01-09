import { traducao } from './base'
import { dateSplit } from './data'

let result = false

export const api = 'api'
export const thumbStyle = {
  right: '5px',
  borderRadius: '8px',
  backgroundColor: '#027be3',
  width: '8px',
  opacity: 0.75
}

export const barStyle = {
  right: '2px ',
  borderRadius: '14px',
  backgroundColor: '#027be3',
  width: '14px',
  opacity: 0.2,
  marginTop: '-3px',
  marginBottom: '-3px',
  paddingTop: '3px',
  paddingBottom: '3px'
}


// Initialize the annoying-background directive.
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
  // const store = useStore()
  let result = false
  if (Array.isArray(permissions)) {
    permissions.forEach(element => {
      if (element.nome === permission) {
        result = true
      } else {
        // store?.commit('auth/SET_PAGEPERMISSOES', permission)
      }
    })
  }
  return result
}

export const tdc = traducao
export const ds = dateSplit

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




export const MeIsTipoEntidade = (nome) => {
  let result = false
  if (JSON.parse(getStorage('c', 'tipoEntidade'))?.nome === nome) {
    result = true
  }
  return result
}
