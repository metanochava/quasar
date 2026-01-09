import { getStorage, setStorage } from './storage'

import { url } from './api'

export const getHostname = (tipoEnt) => {
  const domain = window.location.href.split('/')[2].split('.')[0]
  if (domain.toLocaleLowerCase() !== tipoEnt.nome.toLowerCase()) {
    return true
  } else {
    this.$store.commit('tipoEntidade/SET_TIPO_ENTIDADE', tipoEnt)
    setStorage('c', 'tipoEntidade', JSON.stringify(tipoEnt))
    location.reload()
    return false
  }
}

export const getTipoEntidades = async () => {
  try {
    const response = await fetch(url({ type: 'nu', url: 'tipoEntidades/', params: { } }), {
      method: 'GET'
    }).then(response => {
      this.$store.commit('tipoEntidade/SET_TIPO_ENTIDADES', response?.data?.results)
      response?.data?.results.forEach(tipoEntidade => {
        getHostname(tipoEntidade)
      })
    })
    return response
  } catch (error) {
    console.warn('conf.js => 29' + error.message)
  }
}

export const getEntidade = async (id) => {
  try {
    const response = await fetch(url({ type: 'banu', url: 'entidades/' + id, params: { } }), {
      method: 'GET'
    }).then(response => {
      this.$store.commit('entidade/SET_ENTIDADE', response?.data)
    })
    return response
  } catch (error) {
    console.warn('conf.js => 42' + error.message)
  }
}

export const funcAppName = () => {
  let name = ''
  // console.log(getStorage('c', 'userEntidade'))
  try {
    if (getStorage('c', 'userEntidade', 2) === null) {
      if (getStorage('c', 'tipoEntidade', 2) !== null) {
        name = JSON.parse(getStorage('c', 'tipoEntidade', 2) + ' ')?.nome
      }
    }
  } catch (error) {
    console.warn('conf.js => 56' + error.message)
  }
  return name
}

export const funcAppLogo = () => {
  let logo = ''
  if (getStorage('c', 'userEntidade', 2) === null) {
    // logo = process.env.API + JSON.parse(getStorage('c', 'tipoEntidade') + ' ')?.icon
    if (getStorage('c', 'tipoEntidade', 2) !== null) {
      logo = JSON.parse(getStorage('c', 'tipoEntidade', 2) + ' ')?.icon?.url
    } else {
      getTipoEntidades().then(res => {
        try {
          logo = res?.data?.tipoEntidade?.icon?.url
          if (getStorage('l', 'rloadTipoEntidadeLogo') !== '1') {
            setStorage('l', 'rloadTipoEntidadeLogo', 1)
            window.location.reload()
          }
        } catch (error) {
          console.warn('conf.js => 73' + error.message)
        }
      })
    }
  }
  return logo
}

export const funcEntidadeName = () => {
  let name = ''
  if (getStorage('c', 'userEntidade', 2) !== null) {
    name = JSON.parse(getStorage('c', 'userEntidade', 2) + ' ')?.nome
  }
  return name
}

export const funcEntidadeLogo = () => {
  let logo = ''
  if (getStorage('c', 'userEntidade', 2) !== null) {
    logo = JSON.parse(getStorage('c', 'userEntidade', 2) + ' ')?.logo
  } else {
    getEntidade().then(res => {
      try {
        if (getStorage('l', 'rloadEntidadeLogo') !== '1') {
          setStorage('l', 'rloadEntidadeLogo', 1)
          window.location.reload()
        }
      } catch (error) {
        console.warn('conf.js => 99' + error.message)
      }
    })
  }

  return logo
}

export const config = {
  appName: funcAppName(),
  appLogo: funcAppLogo(),
  entidadeName: funcEntidadeName(),
  entidadeLogo: funcEntidadeLogo()
}
