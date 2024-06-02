<template>
    <div class="container">
        <Button label="Manage quizzes" @click="manageQuizzes" v-if="userRole === 'admin'"/>
        <DataView :value="quizzes" :sortOrder="sortOrder" :sortField="sortField">
            <template #header>
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" @change="onSortChange($event)" placeholder="Sort by rating" />
            </template>
            <template #list="slotProps">
                <div v-for="(item, index) in slotProps.items" :key="index">
                    <QuizListItem :quiz="item"></QuizListItem>
                </div>
            </template>
        </DataView>
    </div>
</template>


<script setup>
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import QuizListItem from '../components/QuizListItem.vue';
import { useUserStore } from '../store';
import { useLanguageStore } from '../store';
import { useRouter } from 'vue-router';
import { API_URL } from '@/config';

const quizzes = ref([]);

const userStore = useUserStore();
const userRole = userStore.user_role;

const router = useRouter();

const manageQuizzes = () => {
    router.push('/manage-quizzes');
};

const languageStore = useLanguageStore();

onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/quiz/all/${languageStore.language}`, { withCredentials: true });
        quizzes.value = response.data;
        console.log(quizzes.value);
    } catch (error) {
        console.error(error);
    }
});

const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    { label: 'Ascending', value: 1 },
    { label: 'Descending', value: -1 }
]);
const onSortChange = (event) => {
    const value = event.value.value;
    quizzes.value.sort((a, b) => {
        if (value === 1) {
            return a.average_rating - b.average_rating;
        } else {
            return b.average_rating - a.average_rating;
        }
    });
};

</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}
</style>