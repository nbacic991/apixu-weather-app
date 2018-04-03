<template>
  <v-app id="app">
    <app-nav></app-nav>
    <router-view/>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import Navigation from '../src/components/Navigation'
import Footer from '../src/components/Footer'

export default {
  name: 'App',
  components: {
    'app-nav': Navigation,
    'app-footer': Footer
  }
}
</script>

<style>

body {
  margin: 0;
  
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
