import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children : [
      {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'Users',
        component: Users
      }
    ]
    },
  ]
})

//mount beforeEach
router.beforeEach((to, from, next) => {
  //to => path to be accessed
  //from => came to which path 
  //next => function means passed
  if(to.path ==='/login') return next()
  //get token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('./login')
  next()
})

export default router