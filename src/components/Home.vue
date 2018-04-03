<template>
<div>
  <v-progress-circular 
    indeterminate
    color="primary--text"
    :width="7"
    :size="70"
    v-if="loading">
  </v-progress-circular>
  <div v-if="!loading" class="main-app" v-bind:style="{ 'background-image': 'url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=12000&photoreference=' + image + '&key=AIzaSyCYwUml9eACiBtWu_24pVk07h-zzOrJghc)' }">
    <div class='main'>
      <div class="wrapper">
        <div class="box a space">
          <h3 class="medium">{{ city }}</h3>
          <br>
          <p>Current time: {{ currTime | moment }}</p>
          <span :class="icon"></span>
          <p>{{ summary }}</p>
          <p class="large">
            <i class="fas fa-thermometer-quarter large"></i>
            <span>{{((temp - 32) * 0.5556).toFixed(0) + '°C'}}</span>
          </p>
          <div class="temp">
            <div class="left">
              <div class="left">
                <p>MAX TEMP</p>
                <i class="red--text fas fa-thermometer-three-quarters"></i>
                <span class="medium">{{ ((days[0].temperatureMax - 32) * .5556).toFixed(0) + '°C' }}</span>
              </div>
              <div class="right">
                <p>MIN TEMP</p>
                <i class="blue--text fas fa-thermometer-quarter"></i>
                <span class="medium">{{ ((days[0].temperatureMin - 32) * .5556).toFixed(0) + '°C' }}</span>
              </div>
            </div>
            <div class="right">
              <p>Wind Direction:</p>
              <span :class="wind"></span>
            </div>
          </div>
        </div>
        <div class="box c">
          <div v-for="(day, i) in days" :key="i" class="single-day">
            <p class="day">{{ day.dateTime._i | dayFormatter }}</p>
            <p class="date">{{ day.dateTime._i | dateFormatter }}</p>
            <span>{{ ((day.temperatureMax - 32) * 0.5556).toFixed(0) + '°C' }}</span>
            <span>/</span>
            <span>{{ ((day.temperatureMin - 32) * 0.5556).toFixed(0) + '°C' }}</span>
          </div>
        </div>
      </div>
    </div>
    <v-btn class="info primary--text" :to="{ name: 'places', params: { id: city } }">Exlore places near You</v-btn>
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
      wind: '',
      summary: '',
      days: []
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
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
        this.temp = result.temperature
        this.currTime = result.time
        this.icon = result.icon
        this.wind = result.windDirection
        this.summary = result.summary
        console.log(result)
      })
    },
    getForecast() {
      DarkSkyApi.loadForecast()
      .then(result => {
        this.latitude = result.latitude
        this.longitude = result.longitude
        this.days = result.daily.data
        console.log(result)
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
                this.$store.dispatch('finishLoading', false)
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
    },
    dateFormatter(value) {
      return moment(value).format('MMMM Do');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.left,
.right {
  width: 45%;
}
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
  margin-bottom: 20px;
}
.large {
  font-size: 70px;
  margin: 20px;
}
.medium {
  font-size: 35px;
}
/**
 * Weather icons
 **/
.clear-day {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/mXDQPc/34.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.clear-night {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/eJiWxx/31.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.rain {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/dPd9jc/12.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.snow {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/bFnfqH/14.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.sleet {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/djxAPc/5.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.wind {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/hxfYAH/23.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.fog {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/j75dcx/19.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.cloudy {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/nB2APc/26.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.partly-cloudy-day {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/jChPHx/30.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.partly-cloudy-night {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/jaWZHx/33.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}

/**
 * Wind directions
 */
.N {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/fW6bxx/wind_dart_white_1.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.E {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/hR4kqH/wind_dart_white_2.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.S {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/mSZUHx/wind_dart_white_3.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.W {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/cqdZjc/wind_dart_white_4.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.NE {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/jAEkqH/wind_dart_white_5.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.SE {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/g6pwxx/wind_dart_white_6.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.SW {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/k7PJAH/wind_dart_white_7.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
}
.NW {
  height: 123px;
  display: flex;
  background: url('https://image.ibb.co/gPQfPc/wind_dart_white_8.png');
  background-repeat: no-repeat;
  background-position-x: 50%;
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
      display: grid;
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
        &.c {
          display: grid;
          grid-column: 1 / 3;
          grid-row: 2;
          grid-template-rows: 2;
          grid-template-columns: repeat(4, 1fr);
          grid-column-gap: 15px;
          .single-day {
            padding: 20px 10px;
            border-bottom: 2px solid gray;
            &:last-child,
            &:nth-child(4) {
              border-right: none;
            }
            img {
              max-width: 20px;
              width: 100%;
              height: 20px;
            }
            .day,
            .date {
              text-transform: capitalize;
            }
          }
        }
      }
      @media screen and (max-width: 650px) {
        .temp > .left,
        .temp > .right {
          overflow: hidden;
          clear: both;
          float: none !important;
          width: 100%;
          margin-bottom: 30px;
        }
      }
      @media screen and (max-width: 992px) {
        .box.c {
          display: block;
        }
      }
    }
  }
}
</style>
