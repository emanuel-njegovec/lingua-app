<template>
    <h1>Korisnički profil</h1>
    <div>{{ user.username }}</div>
    <Button label="Odjavi se" @click="logout" />
</template>

<script setup>
import { useUserStore } from '@/store';
import Button from 'primevue/button';
//import axios from 'axios';
import { API_URL } from '@/config';

const user = useUserStore();

const logout = () => {
    user.username = null;
    user.userID = null;
    window.location.href = `${API_URL}/auth/logout`;
}

</script>