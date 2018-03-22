<template>  
    <div id="app" class="container">
      <div class="row justify-content-center">
        <div class="col-md-6" v-if="!postStatus">
          <form id="form" method="post" v-on:submit.prevent="validateForm">
            <div class="form-group" v-bind:class="{ 'has-warning': attemptSubmit && missingName }">
              <label class="control-label" for="name">Name</label>
              <input id="name" name="name" class="form-control" type="text" v-model="name">
              <span id="helpBlock" class="help-block" v-if="attemptSubmit && missingName">This field is required.</span>
            </div>
            
            <div class="form-group" v-bind:class="{ 'has-warning': attemptSubmit && wrongNumber }">
              <label class="control-label" for="number">Enter a number between 1 and 10</label>
              <input id="number" name="number" class="form-control" type="text" v-model="number">
              <span id="helpBlock" class="help-block" v-if="attemptSubmit && wrongNumber">Make sure this is a number between 1 and 10.</span>
            </div>

             <div class="form-group" v-bind:class="{ 'has-warning': attemptSubmit && missingEmail }">
              <label class="control-label" for="name">Email</label>
              <input id="email" name="email" class="form-control" type="text" v-model="email">
              <span id="helpBlock" class="help-block" v-if="attemptSubmit && missingEmail">Email is invalid.</span>
            </div>

             <div class="form-group" v-bind:class="{ 'has-warning': attemptSubmit && missingMessage }">
              <label class="control-label" for="message">Enter a Message</label>
              <textarea  name="message" class="form-control" type="text" v-model="message"></textarea>
              <span id="helpBlock" class="help-block" v-if="attemptSubmit && missingMessage">This field is required.</span>
            </div>                 
            
            <button class="btn btn-primary">Submit</button>
          </form>
        </div><!-- /col -->

         <div class="col-md-8" v-if="postStatus">

           <h1>The form is submitted successfully.</h1>

         </div> 
      </div><!-- /row -->

    </div><!-- /container -->
</template>

<script>

import axios from 'axios'
  
  export default {   
    data () {
      return {
        name: '',
        email: '',
        message: '',
        number: '',
        attemptSubmit: false,
        postStatus: false
      }
    },
    computed: {
        missingName: function () { return this.name === '' },
        missingMessage: function () { return this.message === '' },
        missingEmail: function () {
          return (
            this.isEmail(this.email) === null)
        },
        wrongNumber: function () {
          return (
            this.isNumeric(this.number) === false ||
            this.number < 1 ||
            this.number > 10
          )
      },
  },
  methods: {
     isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isEmail: ( str ) => {      
      let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/     
      return str.match(regexp);
    },       
    validateForm: function (event) {
      this.attemptSubmit = true;
      if (this.missingName || this.wrongNumber || this.missingMessage || this.missingEmail) {
          event.preventDefault();
      } else {
         this.onSubmit();
      }       
    },
    onSubmit () {
    
      // if (process.env.NODE_ENV === 'development') {
      //   axios.defaults.baseURL = 'http://localhost:8081/php'
      // }

       axios.post('/php/post.php', {
                'name': this.name,
                'email': this.email,
                'message': this.message,
                'number': this.number               
            }).then(response => {
                if (response.data.error) {
                    console.log('error', response.data.error)
                } else {
                    this.postStatus = true
                    console.log('success', response.data.message)                   
                }
            }).catch(error => {
                console.log(error.response)
            }); 
      }
  }   
}
</script>