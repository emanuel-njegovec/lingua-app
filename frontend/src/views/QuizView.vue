<template>
    <TheHeader />
    <div class="container2">
        <div v-if="quiz">
            <div class="input-form">
                <InputText v-model="quizData.quiz_name" placeholder="Enter the name of the quiz" @input="handleInputChange" />
                <Textarea v-model="quizData.description" placeholder="Enter the description of the quiz" @input="handleInputChange" />
            </div>
            <ul v-if="quiz[0] && quiz[0].question_id">
                <QuestionListItem v-for="question in quiz" :key="question.question_id" :question="question" @remove_question="removeItem"></QuestionListItem>
            </ul>
        </div>
        <Button icon="pi pi-plus" @click="visible = true"></Button>
        <Dialog v-model:visible="visible" modal header="Odaberi vrstu pitanja">
            <Button label="Ponuđeni odgovori" @click="newQuestion('multiple_choice')"></Button>
            <Button label="Upisivanje odgovora" @click="newQuestion('write_in')"></Button>
            <Button label="Nadopunjavanje" @click="newQuestion('fill_in')"></Button>
        </Dialog>
        <Button icon="pi pi-save" @click="saveQuiz"></Button>
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
import { useRoute, useRouter } from 'vue-router';
import { API_URL } from '@/config';

const router = useRouter();
const route = useRoute();
const param = route.params.quiz_id;

const visible = ref(false);

const quiz = ref({});
const quizData = ref({
    quiz_name: '',
    description: ''
});

const newQuestion = async (q_type) => {
    try {
        // eslint-disable-next-line
        const response = await axios.post(`${API_URL}/api/question`, { param, q_type }, { withCredentials: true });
        console.log('question_id', response.data);
        const question_id = response.data[0].question_id;
        
        router.push(`/quiz/${param}/question/${question_id}`);
    } catch (error) {
        console.error(error);
    }
}

const saveQuiz = async () => {
    router.push('/home');
}

const removeItem = (questionToRemove) => {
    console.log('remove', questionToRemove);
    const index = quiz.value.findIndex(question => question.question_id === questionToRemove);
    if (index !== -1) {
        quiz.value.splice(index, 1);
    }
};


onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/api/quiz/${param}`, { withCredentials: true });
        //console.log('there', response.data);
        quiz.value = response.data;
        console.log(quiz.value);
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
            await axios.put(`${API_URL}/api/update-quiz/${param}`, quizData.value, { withCredentials: true });
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