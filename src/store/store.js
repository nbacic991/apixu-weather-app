import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
      loading: true
    },
    mutations: {
      setLoading (state, payload) {
        state.loading = payload
      },
    },
    actions: {
      finishLoading({commit}) {
        commit('setLoading', false)
      },
      currentWeatherLoad({commit}) {
        
      }
    },
    getters: {
      loading (state) {
        return state.loading
      },
    }
})