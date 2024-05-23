<template>
    <div class="container">
        <Dropdown v-model="selectedLanguage" :options="languages" optionLabel="name" placeholder="Select a language" />
    </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown';
import { ref } from 'vue';

const selectedLanguage = ref({ name: 'English', code: 'en' });
const languages = ref([
    { name: 'English', code: 'en' },
    { name: 'Korean', code: 'kr' },
]);


</script>

<style scoped>

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1D3557;
    border-bottom: 1px solid #e9ecef;
    height: 60px;
}
</style>