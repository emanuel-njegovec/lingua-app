<template>
    <div class="container">
        <Accordion :multiple="true" :activeIndex="[0]">
            <AccordionTab header="Moji kvizovi">
                <div v-if="quizzes">
                    <ul>
                        <QuizListItem v-for="quiz in quizzes" :key="quiz.quiz_id" :quiz="quiz" @remove="removeItem"></QuizListItem>
                    </ul>
                </div>
                <Button icon="pi pi-plus" @click="newQuiz"></Button>
            </AccordionTab>
            <AccordionTab header="Dodani kvizovi">
                <QuizListItem></QuizListItem>
            </AccordionTab>
        </Accordion>
    </div>
</template>


<script setup>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import QuizListItem from '../components/QuizListItem.vue';
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { API_URL } from '@/config';

const quizzes = ref([]);
const isLoading = ref(true);

const router = useRouter();

const newQuiz = async () => {
    try {
        const response = await axios.post(`${API_URL}/quiz`, null, { withCredentials: true });
        const quiz_id = response.data[0].quiz_id;
        router.push('/quiz/' + quiz_id);
    } catch (error) {
        console.error(error);
    }
}

const removeItem = (quizToRemove) => {
    console.log('remove', quizToRemove);
    const index = quizzes.value.findIndex(quiz => quiz.quiz_id === quizToRemove);
    if (index !== -1) {
        quizzes.value.splice(index, 1);
    }
};

onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/quiz/all`, { withCredentials: true });
        //console.log('there', response.data);
        quizzes.value = response.data;
        console.log('there', quizzes.value);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
    // implement getting quizzes which the user has saved/played
    /* try {
        const response = await axios.get('http://localhost:3000/api/played-quizzes', { withCredentials: true });
        //console.log('there', response.data);
        quizzes.value = response.data;
        console.log('there', quizzes.value);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    } */
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