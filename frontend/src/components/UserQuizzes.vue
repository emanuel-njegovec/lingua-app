<template>
    <div class="container">
        <ul>
            <QuizListItem v-for="quiz in quizzes" :key="quiz.id" :quiz="quiz"></QuizListItem>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import QuizListItem from '../components/QuizListItem.vue';

const quizzes = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/all-quizzes', { withCredentials: true });
        quizzes.value = response.data;
        console.log('there', response.data);
    } catch (error) {
        console.error(error);
    }
});

</script>