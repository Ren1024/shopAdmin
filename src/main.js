import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import CategorySelector from '@/components/CategorySelector'
import HintButton from '@/components/HintButton'


import '@/icons' // icon
import '@/permission' // permission control

// 引入全部请求函数，分装成一个对象
import * as API from '@/api'

// 组件全局注册
Vue.component(CategorySelector.name, CategorySelector)
Vue.component(HintButton.name, HintButton)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 把全部请求函数挂载到vue的原型上
Vue.prototype.$API = API

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
