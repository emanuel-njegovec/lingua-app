<template>
    <div class="container">
        <Button label="Login with Google" icon="pi pi-check" iconPos="right" @click="googleLogin" />
    </div>
</template>

<script setup>
import Button from 'primevue/button';

const googleLogin = () => {
    window.open('http://localhost:3000/auth/google', '_self');
}

</script>