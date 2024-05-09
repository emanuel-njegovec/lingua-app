<template>
    <div class="container">
        <FloatLabel>
            <InputText id="qtext" v-model="questionData.question_text" @input="handleInputChange" />
            <label for="qtext">Pitanje</label>
        </FloatLabel>
        <FloatLabel>
            <InputText id="correct-ans" v-model="questionData.correct_ans" @input="handleInputChange" />
            <label for="correct-ans">Točan odgovor</label>
        </FloatLabel>
        <FloatLabel>
            <InputText id="incorrect-ans1" v-model="questionData.incorrect_ans_1" @input="handleInputChange" />
            <label for="incorrect-ans1">Netočan odgovor 1</label>
        </FloatLabel>
        <FloatLabel>
            <InputText id="incorrect-ans2" v-model="questionData.incorrect_ans_2" @input="handleInputChange" />
            <label for="incorrect-ans2">Netočan odgovor 2</label>
        </FloatLabel>
        <FloatLabel>
            <InputText id="incorrect-ans3" v-model="questionData.incorrect_ans_3" @input="handleInputChange" />
            <label for="incorrect-ans3">Netočan odgovor 3</label>
        </FloatLabel>        
    </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const param = route.params.quiz_id;

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const questionData = ref({
    question_text: '',
    correct_ans: '',
    incorrect_ans_1: '',
    incorrect_ans_2: '',
    incorrect_ans_3: '',
    q_type: ''
});

onMounted(() => {
    questionData.value.question_text = props.question[0].question_text;
    questionData.value.correct_ans = props.question[0].correct_ans;
    questionData.value.incorrect_ans_1 = props.question[0].incorrect_ans_1;
    questionData.value.incorrect_ans_2 = props.question[0].incorrect_ans_2;
    questionData.value.incorrect_ans_3 = props.question[0].incorrect_ans_3;
    questionData.value.q_type = props.question[0].q_type;
})

let saveTimeout;

const handleInputChange = () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    
    }
    saveTimeout = setTimeout(async () => {
        try {
            console.log(questionData.value);
            await axios.put(`http://localhost:3000/api/update-question/${param}`, questionData.value, { withCredentials: true });
        } catch (error) {
            console.error(error);
        }
    }, 1000);
}

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

</style>