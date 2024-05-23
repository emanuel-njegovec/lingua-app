<template>
    <div class="container">
        <Button class="quit-button" aria-label="Quit" @click="quitQuiz" severity="danger">Quit</Button>
        <Carousel :value="quiz" v-if="quiz[0] && quiz[0].question_id" :page="currentPage" >
            <template #item="question">
                <QuizPlayCard class="question-card" :question="question.data">
                </QuizPlayCard>
            </template>
        </Carousel>
        <Button aria-label="Prev" @click="currentPage--" v-if="currentPage > 0">Prev</Button>
        <Button aria-label="Next" @click="currentPage++" v-if="currentPage < quiz.length-1">Next</Button>
    </div>
</template>

<script setup>
import Carousel from 'primevue/carousel';
import QuizPlayCard from '../components/QuizPlayCard.vue';
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import { API_URL } from '@/config';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const param = route.params.quiz_id;

const quiz = ref({});
const currentPage = ref(0);

const quitQuiz = () => {
    router.go(-1);
}

onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/api/quiz/${param}`, { withCredentials: true });
        //console.log('there', response.data);
        quiz.value = response.data;
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