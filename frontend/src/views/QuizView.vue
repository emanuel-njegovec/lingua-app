<template>
    <TheHeader />
    <div class="container2">
        <div v-if="quiz">
            <div class="input-form">
                <InputText v-model="quizData.quiz_name" placeholder="Enter the name of the quiz" @input="handleInputChange" />
                <Textarea v-model="quizData.description" placeholder="Enter the description of the quiz" @input="handleInputChange" />
            </div>
            <ul>
                <QuestionListItem v-for="question in quiz" :key="question.question_id" :question="question"></QuestionListItem>
            </ul>
        </div>
        <Button icon="pi pi-plus" @click="visible = true"></Button>
        <Dialog v-model:visible="visible" modal header="Odaberi vrstu pitanja">
            <Button label="Ponuđeni odgovori"></Button>
            <Button label="Upisivanje odgovora"></Button>
            <Button label="Nadopunjavanje"></Button>
        </Dialog>
    </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import TheHeader from '@/components/TheHeader.vue';
import QuestionListItem from '@/components/QuestionListItem.vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const param = route.params.quiz_id;

const visible = ref(false);

const quiz = ref({});
const quizData = ref({
    quiz_name: '',
    description: ''
});



onMounted(async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/quiz/${param}`, { withCredentials: true });
        //console.log('there', response.data);
        quiz.value = response.data;
        quizData.value.quiz_name = quiz.value[0].quiz_name;
        quizData.value.description = quiz.value[0].description;
    } catch (error) {
        console.error(error);
    }
});

let saveTimeout;

const handleInputChange = () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    
    }
    saveTimeout = setTimeout(async () => {
        try {
            console.log(quizData.value);
            await axios.put(`http://localhost:3000/api/update-quiz/${param}`, quizData.value, { withCredentials: true });
        } catch (error) {
            console.error(error);
        }
    }, 1000);
}




</script>

<style scoped>
.container2 {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
}

.input-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 10px;
}

ul {
    all: unset;
}

</style>