<template>
    <div class="container">
        <Button class="quit-button" aria-label="Quit" @click="quitQuiz" severity="danger">Quit</Button>
        <Carousel :value="combinedData" v-if="combinedData[0] && combinedData[0].question_id" :page="currentPage" >
            <template #item="question">
                <MultipleChoicePlayCard v-if="question.data.q_type === 'multiple_choice'" class="question-card" :question="question.data">
                </MultipleChoicePlayCard>
                <WriteInPlayCard v-if="question.data.q_type === 'write_in'" class="question-card" :question="question.data">
                </WriteInPlayCard>
                <FillInPlayCard v-if="question.data.q_type === 'fill_in'" class="question-card" :question="question.data">
                </FillInPlayCard>
            </template>
        </Carousel>
        <Button aria-label="Prev" @click="currentPage--" v-if="currentPage > 0">Prev</Button>
        <Button aria-label="Next" @click="currentPage++" v-if="currentPage < combinedData.length-1">Next</Button>
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

const quiz = ref({});
const multipleChoice = ref({});
const writeIn = ref({});
const fillIn = ref({});
const currentPage = ref(0);
const combinedData = ref([]);

const quitQuiz = () => {
    router.go(-1);
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
.quit-button {
    position: absolute;
    top: 10px;
    right: 10px;
}

</style>