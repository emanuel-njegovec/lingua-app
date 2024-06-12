<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <div class="card-content">
                    <Image :src="question.image_url" width="400"></Image>
                    <h2>
                        <span v-for="(word, index) in text_split" :key="index">
                            <InputText v-if="word === correct_answer" :disabled="isDisabled" v-model="answer"/>
                            <span v-else>{{ word }}</span>
                            <span v-if="index < text_split.length - 1">&nbsp;</span>
                        </span>
                    </h2>
                    <Button @click="checkAnswer" :disabled="isDisabled">Check</Button>
                    <transition-group name="p-message" tag="div">
                        <Message v-if="isDisabled" :severity="message.severity" :closable="false">{{ message.summary }}</Message>
                    </transition-group>
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

// eslint-disable-next-line
const emit = defineEmits(['question-correct, question-incorrect']);

const text_split = props.question.question_text.split(' ');
const correct_answer = ref(props.question.correct_ans);
const answer = ref('');

const checkAnswer = async () => {
    try {
        const response = await axios.post(`${API_URL}/question/check-answer`, {
            user_answer: answer.value,
            correct_answer: correct_answer.value
        }, { withCredentials: true });
        console.log(response.data);
        if (response.data.result === 'correct') {
            message.value = {
                severity: 'success',
                summary: 'Correct',
                detail: response.data.explanation
            };
            emit('question-correct');
        } else {
            message.value = {
                severity: 'error',
                summary: 'Incorrect',
                detail: response.data.explanation
            };
            emit('question-incorrect');
        }
        isDisabled.value = true;
    } catch (error) {
        console.error(error);
    }
};


</script>

<style scoped>
.p-card {
    margin-left: 10px;
    margin-right: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.container {
    height: 50vh;
}

</style>