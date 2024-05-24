<template>
    <div class="container">
        <Card v-if="question">
            <template #content>
                <Image :src="question.image_url" width="400"></Image>
                <h2>{{ question.question_text }}</h2>
                <InputText id="ans-text" v-model="answer"></InputText>
                <Button @click="checkAnswer">Check</Button>
            </template>    
        </Card>
    </div>
</template>

<script setup>
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref, defineProps } from 'vue';
import Image from 'primevue/image';

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const answer = ref('');

const checkAnswer = () => {
    if (answer.value === props.question.correct_ans) {
        console.log('Correct');
    } else {
        console.log('Incorrect');
    }
};

</script>

<style scoped>
.p-card {
    background-color: #1D3557;
    color: aliceblue;
    margin-left: 10px;
    margin-right: 10px;
    height: 100%;
}
.container {
    height: 50vh;
}

</style>