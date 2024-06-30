<template>
    <Card class="header-style">
        <template #content>
            <div class="header-content">
                <h2 v-if="user.user_role === 'admin'">{{ user.username }} [{{ user.user_role }}]</h2>
                <h2 v-else>{{ user.username }}</h2>
                <div class="btns">
                    <Dropdown v-model="selectedLanguage" :options="languages" optionLabel="name" placeholder="Select a language" @update:modelValue="languageChanged"/>
                    <Button :icon="themeIcon" @click="toggleTheme" />
                    <Button label="Odjavi se" @click="logout" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

import Card from 'primevue/card';
import { ref, watch, onMounted } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useLanguageStore, useUserStore } from '@/store';
import { API_URL } from '@/config';

const primevue = usePrimeVue();
const languageStore = useLanguageStore();
const user = useUserStore();

let currentLanguage = {};
if (languageStore.language === 'en') {
    currentLanguage = { name: 'Engleski', code: 'en' };
} else {
    currentLanguage = { name: 'Korejski', code: 'kr' };
}

const selectedLanguage = ref(currentLanguage);
const languages = ref([
    { name: 'Engleski', code: 'en' },
    { name: 'Korejski', code: 'kr' },
]);

const languageChanged = (e) => {
    languageStore.setLanguage(e.code);
    //console.log(languageStore.language);
};

const savedTheme = localStorage.getItem('theme') || 'lara-light-indigo';
const currentTheme = ref(savedTheme);
const themeIcon = ref(savedTheme === 'lara-light-indigo' ? 'pi pi-moon' : 'pi pi-sun');

const toggleTheme = () => {
    const nextTheme = currentTheme.value === 'lara-light-indigo' ? 'lara-dark-indigo' : 'lara-light-indigo';
    const nextIcon = nextTheme === 'lara-dark-indigo' ? 'pi pi-sun' : 'pi pi-moon';

    primevue.changeTheme(currentTheme.value, nextTheme, 'id-to-link', () => {
        // Update the current theme and icon
        currentTheme.value = nextTheme;
        themeIcon.value = nextIcon;
        // Save the selected theme to localStorage
        localStorage.setItem('theme', nextTheme);
    });
}

const logout = () => {
    user.username = null;
    user.userID = null;
    window.location.href = `${API_URL}/auth/logout`;
};

watch(selectedLanguage, () => {
    window.location.reload();
});

onMounted(() => {
    if (currentTheme.value !== 'lara-light-indigo') {
        primevue.changeTheme('lara-light-indigo', currentTheme.value, 'id-to-link', () => {});
    }
});

</script>

<style scoped>
.header-style {
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
}

.btns {
    display: flex;
    gap: 30px;
}
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95vw;
}
:deep(.p-card-body) {
    padding: 0;
}

@media (max-width: 768px) {
    .header-content h2 {
        font-size: 18px;
    }
    .btns {
        gap: 10px;
    }
}
</style>