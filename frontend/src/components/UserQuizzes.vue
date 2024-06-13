<template>
    <div class="container">
        <Button label="Upravljanje kvizovima" @click="manageQuizzes" v-if="userRole === 'admin'"/>
        <Card class="data-card">
            <template #content>
                <DataView :value="quizzes" :sortOrder="sortOrder" :sortField="sortField">
                    <template #header>
                        <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" @change="onSortChange($event)" placeholder="Sortiranje" />
                    </template>
                    <template #list="slotProps">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <QuizListItem class="quiz-list-item" :quiz="item"></QuizListItem>
                        </div>
                    </template>
                </DataView>
            </template>            
        </Card>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
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
    } catch (error) {
        console.error(error);
    }
});

const sortKey = ref();
const sortOrder = ref();
const sortField = ref();
const sortOptions = ref([
    { label: 'po ocjeni - silazno', value: { field: 'average_rating', order: 1 } },
    { label: 'po ocjeni - uzlazno', value: { field: 'average_rating', order: -1 } },
    { label: 'po težini - silazno', value: { field: 'difficulty', order: 1 } },
    { label: 'po težini - uzlazno', value: { field: 'difficulty', order: -1 } },
    { label: 'po datumu stvaranja - silazno', value: { field: 'created_at', order: 1 } },
    { label: 'po datumu stvaranja - uzlazno', value: { field: 'created_at', order: -1 } }
]);

const onSortChange = (event) => {
    const { field, order } = event.value;
    const sortedQuizzes = [...quizzes.value].sort((a, b) => {
        if (order === 1) {
            return a[field] > b[field] ? 1 : -1;
        } else {
            return a[field] < b[field] ? 1 : -1;
        }
    });
    quizzes.value = sortedQuizzes;  // Replace the array reference
};
</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}
.data-card {
    margin-top: 10px;
    margin-bottom: 50px;
}
.quiz-list-item {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>
