<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <div class="card-content">
                    <Image :src="question.image_url" width="400"></Image>
                    <h2>{{ question.question_text }}</h2>
                    <div class="answer-component">
                        <InputText v-model="answer" :disabled="isDisabled"></InputText>
                        <Button @click="checkAnswer" :disabled="isDisabled">Check</Button>
                    </div>
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
import Image from 'primevue/image';

const isDisabled = ref(false);
const message = ref({});

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const emit = defineEmits(['question-correct, question-incorrect']);

const answer = ref('');

const checkAnswer = () => {
    if (answer.value === props.question.correct_ans) {
        console.log('Correct');
        message.value = {
            severity: 'success',
            summary: 'Correct',
            detail: 'Correct answer'
        };
        emit('question-correct');
    } else {
        console.log('Incorrect');
        message.value = {
            severity: 'error',
            summary: 'Incorrect',
            detail: 'Incorrect answer'
        };
        emit('question-incorrect');
    }
    isDisabled.value = true;
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
.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

</style>