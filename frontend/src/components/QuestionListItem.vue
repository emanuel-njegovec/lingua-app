<template>
    <Card v-if="question">
        <template #title>
            {{ question.question_text }}
        </template>
        <template #content>
            <p>{{ question.correct_ans }}</p>
            <Button icon="pi pi-pencil" aria-label="Edit" @click="getQuestion"></Button>
            <Button icon="pi pi-trash" aria-label="Delete" @click="deleteQuestion"></Button>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';


const router = useRouter();

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const emit = defineEmits(['remove_question']);

const getQuestion = () => {
    router.push(`/quiz/${router.currentRoute.value.params.quiz_id}/question/${props.question.question_id}`);
}

const deleteQuestion = async () => {
    try {
        await axios.delete(`http://localhost:3000/api/question/${props.question.question_id}`, { withCredentials: true });
        emit('remove_question', props.question.question_id);
    } catch (error) {
        console.error(error);
    }
}

</script>

<style scoped>
.p-card {
    background-color: #1D3557;
    color: aliceblue;
}

</style>