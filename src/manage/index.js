import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI);


// vue 根实例对象
new Vue({
  store,
  router,
  created(){
    this.$router.push('/manage');
  },
  render: h => h(App),
}).$mount('#app');


if (module.hot) {
  module.hot.accept();
}
