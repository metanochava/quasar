import { defineStore } from 'pinia'
import { getStorage, setStorage, deleteStorage } from '../boot/storage'
import { HTTPAuth, HTTPClient, url } from '../boot/api'
import { tdc } from '../boot/app'




export const LoadStore = defineStore('load', {
  state: () => ({
    count: 0
  }),
  getters: {
    value: (state) => state.counter,
  },
  actions: {
    inc() {
      this.count++
    },
    dec() {
      this.count--
    },
  }
})


export const AlertStore = defineStore('alert', {
  state: () => ({
    data: []
  }),
  actions: {
    add(alert) {
      this.data.push(alert)
    },
    remove(alert) {
      this.data = this.data.filter(a => a.id !== alert.id)
    },
    clear() {
      this.data = []
    },
  }
})



export const AuthStore = defineStore('auth', {
  state: () => ({
    TipoEntidades: [],
    TipoEntidade: { },
    TipoEntidadeMenus: [],
    search: '',
    TipoEntidadeAllMenus: [],
    Idiomas: [ ]
  }),

  getters: {

  },

  actions: {
    async getTipoEntidades(){
      await HTTPClient.get(url({type: "u", url: "auth/tipoEntidades", params: {}}) )
      .then(res => {
        this.TipoEntidades = res.data
      }).catch(err => {

      })
    },
    async setTipoEntidadeMenus () {
      await HTTPAuth.get(url({ type: 'u', url: 'auth/tipoEntidades/' + this.TipoEntidade.id + '/menus', params: {} }))
        .then(res => {
          this.TipoEntidadeAllMenus = res.data
          this.TipoEntidadeMenus = this.TipoEntidadeAllMenus
        }).catch(err => {
          console.log(err)
        })
    },
  }
})

export const LanguageStore = defineStore("lang", {
  state: () => ({
    current: {} ,
    list: [],
  }),

  actions: {
    change(lang) {
      this.current = lang
    },

    async get() {
      await HTTPClient.get(url({type: "u", url: "auth/idiomas", params: {}}) )
      .then(res => {
        this.list = res.data
        this.current = this.list[0]
      }).catch(err => {
      })
    }
  },
})


export const UserStore = defineStore("user", {
  state: () => ({
    data: null,
    TipoEntidade: [],
    Entidades: [],
    Entidade: null,
    EntidadeModelos: [],
    EntidadeModulos: [],
    Sucursals: [],
    Sucursal: null,
    Grupos: [],
    Grupo: {id: '1',  name: 'Gest' },  
    Settings: false,
    Permicoes: [],
    access: null,
    refresh: null,
    LeftTop: true,
    RigthTop: true,
    LeftMenu: true,
    isLogin: false,
    isLogout: false,
    manterLogado: false,
  }),

  getters: {
    username: (state) => state.data?.username || ".",
    perfil: (state) =>
      state.data?.perfil.url ||
      "https://awsacademy.instructure.com/images/messages/avatar-50.png",
  },

  actions: {
    async setEntidadeModelos () {
      await HTTPAuth.get(url({ type: 'u', url: 'auth/entidades/' + this.Entidade?.id + '/modelos', params: {} }))
        .then(res => {
           this.EntidadeModelos = res.data
        }).catch(err => {
          console.log(err)
        })
    },
    isTokenExpired (token) {
      if (!token) return true
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const now = Math.floor(Date.now() / 1000)
        return payload.exp < now
      } catch (e) {
        return true
      }
    },
    safeParse (value) {
      try {
        return value ? JSON.parse(value) : null
      } catch {
        return null
      }
    },
    setIdioma(idioma){
      this.Idioma = idioma
    },
    selectGroup(grupo){
      this.Grupo = grupo
    },
    toggleSettings(){
      this.Settings = !this.Settings
      setStorage('c', 'settings', this.Settings)
    },
    toggleLeftTop(){
      this.LeftTop = !this.LeftTop
      setStorage('c', 'left_top', this.LeftTop)
    },
    toggleRightTop(){
      this.RightTop = !this.RightTop
      setStorage('c', 'right_top', this.RightTop)
    },

    async login(data, q) {
      const rsp = await HTTPClient.post(url({type: "u", url: "auth/login/", params: {}}), data )
      .then(async res => {
        this.access = res.data.tokens.access
        this.refresh = res.data.tokens.refresh
        setStorage('c', 'access', this.access,  365)
        setStorage('c', 'refresh', this.refresh,  365)

        if (this.manterLogado) {
          setStorage('c', 'username', data.email, 365)
          setStorage('c', 'password', data.password, 365)
        } else {
          deleteStorage('c', 'username')
          deleteStorage('c', 'password')
        }
        
        await this.me()
        await this.getEntidades_(q)
      }).catch(err => {
        console.log(err)
        
      })
      return rsp
    },

    async me() {
      const rsp = await HTTPAuth.get(url({type: "u", url: "auth/me", params: {}}) )
      .then(res => {
        this.data = res.data
        setStorage('c', 'user', JSON.stringify(this.data),  365)
      }).catch(err => {
        console.log(err)
      })
      return rsp
    },


    async refreshToken() {
      const data = {refresh: this.refresh }
      const rsp = await HTTPAuth.post(url({type: "u", url: "auth/refresh_token/", params: {}}), data )
      .then(res => {
        this.access = res.data.access
        console.log('deu  access')
      }).catch(err => {
        console.log('nao deu  access')
      })
      return rsp
    },

    async change_password_email(email, antiga, nova) {
      const data = { email: email, password: antiga, passwordNova: nova }
      const rsp = await HTTPAuth.post(url({type: "u", url: "auth/change_password_email/", params: {}}), data )
      .then(res => {
      }).catch(err => {

      })
      return rsp
    },

    async change_password_numero(mobile, otp, nova) {
      const data = { mobile: mobile, otp: otp, password: nova }
      const rsp = await HTTPAuth.post(url({type: "u", url: "auth/change_password_email/", params: {}}), data )
      .then(res => {
      }).catch(err => {

      })
      return rsp
    },

    async getEntidades () {
      if (!this.data?.id) return
      const rsp = await HTTPAuth.get( url({ type: 'u', url: `auth/users/${this.data.id}/userEntidades/`,params: {}}))
      setStorage('c', 'userEntidades', JSON.stringify(rsp.data), 365)
      this.Entidades = rsp.data
      return rsp
    },

     async getEntidades_ (q) {

      if (!this.data?.id) return

      try {
        const res = await HTTPAuth.get(
          url({
            type: 'u',
            url: `auth/users/${this.data.id}/userEntidades/`,
            params: {}
          })
        )

        setStorage('c', 'userEntidades', JSON.stringify(res.data), 365)
        this.Entidades = res.data

        if (res.data.length === 1) {
          this.selectEntidade_(res.data[0], q)
        } else {
          if (res.data.length === 0) {
            this.Grupo = {id: '1',  name: 'Gest' }
            return  
          }
          const entidades = res.data.map(e => ({
            label: this.perfilSplint(e.nome),
            value: e
          }))
          
          q.dialog({
            title: tdc('Seleccione a Entidade'),
            options: {
              type: 'radio',
              model: 'opt1',
              items: entidades
            },
            cancel: true,
            persistent: true
          }).onOk(data => this.selectEntidade_(data, q))
          .onCancel(() => {
            this.Grupo = {id: '1',  name: 'Gest' }
          })
        }
      } catch (err) {
        console.error(err)
      }
    },

    selectEntidade_ (entidade, q) {
      this.Entidade = entidade
      setStorage('c', 'userEntidade', JSON.stringify(entidade), 365)
      this.getSucursals_(q)
    },

    async getSucursals_ (q) {
      await HTTPAuth.get(url({ type: 'u', url: 'auth/users/' + this.data?.id + '/userSucursals/', params: { } }))
        .then(async res => {
          setStorage('c', 'userSucursals', JSON.stringify(res.data), 365)
          if (res.data.length === 1) {
            this.selectSucursal_(res.data[0], q)
          } else {
            if (res.data.length === 0) {
              this.Grupo = {id: '1',  name: 'Gest' }
              return  
            }
            const sucursals = []
            res.data.forEach(element => {
              sucursals.push({ label: this.perfilSplint(element.nome), value: element })
            })
            q.dialog({
              title: tdc('Seleccione a Sucursal'),
              options: {
                type: 'radio',
                model: 'opt1',
                isValid: val => true,
                items: sucursals
              },
              cancel: true,
              persistent: true
            }).onOk(data => {
              this.selectSucursal_(data, q)
            }).onCancel(() => {
              this.Grupo = {id: '1',  name: 'Gest' }
            })
          }
        }).catch(err => {
          console.log(err)
        })
    },

    selectSucursal_ (sucursal, q) {
      this.Sucursal = sucursal
      setStorage('c', 'userSucursal', JSON.stringify(sucursal), 365)
      this.getGrupos_(q)
    },

    selectEntidade (entidade) {
      setStorage('c', 'userEntidade', JSON.stringify(entidade), 365)
      this.Entidade = JSON.parse(getStorage('c', 'userEntidade'))
      this.getSucursals()
      this.setEntidadeModulos()
    },

    selectSucursal (sucursal) {
      this.Sucursal = sucursal
      setStorage('c', 'userSucursal', JSON.stringify(sucursal), 365)
      this.getGrupos()
    },

    async getSucursals () {
      this.spiner = true
      if (getStorage('c', 'userEntidade') !== null) {
      
        const rsp = await HTTPAuth.get(url({ type: 'u', url: 'auth/users/' + this.data?.id + '/userSucursals/', params: { } }))
          .then(res => {
            setStorage('c', 'userSucursals', JSON.stringify(res.data), 365)
            this.Sucursals = res.data
          }).catch(err => {
            console.log(err)
          })
        return rsp
      }
    },

    

    async selectGrupo (grupo) {
      setStorage('c', 'userGrupo', JSON.stringify(grupo), 365)
      this.Grupo = grupo
      await this.getPermicoes()
    },

    async getGrupos () {

      const res = await HTTPAuth.get(
        url({ type: 'u', url: `auth/users/${this.data?.id}/userGrupos/`, params: {} })
      )

      setStorage('c', 'userGrupos', JSON.stringify(res.data), 365)
      this.Grupos = res.data

      if (res.data.length === 1) {
        this.selectGrupo_(res.data[0])
      }
      return res
    }, 
    
    async getGrupos_ (q) {

      const res = await HTTPAuth.get(
        url({ type: 'u', url: `auth/users/${this.data?.id}/userGrupos/`, params: {} })
      )

      setStorage('c', 'userGrupos', JSON.stringify(res.data), 365)
      this.Grupos = res.data

      if (res.data.length === 1) {
        this.selectGrupo_(res.data[0])
      }else{
        if (res.data.length === 0) {
          this.Grupo = {id: '1',  name: 'Gest' }
          return  
        }
        const grupos = []
        grupos.push( { label: 'Gest', value: {id: '1',  name: 'Gest' } })
        res.data.forEach(element => {
          grupos.push({ label: this.perfilSplint(element.name), value: element })
        })
        q.dialog({
          title: tdc('Seleccione o Grupo'),
          options: {
            type: 'radio',
            model: 'opt1',
            isValid: val => true,
            items: grupos
          },
          cancel: true,
          persistent: true
        }).onOk(data => {
          this.selectGrupo_(data)
        }).onCancel(() => {
          this.Grupo = {id: '1',  name: 'Gest' }
        })
      }
      return res
    },

    selectGrupo_ (group) {
      this.Grupo = group
      setStorage('c', 'userGrupo', JSON.stringify(group), 365)
      this.getPermicoes()
    },

    async setEntidadeModulos () {
      if (getStorage('c', 'userEntidade') !== null) {

        const rsp = await HTTPAuth.get(url({ type: 'u', url: 'auth/entidades/' + this.Entidade.id + '/modulos/', params: { } }))
          .then(res => {
            setStorage('c', 'entidadeModulos', JSON.stringify(res.data), 365)
            this.EntidadeModulos = res.data
          }).catch(err => {
            console.log(err)
          })
        return rsp 
      }
    },
    
    async getPermicoes () {
      if (getStorage('c', 'userSucursal') !== null) {

        const rsp = await HTTPAuth.get(url({ type: 'u', url: 'auth/users/' + this.data?.id + '/userPermicoes/', params: { } }))
          .then(res => {
            setStorage('l', 'userPermicoes', JSON.stringify(res.data), 365)
            this.Permicoes = res.data
          }).catch(err => {
            console.log(err)
          })
        return rsp
      }
    },
    

    isAuthorized (permission) {
      let result = false
      if (Array.isArray(this.Permicoes)) {
        this.Permicoes.forEach(element => {
          if (element.nome === permission) {
            result = true
          } else {

          }
        })
      }
      return true
      // return result
    },

    perfilSplint (txt) {
      if (!txt) return null
      const p = txt.split('_')
      return p[1] ?? p[0]
    },

    isTokenExpired (token) {
      if (!token) return true

      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const now = Math.floor(Date.now() / 1000)

        return payload.exp < now
      } catch (e) {
        return true
      }
    },
    async checkSession () {
      console.log('checkSession')
      // access ainda válido → nada a fazer
      if (!this.isTokenExpired(this.access)) {
        console.log('access valido')
        return
      }
      // access expirou → tenta refresh
      if (!this.isTokenExpired(this.refresh)) {
        console.log('access invalido')
        try {
          console.log('pedir access')
          await this.refreshToken()
          return
        } catch (e) {
        }
      }
    },

    async logout(x) {
      if (x == 'N') {
        this.isLogout = !this.isLogout
        this.isLogin = false
        return
      } 

      const rsp = await HTTPAuth.post(url({type: "u", url: "auth/logout/", params: {}}), {refresh: this.refresh} )
      .then(res => {
        this.data = null
        this.refresh = null
        this.access = null
        this.Grupos = []
        this.Entidades = []
        this.Entidade = null
        this.Sucursals = []
        this.Sucursal = null
        this.Grupo = {id:'1', name:'Hóspede'}

        const userEntidade = getStorage('c', 'userEntidade')

        deleteStorage('c', 'access')
        deleteStorage('c', 'refresh')
        deleteStorage('c', 'userEntidades')
        deleteStorage('c', 'userEntidade')
        deleteStorage('c', 'userSucursals')
        deleteStorage('c', 'userSucursal')
        deleteStorage('c', 'user')
        deleteStorage('c', 'userGrupos')
        deleteStorage('c', 'userGrupo')
        deleteStorage('c', 'linga')
        deleteStorage('c', 'entidadeModulos')
        deleteStorage('c', 'entidadeModelos')

        deleteStorage('l', 'traducao')
        deleteStorage('l', 'userPermicoes')
        deleteStorage('l', 'manterlogado')
        deleteStorage('l', 'username')
        deleteStorage('l', 'password')

        if (x !== 'x') {
          setStorage('c', 'userEntidade', userEntidade, 365)
        } 
        
        setStorage('c', 'userGrupo', this.Grupo, 365)
        this.isLogout = !this.isLogout
        this.isLogin = false
      }).catch(err => {
        this.isLogout = !this.isLogout
        this.isLogin = false
      })

      return rsp 
    }

  },
})

