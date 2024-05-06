<template>
    <h1>Korisnički profil</h1>
    <div>{{ user.userData }}</div>
    <Button label="Odjavi se" @click="logout" />
</template>

<script setup>
import { useUserStore } from '@/store';
import Button from 'primevue/button';
//import axios from 'axios';

const user = useUserStore();

const logout = () => {
    user.userData = null;
    window.location.href = 'http://localhost:3000/auth/logout';
}

</script>