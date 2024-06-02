<template>
    <div class="container">
        <ProfileComponent></ProfileComponent>
        <Accordion :multiple="true">
            <AccordionTab header="Odigrani kvizovi">
                <div v-if="quizzes">
                    <ul>
                        <PlayedQuizListItem v-for="quiz in quizzes" :key="quiz.quiz_id" :quiz="quiz" @remove="removeItem"></PlayedQuizListItem>
                    </ul>
                </div>
            </AccordionTab>
            <AccordionTab header="Statistika">
                <StatisticsComponent></StatisticsComponent>
            </AccordionTab>
        </Accordion>
    </div>
</template>


<script setup>
import PlayedQuizListItem from './PlayedQuizListItem.vue';
import ProfileComponent from './ProfileComponent.vue';
import StatisticsComponent from './StatisticsComponent.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useLanguageStore } from '@/store';
import { API_URL } from '@/config';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

const quizzes = ref([]);
const isLoading = ref(true);

const languageStore = useLanguageStore();

const removeItem = (quizToRemove) => {
    console.log('remove', quizToRemove);
    const index = quizzes.value.findIndex(quiz => quiz.quiz_id === quizToRemove);
    if (index !== -1) {
        quizzes.value.splice(index, 1);
    }
};

onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/quiz/all-played/${languageStore.language}`, { withCredentials: true });
        quizzes.value = response.data;
        console.log('there', quizzes.value);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
});

</script>

<style scoped>
.p-button {
    height: 60px;
    width: 60px;
}
ul {
    all: unset;
    margin: 0;
    padding: 0;
    list-style-type: none;
}
</style>