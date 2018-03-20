<template>
<div >
  <v-progress-circular 
        indeterminate
        color="primary--text"
        :width="7"
        :size="70"
        v-if="loading"></v-progress-circular>
  <div v-if="!loading" class="main-app" v-bind:style="{ 'background-image': 'url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=12000&photoreference=' + image + '&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc)' }">
    <div class='main'>
      <div class='stats'>
        <i :class="'wi wi-'+ icon + ' large'"></i>
        <h1>{{ city }}</h1>
      </div>
    </div>
  </div>
  <gmap-map
    v-if="!loading"
    :options="{scrollwheel: false}"
    :center="{lat: latitude, lng: longitude }"
    :zoom="7"
    style="width: 100%; height: 300px">
      <gmap-marker
        v-bind:position="{lat: latitude, lng: longitude}"></gmap-marker>
      </gmap-map>
</div>
  
</template>

<script>

import DarkSkyApi from 'dark-sky-api'
import axios from 'axios'
import '../assets/weather-icons.min.css'

const apiKey = 'AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc'

export default {
  name: 'HelloWorld',
  data () {
    return {
      city: '',
      latitude: '',
      longitude: '',
      placeId: '',
      image: '',
      icon: '',
      loading: true
    }
  },
  mounted() {
    this.getIp()
  },
  methods: {
    getIp() {
      DarkSkyApi.loadForecast()
      .then(result => {
        console.log(result)
        this.latitude = result.latitude
        this.longitude = result.longitude
        this.icon = result.daily.icon
        axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.latitude},${result.longitude}&key=${apiKey}`)
        .then(response => {
          console.log(response)
          this.city = response.data.results[0].address_components[2].long_name

          const proxyurl = "https://cors-anywhere.herokuapp.com/";
          axios.get( proxyurl + `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.city}&key=${apiKey}`)
            .then(res => {
              this.placeId = res.data.results[0].place_id
              axios.post(proxyurl + `https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.placeId}&key=${apiKey}`)
              .then(response => {
                this.image = response.data.result.photos[0].photo_reference
                this.loading = false
              })
            })
        })
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-app {
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  .main {
    padding: 50px 0;
    .stats {
      max-width: 500px;
      width: 100%;
      margin: auto;
      padding: 20px 0;
      height: 300px;
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
