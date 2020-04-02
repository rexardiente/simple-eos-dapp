import Vue from 'vue'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Home from './views/Home.vue';

// Global variables
const NotFound = { template: '<p>Page not found</p>' };

const routes = {
  '*': NotFound,
  '/': Home,
  '/home': Home,
}


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

// Vue instance
new Vue({
	vuetify,
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute]
    }
  },
  render (h) { return h(this.ViewComponent) }
});
