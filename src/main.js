import Vue from 'vue'
import App from './App.vue'
import './styles/base.less'
import './styles/iconfont.css'
import router from './routers'
import 'lib-flexible'
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmButton from './components/HmButton.vue'
import HmPost from './components/HmPost.vue'
import HmComment from './components/HmComment.vue'
import HmFloor from './components/HmFloor.vue'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import {
  Field,
  Toast,
  Cell,
  CellGroup,
  Dialog,
  Radio,
  RadioGroup,
  Uploader,
  List,
  Tab,
  Tabs,
  Sticky,
  PullRefresh,
  Icon
} from 'vant'

Vue.use(Icon)
Vue.use(PullRefresh)
Vue.use(Sticky)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(List)
Vue.use(Uploader)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.filter('date', (res, format = 'YYYY-MM-DD') => {
  return moment(res).format(format)
})
Vue.prototype.$axios = axios
Vue.prototype.$_ = _
axios.defaults.baseURL = 'http://localhost:3000'
Vue.component('hm-button', HmButton)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-header', HmHeader)
Vue.component('hm-post', HmPost)
Vue.component('hm-comment', HmComment)
Vue.component('hm-floor', HmFloor)

const bus = new Vue()
Vue.prototype.$bus = bus

axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

axios.interceptors.response.use(function (res) {
  // 拦截器会拦截所有的请求的响应，返回拦截到的res
  // console.log('拦截到了res', res)
  // 通用对token失效进行处理
  const {
    statusCode,
    message
  } = res.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // 说明token是验证失败的
    // 就需要跳转到登录页面去
    router.push({
      name: 'login',
      params: {
        back: true
      }
    })
    // 删除过期的token信息
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')

    // 可以给一个提示消息
    Toast.fail(message)
  }

  return res
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')