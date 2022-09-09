import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, constantRoutes, allAsyncRoutes, allAnyRoute} from '@/router'
import router from '@/router'

// 通过返回用户异步路由名称数组，从所有异步路由数组中，过滤出用户的异步路由数组
function filterAsyncRoutes(allAsyncRoutes, routerNames){
  let asyncRoutes = allAsyncRoutes.filter(item => {
    if(routerNames.indexOf(item.name) !== -1){
      // 代表当前遍历的这一项路由，它的名称确实在返回的路由名称数组中，那么这一项路由就要了
      if(item.children && item.children.length){
        // 如果当前路由有子路由，子路由也要过滤出用户路由名称包含的
        // 过滤出子路由把原来的子路由替换掉
        item.children = filterAsyncRoutes(item.children, routerNames)
      }
      return true
    }
  })
  return asyncRoutes
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles:[],
    buttons:[],

    asyncRoutes:[],  //从用户信息中，筛选的的用户有权限的异步路由数组
    routes:[], // 整理的真正的路由数组,包含常量路由，异步路由，任意路由
  }
}


const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons   
  },
  SET_ROUTES:(state, asyncRoutes) => {
    state.asyncRoutes = asyncRoutes
    // 把常量路由和异步路由，还有任意路由，拼接成这个用户所有的路由数组，后期生成菜单需要这个总的路由数组
    state.routes = constantRoutes.concat(asyncRoutes, allAnyRoute)
    // 向路由对象中添加异步路由和任意路由
    router.addRoutes([...asyncRoutes,allAnyRoute])
  }
  
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        commit('SET_USERINFO', data)
        commit('SET_ROUTES', filterAsyncRoutes(allAsyncRoutes, data.routes))
        
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

