<template>
    <div class="container">
        <div class="top-buttons">
            <Button class="quit-button" aria-label="Quit" @click="quitQuiz" severity="danger">Quit</Button>
            <div v-tooltip="{ value: 'Answer all the questions first' }">
                <Button aria-label="Finish" :disabled="answeredQuestions < combinedData.length" @click="finishQuiz">Finish quiz</Button>
            </div>
        </div>
        <Carousel :value="combinedData" v-if="combinedData[0] && combinedData[0].question_id" :page="currentPage" >
            <template #item="question">
                <MultipleChoicePlayCard v-if="question.data.q_type === 'multiple_choice'" class="question-card" :question="question.data" @question-answered="answeredQuestions++">
                </MultipleChoicePlayCard>
                <WriteInPlayCard v-if="question.data.q_type === 'write_in'" class="question-card" :question="question.data" @question-answered="answeredQuestions++">
                </WriteInPlayCard>
                <FillInPlayCard v-if="question.data.q_type === 'fill_in'" class="question-card" :question="question.data" @question-answered="answeredQuestions++">
                </FillInPlayCard>
            </template>
        </Carousel>
        <div class="bottom-buttons">
            <Button aria-label="Prev" @click="currentPage--" :disabled="currentPage == 0">Prev</Button>
            <Button aria-label="Next" @click="currentPage++" :disabled="currentPage == combinedData.length-1">Next</Button>
        </div>
    </div>
</template>

<script setup>
import Carousel from 'primevue/carousel';
import MultipleChoicePlayCard from '../components/MultipleChoicePlayCard.vue';
import WriteInPlayCard from '../components/WriteInPlayCard.vue';
import FillInPlayCard from '../components/FillInPlayCard.vue';
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { API_URL } from '@/config';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const param = route.params.quiz_id;

const answeredQuestions = ref(0);

const quiz = ref({});
const multipleChoice = ref({});
const writeIn = ref({});
const fillIn = ref({});
const currentPage = ref(0);
const combinedData = ref([]);

const quitQuiz = () => {
    router.go(-1);
}

const finishQuiz = () => {
    router.push(`/quiz/${param}/results`);
}

onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/quiz/${param}`, { withCredentials: true });
        //console.log('there', response.data);
        quiz.value = response.data;
        //console.log(quiz.value);
        multipleChoice.value = quiz.value.multiple_choice;
        writeIn.value = quiz.value.write_in;
        fillIn.value = quiz.value.fill_in;
        //quizData.value.quiz_name = quiz.value.quiz_name;
        //quizData.value.description = quiz.value.quiz_description;
        //console.log(quizData.value);
        combinedData.value = [...multipleChoice.value, ...writeIn.value, ...fillIn.value];
        //console.log(combinedData.value);
        //console.log(multipleChoice.value)
        //console.log(writeIn.value);
        //console.log(fillIn.value);
    } catch (error) {
        console.error(error);
    }
});


</script>

<style scoped>
.container {
    margin-top: 30px;
    height: 80vh;
}
::v-deep .p-carousel-prev,
::v-deep .p-carousel-next {
    display: none;
}
.top-buttons {
    display: flex;
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
}
.bottom-buttons {
    display: flex;
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
}

</style>