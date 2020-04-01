// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '../src/App'
import router from './router'
import { Button, FormItem, Form, Input, Message, Container, Aside, Header, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, TableColumn, Table, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree } from 'element-ui'

import './assets/css/global.css'

import axios from 'axios'
//set request root url
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

//before mount to Vue prototype use interceptors to add authorization field to req head
axios.interceptors.request.use((config) => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config 
})

//achieve global mount to Vue prototype
Vue.prototype.$http = axios

Vue.prototype.$message = Message

//mount confirm function to Vue prototype
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
