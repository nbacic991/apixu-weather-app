// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import '../node_modules/vuetify/dist/vuetify.min.css'
import { store } from './store/store.js'
import router from './router'
import DarkSkyApi from 'dark-sky-api';

import * as VueGoogleMaps from 'vue2-google-maps'

// Helpers
import colors from 'vuetify/es5/util/colors'

DarkSkyApi.apiKey = '1aaed77b588e96a0a896635a8d15f436';


Vue.use(VueResource)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc',
    v: '3.30',
    libraries: 'places'
  }
});

Vue.use(Vuetify, {
  theme: {
    primary: colors.red.darken-1,
    accent: colors.red.accent2,
    secondary: colors.grey.lighten1,
    info: colors.blue.lighten1,
    warning: colors.amber.darken2,
    error: colors.red.accent4,
    success: colors.green.lighten2
  }
});

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

