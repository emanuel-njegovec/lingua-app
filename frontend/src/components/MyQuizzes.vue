<template>
    <div class="container">
        <Accordion :multiple="true" :activeIndex="[0]">
            <AccordionTab header="Moji kvizovi">
                <div v-if="isLoading">
                    <p>Loading...</p>
                </div>
                <div v-else>
                    <ul>
                        <QuizListItem v-for="quiz in quizzes" :key="quiz.quiz_id" :quiz="quiz"></QuizListItem>
                    </ul>
                </div>
                <Button icon="pi pi-plus"></Button>
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

const quizzes = ref([]);
const isLoading = ref(true);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/user-quizzes', { withCredentials: true });
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

</style>