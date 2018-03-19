<template>
  <div>
    <div class='main'>
    <div class='wicon'>
      <img :src="forecast.forecastday[0].day.condition.icon" :alt="city">
    </div>
    <h1>{{ city }}</h1>
    <div class="current-tem">
      {{current.temp_c + '°C'}} 
      <p>Feels like: {{ current.feelslike_c + '°C' }}</p>
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
      region: '',
      country: '',
      current: [],
      forecast: [],
      location: []
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
            console.log(response)
            this.current = response.data.current
            this.forecast = response.data.forecast
            this.location = response.data.location
            axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.city}&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc`)
            .then(res => {
              this.places = res.data
            })
          })
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  margin: 50px auto;
  padding:20px;
  background-color:#424242;
  opacity:0.7;
  width:500px;
  height:200px;
  color:white;
  border-radius:50px;
  position: relative;
}
.wicon{
  width:100px;
  height:100px;
  border-radius:100%;
  position:absolute;
  top:-55px;
  box-shadow:0 0 1em white;
  border-style:solid;
  color:white;
}
.wicon img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
