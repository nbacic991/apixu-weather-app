<template>
  <div class="nearby">
    <h1>Nearby: {{ id }}</h1>
      <v-container>
      <div class="form-group">
        <select
          class="form-control" 
          v-model="placeType" 
          @change="nearByPlaces">
          <option disabled value="">Select place type: ex. Restaurant</option>
          <option 
          v-for="item in items.json"
          :key="item.name"
          :label="item.name"
          class="object">{{ item.value }}</option>
        </select>
      </div>
      <v-alert v-if="open" type="error" :value="true" dismissible @click="open = !open">
        Please choose object type.
      </v-alert>
      <div class="form-group">
        <select
          class="form-control" 
          v-model="radius" 
          @change="changePlaceType">
          <option disabled value="">Select radius: ex. 1000</option>
          <option 
          v-for="item in items.radius"
          :key="item.value"
          :label="item.value"
          class="object">{{ item.value }}</option>
        </select>
      </div>
      </v-container>
      <p class="search-results">Search results: {{ results.length }}</p>
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
      <div class="details">
        <div v-for="result in results" 
        :key="result.id" 
        class="placeID">
        
          <h3>{{ result.name }}</h3>
          <p>{{ result.vicinity }}</p>
        </div>
      </div>
  </div>
</template>

<script>
import DarkSkyApi from 'dark-sky-api'
import axios from 'axios'
import moment from 'moment'
import json from '../assets/json/data.json'
import '../assets/weather-icons.min.css'

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const apiKey = 'AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc'


export default {
  props: ['id'],
  data() {
    return {
      city: this.id,
      results: [],
      lat: '',
      long: '',
      placeType: '',
      radius: '',
      items: json,
      open: false
    }
  },
  mounted() {
    this.thisCity()
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
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
        if(this.placeType == '') {
          this.open = true
        } else {
          axios.get(proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.long}&type=${this.placeType}&radius=${this.radius}&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc`)
        .then(response => {
          this.results = response.data.results
          this.$store.dispatch('finishLoading', false)
          this.open = false
          console.log(this.results) 
        })
      }
    },
    nearByPlaces() {
      this.changePlaceType()
    }
  }
}
</script>

<style lang="scss">
.nearby {
  font-family: 'Mada', sans-serif;
  background-color: rgba(0,0,0,0.2);
  h1,
  h2,
  h3 {
    padding: 20px 0;
    background: -webkit-linear-gradient(#2196f3, #000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .search-results {
    font-size: 25px;
    text-decoration: underline;
  }
  .object {
    text-transform: capitalize;
  }
  .details {
    padding: 20px 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 10px;
    @media screen and (max-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }
    .placeID {
      flex-basis: 33%;
      margin-bottom: 20px;
      padding: 15px;
      img {
        max-width: 150px;
        width: 100%;
      }
    }
  }
  
}
</style>
