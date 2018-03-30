<template>
  <div class="nearby">
    <h1>Nearby: {{ id }}</h1>
      <v-container>
      <div class="form-group">
        <select
          class="form-control" 
          v-model="placeType" 
          @change="changePlaceType">
          <option disabled value="">Select place type: ex. Restaurant</option>
          <option 
          v-for="item in items.json"
          :key="item"
          :label="item.name"
          class="object">{{ item.value }}</option>
        </select>
      </div>
      </v-container>
      <div style="position: relative;">
        <gmap-map
          :options="{scrollwheel: false}"
          :center="{ lat: lat, lng: long }"
          :zoom="14"
          :label="id"
          style="width: 100%; height: 500px; position: relative;">
          <gmap-marker v-for="(result, i) in results" :key="i"
            @click="open = !open"
            :label="result.name"
            v-bind:position="{lat: result.geometry.location.lat, lng: result.geometry.location.lng}">
          </gmap-marker>
        </gmap-map>
      </div>
      <div class="info">
        <h2>Some more stuff comming soon ! :)</h2>
      </div>
  </div>
</template>

<script>
import DarkSkyApi from 'dark-sky-api'
import axios from 'axios'
import moment from 'moment'
import json from '../assets/json/data.json'
import '../assets/weather-icons.min.css'

export default {
  props: ['id'],
  data() {
    return {
      city: this.id,
      results: [],
      lat: '',
      long: '',
      placeType: '',
      e1: null,
      items: json,
      open: false
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
      })
    },
    changePlaceType() {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
        axios.get(proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.long}&type=${this.placeType}&radius=5000&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc`)
        .then(response => {
          this.results = response.data.results
      })
    }
  }
}
</script>

<style lang="scss">
.nearby {
  background-color: rgba(0,0,0,0.2);
  h1,
  h2,
  h3 {
    padding: 20px 0;
    background: -webkit-linear-gradient(#2196f3, #000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .object {
    text-transform: capitalize;
  }
  .info {
    padding: 20px 0;
  }
}
</style>
