<template>
    <div class="container">
        <Button label="Login with Google" icon="pi pi-check" iconPos="right" v-on:click="googleLogin" />
    </div>
</template>

<script>
import Button from 'primevue/button';

export default {
  name: 'LoginView',
  components: {
    Button
  },
  methods: {
    googleLogin() {
      window.open('http://localhost:3000/auth/google', '_self');
    }
  }
}
</script>