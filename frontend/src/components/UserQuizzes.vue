<template>
    <div class="container">
        <Button label="Manage quizzes" @click="manageQuizzes" v-if="userRole === 'admin'"/>
        <ul>
            <QuizListItem v-for="quiz in quizzes" :key="quiz.id" :quiz="quiz"></QuizListItem>
        </ul>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import QuizListItem from '../components/QuizListItem.vue';
import { useUserStore } from '../store';
import { useRouter } from 'vue-router';

const quizzes = ref([]);

const userStore = useUserStore();
const userRole = userStore.user_role;

const router = useRouter();

const manageQuizzes = () => {
    router.push('/manage-quizzes');
};

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/all-quizzes', { withCredentials: true });
        quizzes.value = response.data;
        //console.log('there', response.data);
    } catch (error) {
        console.error(error);
    }
});

</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}
</style>