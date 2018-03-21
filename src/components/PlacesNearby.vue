<template>
  <div>
    <h1>These are the places {{ id }}</h1>
    <div style="position: relative;">
      <gmap-map
        :options="{scrollwheel: false}"
        :center="{lat: lat, lng: long }"
        :zoom="14"
        :label="id"
        style="width: 100%; height: 300px; position: relative;">
        <gmap-marker v-for="(result, i) in results" :key="i"
          :label="result.name"
          v-bind:position="{lat: result.geometry.location.lat, lng: result.geometry.location.lng}">
        </gmap-marker>
      </gmap-map>
    </div>
  
  </div>
</template>

<script>
import DarkSkyApi from 'dark-sky-api'
import axios from 'axios'
import moment from 'moment'
import '../assets/weather-icons.min.css'

export default {
  props: ['id'],
  data() {
    return {
      city: this.id,
      results: [],
      lat: '',
      long: ''
    }
  },
  mounted() {
    this.thisCity()
  },
  computed: {
  },
  methods: {
    thisCity() {
      DarkSkyApi.loadForecast() 
        .then(result => {
        this.lat = result.latitude
        this.long = result.longitude
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        axios.get(proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${result.latitude},${result.longitude}&radius=5000&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc`)
        .then(response => {
          this.results = response.data.results
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
