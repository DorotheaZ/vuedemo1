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
import axios from 'axios'
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
  Tabs
} from 'vant'

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
axios.defaults.baseURL = 'http://localhost:3000'
Vue.component('hm-button', HmButton)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-header', HmHeader)
Vue.component('hm-post', HmPost)

axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')