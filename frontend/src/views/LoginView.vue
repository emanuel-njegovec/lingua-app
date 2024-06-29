<template>
    <div class="container">
        <Card>
            <template #title>
                <h1>LINGUA</h1>
                <h4>Aplikacija za učenje stranih jezika</h4>
            </template>
            <template #content>
                <p>Kliknite na donji gumb za prijavu preko Google-a</p>
                <Button label="Login with Google" icon="pi pi-google" iconPos="left" @click="googleLogin" />
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { API_URL } from '@/config';

const googleLogin = () => {
    window.open(`${API_URL}/auth/google`, '_self');
}

</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
h1 {
    font-family: "Playwrite GB S";
    font-weight: 800;
    color: #655fed;
}

</style>