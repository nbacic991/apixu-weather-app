<template>
  <v-footer height="auto" class="grey darken-3">
    <v-layout row wrap justify-center>
      <v-btn
        color="white"
        flat
        v-for="menuItem in menuItems" :key="menuItem.name"
        :to="menuItem.value">
        {{ menuItem.name }}
      </v-btn>
      <v-flex xs12 py-3 text-xs-center white--text>
        Copyright &copy;2018 — <strong>@nbaci991</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
import menuItems from '../assets/json/data.json'

export default {
  data() {
    return {
      menuItems: menuItems.menuItems
    }
  }
}
</script>

<style lang="scss">

</style>

