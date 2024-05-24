<template>
    <div class="container">
        <Dropdown v-model="selectedLanguage" :options="languages" optionLabel="name" placeholder="Select a language" @update:modelValue="languageChanged"/>
    </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown';
import { ref } from 'vue';
import { useLanguageStore } from '@/store';

const languageStore = useLanguageStore();
let currentLanguage = {};
if (languageStore.language === 'en') {
    currentLanguage = { name: 'English', code: 'en' };
} else {
    currentLanguage = { name: 'Korean', code: 'kr' };
}

const selectedLanguage = ref(currentLanguage);
const languages = ref([
    { name: 'English', code: 'en' },
    { name: 'Korean', code: 'kr' },
]);

const languageChanged = (e) => {
    languageStore.setLanguage(e.code);
    //console.log(languageStore.language);
};


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