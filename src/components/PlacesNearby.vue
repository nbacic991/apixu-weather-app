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
        <div v-for="result in results" :key="result.id" class="placeID">
          <p>{{ result.name }}</p>
          <p>{{ result.vicinity }}</p>
          <p>{{ result.photos[0].photo_reference }}</p>
          <img :src="'https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=' + result.photos[0].photo_reference + '&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc'" alt="" />
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
      e1: null,
      items: json,
      image: '',
      placeIds: [],
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
        // console.log(result)
        this.lat = result.latitude
        this.long = result.longitude
      })
    },
    changePlaceType() {
        axios.get(proxyurl + `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.long}&type=${this.placeType}&radius=5000&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc`)
        .then(response => {
          this.results = response.data.results
          
          console.log(this.results)
      })
    },
    nearByPlaces() {
      this.changePlaceType()
      // axios.post(proxyurl + `https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.placeIdOne}&key=${apiKey}`)
      //   .then(response => {
      //     console.log(response)
      //     this.image = response.data.result.photos[0].photo_reference
      //     console.log(this.image)
      // })
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
  .placeID {
    margin-bottom: 20px;
    img {
      max-width: 150px;
      width: 100%;
    }
  }
}
</style>
