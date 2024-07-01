<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <div class="card-content">
                    <Image :src="question.image_url" width="400"></Image>
                    <h2>{{ question.question_text }}</h2>
                    <div class="answer-component">
                        <InputText v-model="answer" :disabled="isDisabled" @keyup.enter="checkAnswer"></InputText>
                        <Button @click="checkAnswer" :disabled="isDisabled" label="Provjeri"></Button>
                    </div>
                    <div class="correct-answer">
                        <Button v-if="!showAnswer" @click="showAnswer = true" label="Točan odgovor"></Button>
                        <h3 v-if="showAnswer">{{ correct_answer }}</h3>
                    </div>
                    <transition-group name="p-message" tag="div">
                        <Message v-if="isDisabled" :severity="message.severity" :closable="false">{{ message.summary }}</Message>
                    </transition-group>
                    <ProgressSpinner v-if="isLoading" style="width: 50px; height: 50px; margin-top: 30px;" stroke-width="7"/>
                </div>
            </template>    
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { ref, defineProps, defineEmits } from 'vue';
import { useLanguageStore } from '@/store';
import Image from 'primevue/image';
import { API_URL } from '@/config';
import axios from 'axios';

const isDisabled = ref(false);
const isLoading = ref(false);
const message = ref({});
const showAnswer = ref(false);

const languageStore = useLanguageStore();

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const emit = defineEmits(['question-correct, question-incorrect']);

const answer = ref('');
const correct_answer = ref(props.question.correct_ans);
const question_text = ref(props.question.question_text);

const checkAnswer = async () => {
    try {
        isLoading.value = true;
        console.log(languageStore.language);
        const response = await axios.post(`${API_URL}/question/check-answer-write-in/${languageStore.language}`, {
            question_text: question_text.value,
            user_answer: answer.value,
            correct_answer: correct_answer.value,
        }, { withCredentials: true });
        console.log(response.data);
        if (response.data.result === 'correct') {
            message.value = {
                severity: 'success',
                summary: 'Točan odgovor!',
                detail: response.data.explanation
            };
            emit('question-correct');
        } else {
            message.value = {
                severity: 'error',
                summary: `Netočan odgovor! ${response.data.explanation}`,
                detail: response.data.explanation
            };
            emit('question-incorrect');
        }
        isDisabled.value = true;
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

</script>

<style scoped>
:deep(.p-card) {
    margin-left: 10px;
    margin-right: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 20px;
    margin-left: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.container {
    height: 50vh;
}
.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.correct-answer {
margin-top: 20px;
}
</style>