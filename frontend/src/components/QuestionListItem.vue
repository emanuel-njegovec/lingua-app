<template>
    <Card v-if="question">
        <template #content>
            <div class="question-item-content">
                <h2>{{ question.question_text }}</h2>
                <Image v-if="question.image_url" :src="question.image_url" alt="Question Image" width="250"/>
                <p>{{ question.correct_ans }}</p>
            </div>
            <div class="question-item-btns">
                <Button label="Uredi" @click="getQuestion"></Button>
                <Button label="Obriši" @click="deleteQuestion" severity="danger"></Button>
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Image from 'primevue/image';
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';


const router = useRouter();

// eslint-disable-next-line
const props = defineProps({
    question: Object
});

const emit = defineEmits(['remove_question']);

const getQuestion = () => {
    router.push(`/manage-quizzes/${router.currentRoute.value.params.quiz_id}/question/${props.question.question_id}`);
}

const deleteQuestion = async () => {
    try {
        await axios.delete(`${API_URL}/question/${props.question.question_id}`, { withCredentials: true });
        emit('remove_question');
    } catch (error) {
        console.error(error);
    }
}

</script>

<style scoped>
:deep(.p-card-content) {
    display: flex;
    justify-content: space-around;
}
.question-item-btns {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    flex: 1;
}
.question-item-content {
    flex: 3;
}
</style>