<template>
    <div class="container">
        <div class="top-buttons">
            <Button class="quit-button" label="Odustani" @click="quitQuiz" severity="danger"></Button>
            <Card>
                <template #content>
                    <h2>Odgovorena pitanja: {{ correctAnswers + incorrectAnswers }} / {{ combinedData.length }}</h2>
                </template>
            </Card>
            <div v-tooltip="{ value: 'Odgovorite na sva pitanja' }">
                <Button label="Završi rješavanje" :disabled="correctAnswers + incorrectAnswers < combinedData.length" @click="finishQuiz"></Button>
            </div>
        </div>
        <Carousel
            :value="combinedData"
            v-if="combinedData[0] && combinedData[0].question_id"
            :page="currentPage" >
            <template #item="question">
                <MultipleChoicePlayCard
                    v-if="question.data.q_type === 'multiple_choice'"
                    class="question-card" :question="question.data"
                    @question-correct="correctAnswers++;"
                    @question-incorrect="incorrectAnswers++;">
                </MultipleChoicePlayCard>
                <WriteInPlayCard
                    v-if="question.data.q_type === 'write_in'"
                    class="question-card" :question="question.data"
                    @question-correct="correctAnswers++;"
                    @question-incorrect="incorrectAnswers++;">
                </WriteInPlayCard>
                <FillInPlayCard
                    v-if="question.data.q_type === 'fill_in'"
                    class="question-card" :question="question.data"
                    @question-correct="correctAnswers++;"
                    @question-incorrect="incorrectAnswers++;">
                </FillInPlayCard>
            </template>
        </Carousel>
        <div class="bottom-buttons">
            <Button label="Natrag" @click="currentPage--" :disabled="currentPage == 0"></Button>
            <Button label="Naprijed" @click="currentPage++" :disabled="currentPage == combinedData.length-1"></Button>
        </div>

        <Dialog header="Quiz finished" v-model:visible="isFinished" draggable="false" :closable="false" modal :style="{ width: '350px' }">
            <p>Your result is: {{ correctAnswers }} / {{ (correctAnswers + incorrectAnswers) }} correct answers</p>
            <p>Rate the quiz:</p>
            <Rating v-model="rating" cancel="false" :readonly="false" :stars="5" />
            <div class="dialog-buttons">
                <Button label="OK" @click="goHome" />
                <Button label="Play again"/>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import Carousel from 'primevue/carousel';
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';
import Card from 'primevue/card';
import MultipleChoicePlayCard from '../components/MultipleChoicePlayCard.vue';
import WriteInPlayCard from '../components/WriteInPlayCard.vue';
import FillInPlayCard from '../components/FillInPlayCard.vue';
import Button from 'primevue/button';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { API_URL } from '@/config';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const param = route.params.quiz_id;

const handleArrowKeys = (event) => {
    if (event.key === 'ArrowLeft' && currentPage.value > 0) {
        currentPage.value--;
    } else if (event.key === 'ArrowRight' && currentPage.value < combinedData.value.length - 1) {
        currentPage.value++;
    }
};

const userStore = useUserStore();

const correctAnswers = ref(0);
const incorrectAnswers = ref(0);

const quiz = ref({});
const multipleChoice = ref({});
const writeIn = ref({});
const fillIn = ref({});
const currentPage = ref(0);
const combinedData = ref([]);
const startTime = ref(null);
const isFinished = ref(false);
const rating = ref(null);

const quitQuiz = () => {
    console.log(rating.value);
    router.go(-1);
}

const goHome = () => {
    router.go(-1);
    saveRating();
}

const finishQuiz = async () => {
    const endTime = new Date().toISOString();
    const data = {
        user_id: userStore.userID,
        quiz_id: param,
        correct_answers: correctAnswers.value,
        incorrect_answers: incorrectAnswers.value,
        start_time: startTime.value,
        end_time: endTime
    }
    console.log(data);
    const res = await axios.post(`${API_URL}/stats/save`, data, { withCredentials: true });
    const result_id = res.data[0].result_id;
    console.log(result_id);
    isFinished.value = true;
    saveRating();
}

const saveRating = async () => {
    if (!rating.value) {
        return;
    }
    const data = {
        quiz_id: param,
        rating: rating.value
    }
    console.log(data);
    const res = await axios.post(`${API_URL}/stats/rate-quiz`, data, { withCredentials: true });
    console.log(res);
}

onMounted(async () => {

    document.addEventListener('keydown', handleArrowKeys);

    try {
        const response = await axios.get(`${API_URL}/quiz/${param}`, { withCredentials: true });
        quiz.value = response.data;
        multipleChoice.value = quiz.value.multiple_choice;
        writeIn.value = quiz.value.write_in;
        fillIn.value = quiz.value.fill_in;
        combinedData.value = [...multipleChoice.value, ...writeIn.value, ...fillIn.value];
        startTime.value = new Date().toISOString();
        console.log(startTime.value);
    } catch (error) {
        console.error(error);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleArrowKeys);
});


</script>

<style scoped>
.container {
    margin-top: 30px;
    height: 75vh;
}
::v-deep .p-carousel-prev,
::v-deep .p-carousel-next {
    display: none;
}
:deep(.p-carousel-item) {
    margin-bottom: 30px;
}
.top-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
    height: 50px;
}
.bottom-buttons {
    display: flex;
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
}
.dialog-buttons {
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
}

</style>