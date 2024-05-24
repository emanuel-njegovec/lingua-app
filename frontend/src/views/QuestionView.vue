<template>
    <div>
        <TheHeader />
        <div class="container">
            <h1>Question</h1>
            <MultipleChoiceQInput v-if="question && type === 'multiple_choice'" :question="question"/>
            <WriteInQInput v-if="question && type === 'write_in'" :question="question"/>
            <FillInQInput v-if="question && type === 'fill_in'" :question="question"/>
        </div>
    </div>
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import MultipleChoiceQInput from '@/components/MultipleChoiceQInput.vue';
import WriteInQInput from '@/components/WriteInQInput.vue';
import FillInQInput from '@/components/FillInQInput.vue';
import { API_URL } from '@/config';

const route = useRoute();
const param = route.params.question_id;


// eslint-disable-next-line
const question = ref({});
const type = ref('');


onMounted(async () => {
    try {
        const response = await axios.get(`${API_URL}/question/${param}`, { withCredentials: true });
        //console.log('there', response.data);
        question.value = response.data;
        type.value = question.value[0].q_type;
        console.log(type.value);
        //quizData.value.quiz_name = quiz.value[0].quiz_name;
        //quizData.value.description = quiz.value[0].description;
    } catch (error) {
        console.error(error);
    }
});


</script>