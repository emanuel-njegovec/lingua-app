<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <Image :src="question.image_url" width="400"></Image>
                <h2>{{ question.question_text }}</h2>
                <Button v-for="(answer, index) in shuffledAnswers" :key="index">{{ answer }}</Button>
            </template>    
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { defineProps, computed } from 'vue';
import Image from 'primevue/image';

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

console.log(props.question);

</script>

<style scoped>
.p-card {
    margin-left: 10px;
    margin-right: 10px;
    height: 100%;
}
.container {
    height: 100vh;
}

</style>