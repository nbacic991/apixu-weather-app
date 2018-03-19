<template>
<div>
  <div v-if="!loading" class="main-app" v-bind:style="{ 'background-image': 'url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=12000&photoreference=' + image + '&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc)' }">
    <div class='main' >
      <div class='wicon'>
        <img :src="forecast.forecastday[0].day.condition.icon" :alt="city">
      </div>
      <h1>{{ city }}</h1>
      <div class="current-tem">
        {{current.temp_c + '°C'}} 
        <p>Feels like: {{ current.feelslike_c + '°C' }}</p>
        
      </div>
    </div>
    
  </div>
  <gmap-map
      :options="{scrollwheel: false}"
      :center="{lat:location.lat, lng:location.lon}"
      :zoom="7"
      style="width: 500px; height: 300px">
        <gmap-marker
        :position="{lat:location.lat, lng:location.lon}"></gmap-marker>
    </gmap-map>
</div>
  
</template>

<script>
import axios from 'axios'

const apiKey = 'AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc'

export default {
  name: 'HelloWorld',
  data () {
    return {
      city: '',
      current: [],
      forecast: [],
      location: [],
      placeId: '',
      image: '',
      loading: true
    }
  },
  mounted() {
    this.getIp()
  },
  methods: {
    getIp() {
      axios.get("https://ipinfo.io")
      .then(response => {
        this.city = response.data.city
        axios.get(`https://api.apixu.com/v1/forecast.json?key=324b63316a4440e4ad675706181903&q=${response.data.city}`)
          .then(response => {
            this.current = response.data.current
            this.forecast = response.data.forecast
            this.location = response.data.location

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
<style scoped>
.main-app {
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
}
</style>
