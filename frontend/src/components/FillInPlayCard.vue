<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <div class="card-content">
                    <Image class="img" :src="question.image_url" width="400"></Image>
                    <h2>
                        <span v-for="(word, index) in text_split" :key="index">
                            <InputText v-if="word === correct_answer" :disabled="isDisabled" v-model="answer" @keyup.enter="checkAnswer"/>
                            <span v-else>{{ word }}</span>
                            <span v-if="index < text_split.length - 1">&nbsp;</span>
                        </span>
                    </h2>
                    <p v-if="hint">Pomoć: {{ hint }}</p>
                    <Button @click="checkAnswer" :disabled="isDisabled" label="Provjeri"></Button>
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
import axios from 'axios';
import { API_URL } from '@/config';
import Image from 'primevue/image';

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const message = ref({});
const isDisabled = ref(false);
const isLoading = ref(false);

// eslint-disable-next-line
const emit = defineEmits(['question-correct, question-incorrect']);

const text_split = props.question.question_text.split(' ');
const correct_answer = ref(props.question.correct_ans);
const hint = ref(props.question.ans_hint);
const answer = ref('');

const checkAnswer = async () => {
    try {
        isLoading.value = true;
        const response = await axios.post(`${API_URL}/question/check-answer/en`, {
            user_answer: answer.value,
            correct_answer: correct_answer.value,
            question: props.question.question_text
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
@media (max-width: 768px) {
    :deep(img) {
        width: 300px;
    }
    :deep(.p-inputtext) {
        width: 100px;
    }
}
</style>