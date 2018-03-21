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
      <div class="wrapper">
        <div class="box a space">
          <h3>You are in: {{ city }}</h3>
          <p>Current time is: {{ currTime | moment }}</p>
        </div>
        <div class="box b">
          <i :class="'wi wi-'+ icon + ' large'"></i>
          <h3>{{ city }}</h3>
          
          <p class="large">
            <i class="fas fa-thermometer-quarter large"></i>
            <span>{{((temp - 32)* 0.5556).toFixed(0) + '°C'}}</span>
          </p>
          <div class="temp">
            <p class="medium"> Max temp: {{ ((days[0].temperatureMax - 32) * 0.5556).toFixed(0) + '°C' }}</p>
            <p class="medium"> Max temp: {{ ((days[0].temperatureMin - 32) * 0.5556).toFixed(0) + '°C' }}</p>
          </div>
        </div>
        <div class="box c">
          <div v-for="(day, i) in days" :key="i" class="single-day medium">
            <p>{{ day.dateTime._i | dayFormatter }}</p>
            <span class="medium">{{ ((day.temperatureMax - 32) * 0.5556).toFixed(0) + '°C' }}</span>
            <span>/</span>
            <span class="medium">{{ ((day.temperatureMin - 32) * 0.5556).toFixed(0) + '°C' }}</span>
          </div>
        </div>
      </div>
    </div>
    <v-btn class="primary" :to="{ name: 'places', params: { id: city } }">Exlore places near You</v-btn>
  </div>
  <gmap-map
    v-if="!loading"
    :options="{scrollwheel: false}"
    :center="{lat: latitude, lng: longitude }"
    :zoom="14"
    style="width: 100%; height: 300px">
      <gmap-marker
        v-bind:position="{lat: latitude, lng: longitude}"></gmap-marker>
  </gmap-map>
</div>
  
</template>

<script>

import DarkSkyApi from 'dark-sky-api'
import axios from 'axios'
import moment from 'moment'
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
      temp: '',
      currTime: '',
      days: [],
      loading: true
    }
  },
  mounted() {
    this.getCurrent()
    this.getForecast()
  },
  methods: {
    getCurrent() {
      DarkSkyApi.loadCurrent() 
        .then(result => {
        // console.log(result)
        this.temp = result.temperature
        this.currTime = result.time
        console.log(result)
      })
    },
    getForecast() {
      DarkSkyApi.loadForecast()
      .then(result => {
        this.latitude = result.latitude
        this.longitude = result.longitude
        this.icon = result.daily.icon
        this.days = result.daily.data
        axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${result.latitude},${result.longitude}&key=${apiKey}`)
        .then(response => {
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
    },
    placesNearby() {
      this.$router.push('/places')
    }
  },
  filters: {
    moment() {
      return moment().format("HH:mm");
    },
    dayFormatter(value) {
      return moment(value).format('dddd');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.primary {
  background-color: #2196f3;
}
.fas {
  font-family: FontAwesome;
  font-size: 50px;
  text-align: left;
  font-style: initial;
}
.space {
  padding: 50px 0;
}
.large {
  font-size: 70px;
  margin: 20px;
}
.medium {
  font-size: 35px;
}

/**
 * Helper classes
 */
 
.progress-circular {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.main-app {
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  .main {
    padding: 50px 0;
    .wrapper {
      display: block;
      .box {
        &.c {
          display: flex;
          justify-content: space-around;
          .single-day {
            padding: 30px 0;
          }
        }
      }
    }
    @media screen {
      .main {
        padding: 55px;
      }
      .wrapper {
        .box {
          background-color: rgba(255, 255, 255, 0.6);
          &.c {
            display: block;
          }
        }
      }
    }
    @media screen and (min-width: 760px) {
      .wrapper {
      display: grid;
      grid-column-gap: 10px;
      grid-row-gap: 10px;
      padding: 0 20px;
      .box {
        background-color: rgba(255, 255, 255, 0.6);
        color: #000000;
        border-radius: 5px;
        padding: 20px;
        font-size: 150%;
        &.a {
          grid-column: 1 / 3;
          grid-row: 1;
        }
        &.b {
          grid-column: 3 ;
          grid-row: 1 / 3;
        }
        &.c {
          display: flex;
          justify-content: space-around;
          grid-column: 1 / 3;
          grid-row: 2 ;
          p {
            font-size: 16px;
          }
        }
      }
    }
    } 
  }
}
</style>
