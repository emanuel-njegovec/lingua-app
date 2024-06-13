<template>
    <div class="container">
        <TheHeader></TheHeader>
        <div class="content">
            <ul>
                <QuizEditListItem v-for="quiz in quizzes" :key="quiz.id" :quiz="quiz" @remove="removeItem"></QuizEditListItem>
            </ul>
            <Card class="bottom-btns">
                <template #content>
                    <Button label="Dodaj novi kviz" @click="newQuiz"/>
                    <Button label="Završi" @click="goHome"/>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import QuizEditListItem from '../components/QuizEditListItem.vue';
import TheHeader from '@/components/TheHeader.vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/store';

import { API_URL } from '@/config';

const languageStore = useLanguageStore();

const quizzes = ref([]);

const router = useRouter();

const goHome = () => {
    router.go(-1);
};

const newQuiz = async () => {
    try {
        const response = await axios.post(`${API_URL}/quiz`, { lang: languageStore.language }, { withCredentials: true });
        const quiz_id = response.data[0].quiz_id;
        router.push('/manage-quizzes/' + quiz_id);
    } catch (error) {
        console.error(error);
    }
}

const removeItem = (quizToRemove) => {
    const index = quizzes.value.findIndex(quiz => quiz.quiz_id === quizToRemove);
    if (index !== -1) {
        quizzes.value.splice(index, 1);
    }
};

onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/quiz/all/${languageStore.language}`, { withCredentials: true });
        quizzes.value = response.data;
        //console.log('there', response.data);
    } catch (error) {
        console.error(error);
    }
});

</script>

<style scoped>
.content {
    width: 100%;
}
ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    
}
:deep(.bottom-btns) {
    position: fixed;
    bottom: 0px;
    width: 100%; 
    box-shadow: 0px -2px 10px 0px rgba(0,0,0,0.1);  
}
:deep(.bottom-btns .p-card-body) {
    width: 100%;
}
:deep(.bottom-btns .p-card-content) {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
@media (min-width: 768px) {
    ul {
        width: 800px;
    }
}
</style>