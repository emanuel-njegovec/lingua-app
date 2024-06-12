<template>
    <div class="container">
        <TheHeader></TheHeader>
        <div class="content">
            <div v-if="quiz">
                <Card class="editing-card">
                    <template #content>
                        <div class="edit-form">
                            <label for="quiz_name"><h2>Ime kviza</h2></label>
                            <InputText id="quiz_name" v-model="quizData.quiz_name" placeholder="Enter the name of the quiz" @input="handleInputChange" />
                            <label for="description"><h2>Opis kviza</h2></label>
                            <Textarea id="description" v-model="quizData.description" placeholder="Enter the description of the quiz" @input="handleInputChange" />
                            <label for="difficulty"><h2>Difficulty: {{ quizData.difficulty }}</h2></label>
                            <Slider id="difficulty" v-model="quizData.difficulty" :min="1" :max="5" @change="handleInputChange" />
                        </div>
                    </template>
                </Card>
                <h1>Pitanja</h1>
                <ul v-if="quizData">
                    <QuestionListItem v-for="question in multipleChoice" :key="'multipleChoice-' + question.question_id" :question="question" @remove_question="removeItem('multipleChoice', question)"></QuestionListItem>
                    <QuestionListItem v-for="question in writeIn" :key="'writeIn-' + question.question_id" :question="question" @remove_question="removeItem('writeIn', question)"></QuestionListItem>
                    <QuestionListItem v-for="question in fillIn" :key="'fillIn-' + question.question_id" :question="question" @remove_question="removeItem('fillIn', question)"></QuestionListItem>
                </ul>
            </div>
            <Card class="quiz-edit-buttons">
                <template #content>
                    <Button label="Dodaj pitanje" @click="visible = true"></Button>
                    <Button label="Spremi" @click="saveQuiz"></Button>
                </template>
            </Card>
            <Dialog v-model:visible="visible" modal header="Odaberi vrstu pitanja">
                <Button label="Ponuđeni odgovori" @click="newQuestion('multiple_choice')"></Button>
                <Button label="Upisivanje odgovora" @click="newQuestion('write_in')"></Button>
                <Button label="Nadopunjavanje" @click="newQuestion('fill_in')"></Button>
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import TheHeader from '@/components/TheHeader.vue';
import Slider from 'primevue/slider';
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
    description: '',
    difficulty: 1
});
const multipleChoice = ref({});
const writeIn = ref({});
const fillIn = ref({});

const newQuestion = async (q_type) => {
    try {
        // eslint-disable-next-line
        const response = await axios.post(`${API_URL}/question`, { param, q_type }, { withCredentials: true });
        console.log('question_id', response.data);
        const question_id = response.data[0].question_id;
        
        router.push(`/manage-quizzes/${param}/question/${question_id}`);
    } catch (error) {
        console.error(error);
    }
}

const saveQuiz = async () => {
    router.go(-1)
}

const removeItem = (type, item) => {
    const index = type === 'multipleChoice' ? multipleChoice.value.indexOf(item) :
                type === 'writeIn' ? writeIn.value.indexOf(item) :
                fillIn.value.indexOf(item);
    if (index !== -1) {
        if (type === 'multipleChoice') {
            multipleChoice.value.splice(index, 1);
        } else if (type === 'writeIn') {
            writeIn.value.splice(index, 1);
        } else {
            fillIn.value.splice(index, 1);
        }
    }
};


onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/quiz/${param}`, { withCredentials: true });
        //console.log('there', response.data);
        quiz.value = response.data;
        console.log(quiz.value);
        multipleChoice.value = quiz.value.multiple_choice;
        writeIn.value = quiz.value.write_in;
        fillIn.value = quiz.value.fill_in;
        quizData.value.quiz_name = quiz.value.quiz_name;
        quizData.value.description = quiz.value.quiz_description;
        quizData.value.difficulty = quiz.value.difficulty;
        console.log(quizData.value);
        console.log(multipleChoice.value)
        console.log(writeIn.value);
        console.log(fillIn.value);
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
            await axios.put(`${API_URL}/quiz/${param}`, quizData.value, { withCredentials: true });
        } catch (error) {
            console.error(error);
        }
    }, 1000);
}
</script>

<style scoped>
.content {
    width: 100%;
    margin-bottom: 200px;
}

:deep(.editing-card) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 10px;
}
.edit-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}
ul {
    all: unset;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.p-slider {
    width: 50%;
}
:deep(.quiz-edit-buttons) {
    position: fixed;
    bottom: 0px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
    box-shadow: 0px -2px 10px 0px rgba(0,0,0,0.1);
}
#quiz_name {
    width: 80%;
}
#description {
    width: 80%;
}
@media (min-width: 768px) {
    :deep(.editing-card) {
        width: 800px;
    }
}
</style>