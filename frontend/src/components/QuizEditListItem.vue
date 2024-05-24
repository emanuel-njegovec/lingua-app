<template>
    <Card v-if="quiz">
        <template #title>
            {{ quiz.quiz_name }}
        </template>
        <template #content>
            <p>{{ quiz.description }}</p>
            <Button icon="pi pi-pencil" aria-label="Edit" @click="getQuiz"></Button>
            <Button icon="pi pi-trash" aria-label="Delete" @click="deleteQuiz"></Button>
        </template>    
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';

const router = useRouter();

const props = defineProps({
    quiz: Object
});
const emit = defineEmits(['remove']);

const getQuiz = () => {
    router.push('/manage-quizzes/' + props.quiz.quiz_id);
}

const deleteQuiz = async () => {
    try {
        await axios.delete(`${API_URL}/quiz/${props.quiz.quiz_id}`, { withCredentials: true });
        emit('remove', props.quiz.quiz_id);
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