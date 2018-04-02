<template>
  <div id="app">
    <app-nav></app-nav>
    <router-view/>
  </div>
</template>

<script>
import Navigation from '../src/components/Navigation'
export default {
  name: 'App',
  components: {
    'app-nav': Navigation
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
