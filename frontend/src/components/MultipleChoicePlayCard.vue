<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <div class="card-content">
                    <Image :src="question.image_url" width="400"></Image>
                    <h2>{{ question.question_text }}</h2>
                    <div class="buttons-container">
                        <Button
                            v-for="(answer, index) in shuffledAnswers"
                            :key="index"
                            @click="checkAnswer(index)"
                            :disabled="selectedButton !== null && selectedButton !== index"
                            :class="{ 'highlighted': selectedButton === index }"
                        >
                        {{ answer }}
                        </Button>
                    </div>
                    <transition-group name="p-message" tag="div">
                        <Message v-if="showMessage" :severity="message.severity" :closable="false">{{ message.summary }}</Message>
                    </transition-group>
                </div>
            </template>    
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { ref, defineProps, computed, defineEmits } from 'vue';
import Image from 'primevue/image';

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const emit = defineEmits(['question-correct, question-incorrect']);

const selectedButton = ref(null);
const showMessage = ref(false);
const message = ref({});

const shuffledAnswers = computed(() =>{
    if (props.question) {
        const answers = [props.question.correct_ans,
                        props.question.incorrect_ans_1,
                        props.question.incorrect_ans_2,
                        props.question.incorrect_ans_3];
        return shuffleArray(answers);
    }
    return [];
});

const checkAnswer = (index) => {
    console.log(shuffledAnswers.value[index]);
    if (shuffledAnswers.value[index] === props.question.correct_ans) {
        console.log('Correct');
        message.value = {
            severity: 'success',
            summary: 'Točan odgovor!',
            detail: 'Točan odgovor!'
        };
        emit('question-correct');
    } else {
        console.log('Incorrect');
        message.value = {
            severity: 'error',
            summary: 'Netočan odgovor',
            detail: 'Netočan odgovor'
        };
        emit('question-incorrect');
    }
    selectedButton.value = index;
    showMessage.value = true;
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
.buttons-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
}
.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.highlighted {
    background-color: #4f46e5;
}

</style>