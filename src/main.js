// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '../src/App'
import router from './router'
import { Button, FormItem, Input, Message } from 'element-ui'

import './assets/css/global.css'

import axios from 'axios'
//set request root url
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//achieve global mount to Vue prototype
Vue.prototype.$http = axios
Vue.prototype.$message = Message

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
vue.use(Input)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
