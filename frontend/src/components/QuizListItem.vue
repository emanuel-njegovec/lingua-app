<template>
    <Card v-if="quiz">
        <template #title>
            {{ quiz.quiz_name }}
        </template>
        <template #content>
            <p>{{ quiz.description }}</p>
            <Button icon="pi pi-pencil" aria-label="Edit" @click="getQuiz"></Button>
            <Button icon="pi pi-trash" aria-label="Delete" @click="deleteQuiz"></Button>
            <Button icon="pi pi-play" aria-label="Start"></Button>
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

const props = defineProps({
    quiz: Object
});
const emit = defineEmits(['remove']);
//console.log('here', props.quiz);

const getQuiz = () => {
    router.push('/quiz/' + props.quiz.quiz_id);
}

const deleteQuiz = async () => {
    try {
        await axios.delete(`http://localhost:3000/api/quiz/${props.quiz.quiz_id}`, { withCredentials: true });
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