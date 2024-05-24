<template>
    <div class="container">
        <Button label="Login with Google" icon="pi pi-check" iconPos="right" @click="googleLogin" />
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { API_URL } from '@/config';

const googleLogin = () => {
    window.open(`${API_URL}/auth/google`, '_self');
}

</script>