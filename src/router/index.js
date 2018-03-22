import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import PlacesNearby from '@/components/PlacesNearby'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/places/:id',
      name: 'places',
      component: PlacesNearby,
      props: true
    }
  ]
})
