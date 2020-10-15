import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },
    {
      path: '/my-follow',
      name: 'my-follow',
      component: MyFollow
    },
    {
      path: '/my-comment',
      name: 'my-comment',
      component: MyComment
    },
    {
      path: '/my-star',
      name: 'my-star',
      component: MyStar
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log('守卫:', to.path, from.path)
  const authUrl = ['/user', '/edit', '/my-star', '/my-comment', '/my-follow']
  if (authUrl.includes(to.path)) {
    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router