import VueRouter from 'vue-router'
import Vue from 'vue'
import Manage from '../components/Manage'
import UserStatistic from '../components/UserStatistic'

Vue.use(VueRouter)

//路由配置
export default new VueRouter({
    routes: [{
      path: '/manage',
      component: Manage
    }, {
      path: '/userstatistic',
      component: UserStatistic
    }]
})